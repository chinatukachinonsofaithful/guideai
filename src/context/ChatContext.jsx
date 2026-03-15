import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

const safeParseMessages = (raw) => {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
};

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("guideai_messages");
    return saved ? safeParseMessages(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    localStorage.setItem("guideai_messages", JSON.stringify(messages));
  }, [messages]);

  const addMessage = useCallback((role, content) => {
    const newMessage = {
      id: crypto.randomUUID(),
      role,
      content,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMessage]);
  }, []);

  const askAI = useCallback(
    async (prompt) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:5000/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            // Send history — only role and content, no UI metadata
            history: messages.map(({ role, content }) => ({ role, content })),
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Server error: ${res.status}`);
        }

        const data = await res.json();
        return data.output;
      } catch (err) {
        console.error("askAI error:", err);
        setError(err.message);
        return `Error: ${err.message}`;
      } finally {
        setLoading(false);
      }
    },
    [messages],
  ); // ← messages added as dependency

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
    localStorage.removeItem("guideai_messages");
  }, []);

  return (
    <ChatContext.Provider
      value={{ messages, addMessage, askAI, loading, error, clearChat }}
    >
      {children}
    </ChatContext.Provider>
  );
};
