import { useChatroomStore } from "@/store/chatroomStore";
import { useState, useRef, useEffect } from "react";

interface ChatroomUIProps {
  chatroomId: string;
}

const PAGE_SIZE = 20;
export default function ChatroomUI({ chatroomId }: ChatroomUIProps) {
  // Zustand selectors
  const messages = useChatroomStore((s) => s.messages[chatroomId] || []);
  const loadInitialMessages = useChatroomStore((s) => s.loadInitialMessages);

  // Pagination from Zustand
  const pagination = useChatroomStore(
    (s) => s.pagination?.[chatroomId] || { page: 1, pageSize: PAGE_SIZE }
  );
  const setPagination = useChatroomStore((s) => s.setPagination);

  const [input, setInput] = useState("");
  const addMessage = useChatroomStore((s) => s.addMessage);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isGeminiTyping, setIsGeminiTyping] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Reset pagination and load messages on chatroom change
  useEffect(() => {
    loadInitialMessages(chatroomId);
    setPagination(chatroomId, 1);
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }, 0);
  }, [chatroomId, loadInitialMessages, setPagination]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);
  const paginatedMessages = messages.slice(
    -pagination.page * pagination.pageSize
  );

  const handleScroll = () => {
    if (!scrollRef.current) return;
    if (
      scrollRef.current.scrollTop === 0 &&
      !loadingMore &&
      paginatedMessages.length < messages.length
    ) {
      setLoadingMore(true);
      setTimeout(() => {
        setPagination(chatroomId, pagination.page + 1);
        setLoadingMore(false);
      }, 800); // Simulate network delay
    }
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    addMessage(chatroomId, { text: trimmed, sender: "user" });
    setInput("");
    setIsGeminiTyping(true);
    setTimeout(() => {
      addMessage(chatroomId, { text: getRandomGeminiReply(), sender: "ai" });
      setIsGeminiTyping(false);
    }, 1300 + Math.random() * 1000);
  };

  const GEMINI_REPLIES = [
    "That's interesting! Tell me more.",
    "How can I help you today?",
    "Let's talk about it!",
    "I'm here to chat whenever you want.",
    "Absolutely!",
    "Can you elaborate?",
  ];

  function getRandomGeminiReply() {
    return GEMINI_REPLIES[Math.floor(Math.random() * GEMINI_REPLIES.length)];
  }

  return (
    <div className="max-w-2xl mx-auto bg-zinc-800 rounded-2xl shadow-xl p-4 min-h-[400px] flex flex-col">
      <div
        className="flex-1 overflow-y-auto mb-4"
        ref={scrollRef}
        onScroll={handleScroll}
        style={{ maxHeight: "400px" }}
      >
        {loadingMore && (
          <div className="w-full flex justify-center py-2 text-gray-400 animate-pulse">
            Loading more...
          </div>
        )}
        {paginatedMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex mb-3 ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`rounded-xl px-4 py-2 max-w-xs ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-zinc-700 text-zinc-100"
              }`}
            >
              {msg.text}
              <div className="text-xs opacity-60 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}
        {isGeminiTyping && (
          <div className="flex mb-3 justify-start">
            <div className="rounded-xl px-4 py-2 max-w-xs bg-zinc-700 text-zinc-100 italic opacity-80 animate-pulse">
              Gemini is typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          className="w-full p-2 rounded border bg-zinc-900 text-white focus:outline-none focus:ring"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          autoFocus
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
          aria-label="Send"
          type="button"
        >
          Send
        </button>
      </div>
    </div>
  );
}
