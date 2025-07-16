import React from "react";

interface ChatroomListProps {
  chatrooms: { id: string; title: string }[];
  onDelete: (id: string) => void;
}

export default function ChatroomList({
  chatrooms,
  onDelete,
}: ChatroomListProps) {
  return (
    <div className="flex-1 overflow-auto">
      {chatrooms.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-8">
          No chatrooms found.
        </p>
      ) : (
        <ul>
          {chatrooms.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between border-b border-zinc-800 dark:border-zinc-700 py-2 group"
            >
              <span className="truncate text-zinc-900 dark:text-zinc-100">
                {c.title}
              </span>
              <button
                onClick={() => onDelete(c.id)}
                className="text-red-500 opacity-0 group-hover:opacity-100 transition"
                aria-label="Delete Chatroom"
                tabIndex={0}
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
