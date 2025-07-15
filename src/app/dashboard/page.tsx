"use client";
import ChatroomSidebar from "../dashboard/components/ChatroomSidebar";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen">
      <ChatroomSidebar />
      {/* Main chat UI goes here (center panel) */}
      <main className="flex-1 ml-0 lg:ml-72 p-4">
        <h1 className="text-2xl font-bold mb-6">Welcome to your Dashboard</h1>
        {/* Render selected chatroom's messages, chat input, etc. here */}
        <div className="text-gray-500 text-center mt-32">
          Select a chatroom to start chatting.
        </div>
      </main>
    </div>
  );
}
