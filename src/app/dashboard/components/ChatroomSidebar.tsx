"use client";
import { useChatroomStore } from "@/store/chatroomStore";
import { useState, useMemo } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ChatroomList from "./ChatroomList";
import ChatroomSearch from "./ChatroomSearch";
import ChatroomCreateModal from "./ChatroomCreateModal";
import ChatroomDeleteDialog from "./ChatroomDeleteDialog";
import toast from "react-hot-toast";

const PlusIcon = () => (
  <span aria-label="New Chat" title="New Chat">
    ＋
  </span>
);
const HamburgerIcon = () => (
  <span aria-label="Open Sidebar" title="Open Sidebar">
    ☰
  </span>
);

export default function ChatroomSidebar() {
  const chatrooms = useChatroomStore((state) => state.chatrooms);
  const addChatroom = useChatroomStore((state) => state.addChatroom);
  const deleteChatroom = useChatroomStore((state) => state.deleteChatroom);

  const [openCreate, setOpenCreate] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filteredChatrooms = useMemo(() => {
    if (!search.trim()) return chatrooms;
    return chatrooms.filter((c) =>
      c.title.toLowerCase().includes(search.trim().toLowerCase())
    );
  }, [chatrooms, search]);

  const onCreate = (title: string) => {
    addChatroom(title);
    setOpenCreate(false);
    toast.success("Chatroom created!");
  };

  const onDelete = () => {
    if (deleteId) {
      deleteChatroom(deleteId);
      setDeleteId(null);
      toast.success("Chatroom deleted.");
    }
  };

  const sidebar = (
    <aside className="flex flex-col h-full w-72 bg-zinc-900 border-r border-zinc-800 p-4">
      <h2 className="text-xl font-semibold mb-4">Chatrooms</h2>
      <ChatroomSearch value={search} onChange={setSearch} />
      <ChatroomList chatrooms={filteredChatrooms} onDelete={setDeleteId} />
      <button
        onClick={() => setOpenCreate(true)}
        className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
      >
        <PlusIcon />
        New Chatroom
      </button>
    </aside>
  );

  return (
    <>
      {/* Mobile sidebar trigger (Sheet) */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <button className="fixed top-4 left-4 z-30 p-2 rounded bg-zinc-900 text-white shadow-lg">
              <HamburgerIcon />
            </button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="p-0 w-72 bg-zinc-900 border-r border-zinc-800"
          >
            {sidebar}
          </SheetContent>
        </Sheet>
      </div>
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <div className="fixed top-0 left-0 h-full z-10">{sidebar}</div>
      </div>
      <ChatroomCreateModal
        open={openCreate}
        onOpenChange={setOpenCreate}
        onCreate={onCreate}
      />
      <ChatroomDeleteDialog
        open={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onDelete={onDelete}
      />
    </>
  );
}
