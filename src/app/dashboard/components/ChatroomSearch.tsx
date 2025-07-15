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
      className="mb-4 px-3 py-2 border rounded w-full bg-zinc-800 text-white placeholder:text-zinc-400"
      placeholder="Search chatrooms..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Search chatrooms"
    />
  );
}
