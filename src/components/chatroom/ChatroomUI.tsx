import { useChatroomStore } from "@/store/chatroomStore";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
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

  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredMsgId, setHoveredMsgId] = useState<string | null>(null);

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(true);
  }
  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
  }
  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 200 * 1024) {
        alert("Please upload an image smaller than 200KB for this demo.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 200 * 1024) {
      alert("Please upload an image smaller than 200KB for this demo.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  }

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
    if (!trimmed && !image) return; // prevent empty send
    addMessage(chatroomId, {
      text: trimmed,
      sender: "user",
      image: image || undefined,
    });
    setInput("");
    setImage(null);
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
    <div className="max-w-2xl mx-auto bg-zinc-100 dark:bg-zinc-800 rounded-2xl shadow-xl p-4 min-h-[400px] flex flex-col transition-colors">
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
            className={`group flex mb-3 ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
            onMouseEnter={() => setHoveredMsgId(msg.id)}
            onMouseLeave={() => setHoveredMsgId(null)}
          >
            <div
              className={`relative rounded-xl px-4 py-2 max-w-xs transition-colors ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white dark:bg-blue-400 dark:text-zinc-900"
                  : "bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100"
              }`}
            >
              {hoveredMsgId === msg.id && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      msg.text + (msg.image ? " [image attached]" : "")
                    );
                    toast.success("Copied to clipboard!");
                  }}
                  className="absolute -bottom-3 right-2 bg-zinc-800 dark:bg-zinc-900 text-xs text-white px-2 py-1 rounded shadow hover:bg-blue-600 dark:hover:bg-blue-500 transition z-10"
                  aria-label="Copy message"
                  type="button"
                >
                  Copy
                </button>
              )}
              {msg.text}
              {msg.image && (
                <div className="mt-2">
                  <Image
                    src={msg.image}
                    alt="Sent image"
                    className="rounded-lg border"
                    width={180}
                    height={120}
                    style={{
                      maxWidth: "11rem",
                      height: "auto",
                      maxHeight: "7rem",
                    }}
                  />
                </div>
              )}
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
            <div className="rounded-xl px-4 py-2 max-w-xs bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100 italic opacity-80 animate-pulse">
              Gemini is typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {image && (
        <div className="mb-2 flex items-center gap-3">
          <Image
            src={image}
            alt="Preview"
            className="rounded-xl border"
            width={100}
            height={100}
            style={{ maxWidth: "100%", height: "auto", maxHeight: "6rem" }}
          />
          <button
            onClick={() => setImage(null)}
            className="text-xs px-2 py-1 bg-zinc-700 dark:bg-zinc-800 rounded hover:bg-red-600 dark:hover:bg-red-700 transition text-white"
            type="button"
          >
            Remove
          </button>
        </div>
      )}
      <div
        className={`flex flex-col gap-2 ${
          isDragging
            ? "ring-2 ring-blue-400 bg-blue-100/40 dark:bg-blue-900/20"
            : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* (Your image preview goes here, if any) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 text-zinc-300 dark:text-zinc-200 hover:text-blue-400"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Attach image"
          >
            📎
          </button>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <input
            type="text"
            className="w-full p-2 rounded border bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring"
            placeholder={
              isDragging ? "Drop an image here..." : "Type a message..."
            }
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
            disabled={!input.trim() && !image}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white disabled:opacity-60"
            aria-label="Send"
            type="button"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
