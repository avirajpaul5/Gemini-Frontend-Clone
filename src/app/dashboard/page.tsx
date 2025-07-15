"use client";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ChatroomSidebar from "../../components/sidebar/ChatroomSidebar";
import { useChatroomStore } from "@/store/chatroomStore";
import ChatroomUI from "../../components/chatroom/ChatroomUI";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const setSelectedChatroomId = useChatroomStore((s) => s.setSelectedChatroomId);
  const selectedChatroomId = useChatroomStore((s) => s.selectedChatroomId);
  const chatrooms = useChatroomStore((s) => s.chatrooms);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar (Sheet) */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        
        {!sidebarOpen && (
          <SheetTrigger asChild>
            <button
              className="fixed top-4 left-4 z-30 p-2 rounded bg-zinc-900 text-white shadow-lg"
              aria-label="Open Sidebar"
            >
              ☰
            </button>
          </SheetTrigger>
        )}

        
        <SheetContent
          side="left"
          className="p-0 w-72 bg-zinc-900 border-r border-zinc-800"
        >
          <ChatroomSidebar onSelectChatroom={setSelectedChatroomId} />
        </SheetContent>
      </Sheet>

      
      <main
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-0 lg:ml-72" : ""
        } p-4`}
      >
        {!selectedChatroomId ? (
          <div className="text-gray-500 text-center mt-32">
            Select a chatroom to start chatting.
          </div>
        ) : (
          <ChatroomUI chatroomId={selectedChatroomId} />
        )}
      </main>
    </div>
  );
}
