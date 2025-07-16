import { useChatroomStore } from "@/store/chatroomStore";
import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import ChatInputPortal from "../chatroom/ChatInputPortal";
import { useInfiniteScrollUp } from "@/hooks/useInfiniteScrollUp";

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

  // Track if user is near bottom for auto-scroll behavior
  const [isNearBottom, setIsNearBottom] = useState(true);
  const wasNearBottomRef = useRef(true);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);

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

  // Check if user is near bottom of chat
  const checkIfNearBottom = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return false;

    const threshold = 100; // pixels from bottom
    const isNear =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      threshold;

    setIsNearBottom(isNear);
    wasNearBottomRef.current = isNear;
    return isNear;
  }, []);

  // Reset pagination and load messages on chatroom change
  useEffect(() => {
    loadInitialMessages(chatroomId);
    setPagination(chatroomId, 1);
    setIsNearBottom(true);
    wasNearBottomRef.current = true;

    // Scroll to bottom after initial load
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }, 0);
  }, [chatroomId, loadInitialMessages, setPagination]);

  // Auto-scroll logic for new messages
  useEffect(() => {
    if (messages.length === 0) return;

    const latestMessage = messages[messages.length - 1];
    const shouldAutoScroll =
      latestMessage.sender === "user" || // Always scroll for user messages
      wasNearBottomRef.current; // Only scroll for AI messages if user was near bottom

    if (shouldAutoScroll) {
      // Show scroll indicator if user was not near bottom
      if (!wasNearBottomRef.current && latestMessage.sender === "user") {
        setShowScrollIndicator(true);
        setTimeout(() => setShowScrollIndicator(false), 2000);
      }

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        setIsNearBottom(true);
        wasNearBottomRef.current = true;
      }, 100);
    }
  }, [messages.length, messages]);

  // Set up scroll listener for near-bottom detection
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      checkIfNearBottom();
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [checkIfNearBottom]);

  const paginatedMessages = messages.slice(
    -pagination.page * pagination.pageSize
  );

  // Infinite scroll logic with proper scroll anchoring
  const canLoadMore = paginatedMessages.length < messages.length;

  const handleLoadMore = useCallback(() => {
    if (loadingMore) return;

    setLoadingMore(true);

    // Simulate network delay
    setTimeout(() => {
      setPagination(chatroomId, pagination.page + 1);
      setLoadingMore(false);
    }, 300);
  }, [chatroomId, pagination.page, setPagination, loadingMore]);

  const topMarkerRef = useInfiniteScrollUp({
    containerRef: scrollRef,
    canLoadMore,
    loading: loadingMore,
    onLoadMore: handleLoadMore,
    threshold: 50,
  });

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed && !image) return;

    // Force scroll to bottom for user messages
    wasNearBottomRef.current = true;
    setIsNearBottom(true);

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
    "I understand what you're saying.",
    "That's a great point!",
    "Let me think about that...",
    "Could you explain that further?",
  ];

  function getRandomGeminiReply() {
    return GEMINI_REPLIES[Math.floor(Math.random() * GEMINI_REPLIES.length)];
  }

  // Scroll to bottom function for manual use
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#FAFAFB] dark:bg-[#19191C] transition-colors rounded-2xl shadow-xl overflow-hidden max-w-2xl mx-auto">
      <div
        className="flex-1 overflow-y-auto mb-4 px-2 pb-28 relative"
        ref={scrollRef}
      >
        {/* Top marker for infinite scroll */}
        <div ref={topMarkerRef} style={{ height: 1 }}></div>

        {/* Loading indicator */}
        {loadingMore && (
          <div className="w-full flex justify-center py-4">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <span className="text-sm">Loading older messages...</span>
            </div>
          </div>
        )}

        {/* Messages */}
        {paginatedMessages.map((msg) => (
          <div
            key={msg.id}
            data-message-id={msg.id}
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
                  className="absolute -bottom-8 right-2 bg-zinc-800 dark:bg-zinc-900 text-xs text-white px-2 py-1 rounded shadow hover:bg-blue-600 dark:hover:bg-blue-500 transition z-10"
                  aria-label="Copy message"
                  type="button"
                >
                  Copy
                </button>
              )}

              {msg.text && (
                <div className="whitespace-pre-wrap">{msg.text}</div>
              )}

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

        {/* Typing indicator */}
        {isGeminiTyping && (
          <div className="flex mb-3 justify-start">
            <div className="rounded-xl px-4 py-2 max-w-xs bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100 italic opacity-80">
              <div className="flex items-center gap-1">
                <span>Gemini is typing</span>
                <div className="flex gap-1 ml-1">
                  <div className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1 h-1 bg-current rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll indicator */}
      {showScrollIndicator && (
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-40 bg-blue-500 text-white px-3 py-1 rounded-full text-sm animate-pulse">
          Scrolling to latest message...
        </div>
      )}

      {/* Scroll to bottom button */}
      {!isNearBottom && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-32 right-4 z-40 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow-lg transition-all duration-200"
          aria-label="Scroll to bottom"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>
      )}

      {/* Chat Input Portal */}
      <ChatInputPortal>
        <div className="fixed bottom-0 left-1/2 w-full max-w-2xl -translate-x-1/2 z-50 p-2 bg-[#FAFAFB] dark:bg-[#19191C]/95 border-t border-zinc-200 dark:border-zinc-700 shadow-2xl">
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
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-2 text-zinc-300 dark:text-zinc-200 hover:text-blue-400 transition-colors"
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
                className="w-full p-2 rounded border bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                aria-label="Send"
                type="button"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </ChatInputPortal>
    </div>
  );
}
