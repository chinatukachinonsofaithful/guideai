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

  // Update the last assistant message chunk by chunk
  const appendToLastMessage = useCallback((chunk) => {
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (!last || last.role !== "assistant") return prev;
      return [...prev.slice(0, -1), { ...last, content: last.content + chunk }];
    });
  }, []);

  const askAI = useCallback(
    async (prompt) => {
      setLoading(true);
      setError(null);

      // Add empty assistant message — will be filled chunk by chunk
      const assistantMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      try {
        const res = await fetch(
          "https://guideai-backend.onrender.com/api/ask",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              prompt,
              history: messages.map(({ role, content }) => ({ role, content })),
            }),
          },
        );

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Server error: ${res.status}`);
        }

        // Read the stream
        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // Decode the chunk
          const text = decoder.decode(value, { stream: true });
          const lines = text.split("\n");

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.replace("data: ", "").trim();

            // Stream complete
            if (data === "[DONE]") break;

            try {
              const parsed = JSON.parse(data);

              // Handle error from backend
              if (parsed.error) {
                throw new Error(parsed.error);
              }

              // Append chunk to last message
              if (parsed.chunk) {
                appendToLastMessage(parsed.chunk);
              }
            } catch (parseErr) {
              // Skip malformed chunks
            }
          }
        }
      } catch (err) {
        console.error("askAI error:", err);
        setError(err.message);
        // Update the empty assistant message with error
        appendToLastMessage(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    },
    [messages, appendToLastMessage],
  );

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
