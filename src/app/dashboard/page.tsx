"use client";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ChatroomSidebar from "./components/ChatroomSidebar";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar (Sheet) */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        {/* Hamburger (open) button: appears when sidebar is closed */}
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

        {/* SheetContent (actual sidebar) */}
        <SheetContent
          side="left"
          className="p-0 w-72 bg-zinc-900 border-r border-zinc-800"
        >
          <ChatroomSidebar/>
        </SheetContent>
      </Sheet>

      {/* Main content shifts right only if sidebarOpen and desktop */}
      <main
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-0 lg:ml-72" : ""
        } p-4`}
      >
        <h1 className="text-2xl font-bold mb-6">Welcome to your Dashboard</h1>
        <div className="text-gray-500 text-center mt-32">
          Select a chatroom to start chatting.
        </div>
      </main>
    </div>
  );
}
