"use client";
import React from "react";

interface ChatroomUIProps {
  chatroomId: string;
}

export default function ChatroomUI({ chatroomId }: ChatroomUIProps) {
  const dummyMessages = [
    {
      id: "1",
      text: "Welcome to this chatroom!",
      sender: "ai",
      timestamp: Date.now() - 10000,
    },
    {
      id: "2",
      text: "This is your first message.",
      sender: "user",
      timestamp: Date.now() - 8000,
    },
  ];

  return (
    <div className="max-w-2xl mx-auto bg-zinc-800 rounded-2xl shadow-xl p-4 min-h-[400px] flex flex-col">
      <div className="flex-1 overflow-y-auto mb-4">
        {dummyMessages.map((msg) => (
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
      </div>
      <div>
        <input
          type="text"
          className="w-full p-2 rounded border bg-zinc-900 text-white focus:outline-none focus:ring"
          placeholder="Type a message..."
          disabled
        />
      </div>
    </div>
  );
}
