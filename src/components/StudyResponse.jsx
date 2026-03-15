import { useChat } from "../context/ChatContext";
import ReactMarkdown from "react-markdown";
import { useEffect, useRef, useState } from "react";

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

export default function StudyResponse() {
  const { messages, loading } = useChat();
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      {/* ← overflow-x-hidden stops horizontal bleed */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-4 py-4 space-y-3">
        {/* Empty state */}
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-2 opacity-50">
            <span className="text-4xl">
              {" "}
              <img
                src="/guideai-logo.png"
                alt="GuideAI Logo"
                className="h-8 object-contain"
              />
            </span>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Ask anything to get started!
            </p>
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
                <p className="whitespace-pre-wrap break-word">{msg.content}</p>
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
