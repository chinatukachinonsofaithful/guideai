import { useChat } from "../context/ChatContext";
import ReactMarkdown from "react-markdown";
import { useEffect, useRef, useState } from "react";
import SUGGESTION_BANK from "../data/suggestions";

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      title="Copy response"
      className={`ml-2 px-2 py-0.5 rounded text-xs font-medium transition-all duration-200
        ${
          copied
            ? "bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-100"
            : "bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        }`}
    >
      {copied ? "✓ Copied!" : "Copy"}
    </button>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 self-start max-w-20 shadow-sm">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

// Randomly pick 6 from the bank
const getRandomSuggestions = () => {
  const shuffled = [...SUGGESTION_BANK].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 6);
};

export default function StudyResponse({ onSuggestionClick }) {
  const { messages, loading } = useChat();
  const chatEndRef = useRef(null);

  // Pick once on mount — stable for the session
  const [suggestions] = useState(getRandomSuggestions);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-4 py-4 space-y-3">
        {/* Empty state */}
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-4">
            {/* Logo */}
            <img
              src="/guideai-logo.png"
              alt="GuideAI Logo"
              className="h-14 object-contain opacity-90"
            />

            {/* Welcome text */}
            <div className="gap-1">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                What do you want to learn today?
              </h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Ask any topic or pick a suggestion below
              </p>
            </div>

            {/* Suggestion cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg mt-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => onSuggestionClick(suggestion)}
                  className="text-xs px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700
                    text-gray-600 dark:text-gray-400
                    hover:bg-blue-50 dark:hover:bg-gray-800
                    hover:border-blue-300 dark:hover:border-blue-700
                    hover:text-blue-600 dark:hover:text-blue-400
                    transition-all duration-150 text-left leading-relaxed"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message bubbles */}
        {messages.map((msg) => (
          <div
            key={msg.id ?? msg.timestamp ?? Math.random()}
            className={`flex flex-col w-full max-w-[85%] min-w-0 ${
              msg.role === "user"
                ? "self-end items-end"
                : "self-start items-start"
            }`}
          >
            {/* Role label */}
            <span className="text-[11px] font-semibold uppercase tracking-wide mb-1 px-1 text-gray-400 dark:text-gray-500">
              {msg.role === "user" ? "You" : "GuideAI"}
            </span>

            {/* Bubble */}
            <div
              className={`w-full min-w-0 px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
                ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-bl-sm"
                }`}
            >
              {msg.role === "assistant" ? (
                <div
                  className="prose prose-sm dark:prose-invert max-w-none min-w-0
                  prose-p:my-1 prose-ul:my-1 prose-li:my-0.5
                  prose-headings:font-semibold prose-code:text-pink-600
                  dark:prose-code:text-pink-400
                  prose-pre:overflow-x-auto prose-pre:max-w-full
                  prose-code:break-words prose-p:break-words"
                >
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <p className="whitespace-pre-wrap break-words">{msg.content}</p>
              )}
            </div>

            {/* Timestamp + Copy */}
            <div className="flex items-center gap-1 mt-1 px-1">
              <span className="text-[10px] text-gray-400 dark:text-gray-500">
                {msg.time}
              </span>
              {msg.role === "assistant" && <CopyButton text={msg.content} />}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && <TypingIndicator />}

        {/* Scroll anchor */}
        <div ref={chatEndRef} />
      </div>
    </div>
  );
}
