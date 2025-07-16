import React from "react";

interface ChatroomSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ChatroomSearch({
  value,
  onChange,
}: ChatroomSearchProps) {
  return (
    <input
      type="text"
      className="mb-4 px-3 py-2 border rounded w-full bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 border-zinc-300 dark:border-zinc-700 transition-colors"
      placeholder="Search chatrooms..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Search chatrooms"
    />
  );
}
