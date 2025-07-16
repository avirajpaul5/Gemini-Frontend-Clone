"use client";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ChatroomSidebar from "../../components/sidebar/ChatroomSidebar";
import { useChatroomStore } from "@/store/chatroomStore";
import ChatroomUI from "../../components/chatroom/ChatroomUI";
import { Switch } from "@/components/ui/switch";
import useDarkMode from "@/hooks/useDarkMode";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const setSelectedChatroomId = useChatroomStore(
    (s) => s.setSelectedChatroomId
  );
  const selectedChatroomId = useChatroomStore((s) => s.selectedChatroomId);
  const chatrooms = useChatroomStore((s) => s.chatrooms);
  const [dark, setDark] = useDarkMode();

  const shouldShowChat = !!selectedChatroomId && chatrooms.length > 0;

  return (
    <div className="flex min-h-screen bg-[#FAFAFB] dark:bg-[#19191C] transition-colors">
      {/* Sidebar (Sheet) */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        {!sidebarOpen && (
          <SheetTrigger asChild>
            <button
              className="fixed top-4 left-4 z-30 p-2 rounded bg-white dark:bg-[#232328] text-[#19191C] dark:text-white shadow-lg border border-[#E5E6EC] dark:border-[#2C2C32] transition-colors"
              aria-label="Open Sidebar"
            >
              ☰
            </button>
          </SheetTrigger>
        )}

        <SheetContent
          side="left"
          className="p-0 w-72 bg-[#FAFAFB] dark:bg-[#19191C] border-r border-[#E5E6EC] dark:border-[#232328] transition-colors"
        >
          <ChatroomSidebar onSelectChatroom={setSelectedChatroomId} />
        </SheetContent>
      </Sheet>

      <main
        className={`flex-1 flex flex-col items-stretch justify-stretch p-4 transition-all duration-300 ${
          sidebarOpen ? "ml-0 lg:ml-72" : ""
        }`}
      >
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          <Switch
            checked={dark}
            onCheckedChange={setDark}
            id="dark-mode-toggle"
          />
          <label
            htmlFor="dark-mode-toggle"
            className="text-sm text-[#8F8F9F] dark:text-[#E5E6EC]"
          >
            Dark mode
          </label>
        </div>
        {!shouldShowChat ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-2xl font-semibold text-[#8F8F9F] dark:text-[#E5E6EC] text-center">
              Select a chatroom to get started.
            </div>
          </div>
        ) : (
          <div className="flex-1 w-full h-full">
            <ChatroomUI chatroomId={selectedChatroomId!} />
          </div>
        )}
      </main>
    </div>
  );
}
