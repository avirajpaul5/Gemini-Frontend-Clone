import { useChatroomStore } from "@/store/chatroomStore";
import { useState, useRef, useEffect } from "react";

interface ChatroomUIProps {
  chatroomId: string;
}

export default function ChatroomUI({ chatroomId }: ChatroomUIProps) {
  const messages = useChatroomStore((s) => s.messages[chatroomId] || []);
  const loadInitialMessages = useChatroomStore((s) => s.loadInitialMessages);
  const [input, setInput] = useState("");
  const addMessage = useChatroomStore((s) => s.addMessage);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadInitialMessages(chatroomId);
  }, [chatroomId, loadInitialMessages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    addMessage(chatroomId, { text: trimmed, sender: "user" });
    setInput("");
  };

  return (
    <div className="max-w-2xl mx-auto bg-zinc-800 rounded-2xl shadow-xl p-4 min-h-[400px] flex flex-col">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((msg) => (
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
