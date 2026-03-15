import { useState, useRef, useEffect } from "react";
import { useChat } from "../context/ChatContext";

export default function StudyInput() {
  const { addMessage, askAI, loading } = useChat();
  const [prompt, setPrompt] = useState("");
  const textareaRef = useRef(null);

  // Auto-focus input on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Auto-resize textarea as user types
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
  }, [prompt]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const trimmed = prompt.trim();
    if (!trimmed || loading) return;

    addMessage("user", trimmed);
    setPrompt("");

    // Reset textarea height after clearing
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    const answer = await askAI(trimmed);
    if (answer) {
      addMessage("assistant", answer);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    // Shift+Enter naturally inserts newline — no handling needed
  };

  const isEmpty = !prompt.trim();

  return (
    <div className="w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-3 safe-area-bottom">
      <div className="max-w-3xl mx-auto flex items-end gap-2">
        {/* Textarea */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            placeholder="Ask anything… (Enter to send, Shift+Enter for new line)"
            rows={1}
            className="w-full resize-none rounded-2xl border border-gray-300 dark:border-gray-600
              bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100
              placeholder-gray-400 dark:placeholder-gray-500
              px-4 py-3 pr-12 text-sm leading-relaxed
              focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-150 overflow-hidden"
            style={{ minHeight: "48px", maxHeight: "160px" }}
          />

          {/* Character hint — only shows when typing */}
          {prompt.length > 0 && (
            <span className="absolute bottom-2 right-3 text-[10px] text-gray-400 dark:text-gray-500 pointer-events-none">
              ⇧↵ new line
            </span>
          )}
        </div>

        {/* Send button */}
        <button
          onClick={handleSubmit}
          disabled={loading || isEmpty}
          title="Send message"
          className={`shrink-0 flex items-center justify-center
            w-11 h-11 rounded-full text-white font-medium text-lg
            transition-all duration-200 shadow-sm
            ${
              loading
                ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                : isEmpty
                  ? "bg-blue-300 dark:bg-blue-800 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:scale-95 cursor-pointer"
            }`}
        >
          {loading ? (
            // Spinner
            <svg
              className="animate-spin w-5 h-5 text-white dark:text-gray-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
          ) : (
            // Send arrow
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile hint */}
      <p className="text-center text-[10px] text-gray-400 dark:text-gray-600 mt-2 sm:hidden">
        Tap ↑ to send
      </p>
    </div>
  );
}
