"use client";
import { useChatroomStore } from "@/store/chatroomStore";
import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { chatroomSchema, ChatroomSchema } from "@/schemas/chatroomSchema";
import toast from "react-hot-toast";

const TrashIcon = () => (
  <span aria-label="Delete" title="Delete">
    🗑️
  </span>
);
const PlusIcon = () => (
  <span aria-label="New Chat" title="New Chat">
    ＋
  </span>
);

interface ChatroomSidebarProps {
  closeSidebar?: () => void;
  onSelectChatroom?: (id: string) => void;
}

export default function ChatroomSidebar({
  closeSidebar,
  onSelectChatroom,
}: ChatroomSidebarProps) {
  const chatrooms = useChatroomStore((state) => state.chatrooms);
  const addChatroom = useChatroomStore((state) => state.addChatroom);
  const deleteChatroom = useChatroomStore((state) => state.deleteChatroom);
  const selectedChatroomId = useChatroomStore((s) => s.selectedChatroomId);

  const [openCreate, setOpenCreate] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChatroomSchema>({
    resolver: zodResolver(chatroomSchema),
  });

  const onCreate = (data: ChatroomSchema) => {
    addChatroom(data.title);
    setOpenCreate(false);
    reset();
    toast.success("Chatroom created!");
  };

  const onDelete = () => {
    if (deleteId) {
      deleteChatroom(deleteId);
      setDeleteId(null);
      toast.success("Chatroom deleted.");
    }
  };

  const filteredChatrooms = useMemo(() => {
    if (!search.trim()) return chatrooms;
    return chatrooms.filter((c) =>
      c.title.toLowerCase().includes(search.trim().toLowerCase())
    );
  }, [chatrooms, search]);

  // Sidebar UI
  return (
    <aside className="relative flex flex-col h-full w-72 bg-zinc-900 border-r border-zinc-800 p-4">
      {closeSidebar && (
        <button
          onClick={closeSidebar}
          className="absolute top-4 right-4 p-2 rounded bg-zinc-800 text-white hover:bg-zinc-700 transition"
          aria-label="Close Sidebar"
        >
          ×
        </button>
      )}
      <h2 className="text-xl font-semibold mb-4">Chatrooms</h2>
      <input
        type="text"
        className="mb-4 px-3 py-2 border rounded w-full bg-zinc-800 text-white placeholder:text-zinc-400"
        placeholder="Search chatrooms..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Search chatrooms"
      />
      <div className="flex-1 overflow-auto">
        {filteredChatrooms.length === 0 ? (
          <p className="text-gray-500 text-sm mt-8">No chatrooms found.</p>
        ) : (
          <ul>
            {filteredChatrooms.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between border-b border-zinc-800 py-2 group"
              >
                <span
                  className={`truncate cursor-pointer ${
                    selectedChatroomId === c.id ? "font-bold text-blue-400" : ""
                  }`}
                  onClick={() => onSelectChatroom?.(c.id)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Select chatroom ${c.title}`}
                >
                  {c.title}
                </span>
                <button
                  onClick={() => setDeleteId(c.id)}
                  className="text-red-500 opacity-0 group-hover:opacity-100 transition"
                  aria-label="Delete Chatroom"
                  tabIndex={0}
                >
                  <TrashIcon />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        onClick={() => setOpenCreate(true)}
        className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
      >
        <PlusIcon />
        New Chatroom
      </button>
      {/* Create Chatroom Modal */}
      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Chatroom</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onCreate)}>
            <input
              type="text"
              placeholder="Chatroom Title"
              className="border p-2 rounded w-full mb-1"
              {...register("title")}
              disabled={isSubmitting}
              autoFocus
            />
            {errors.title && (
              <p className="text-red-500 text-sm mb-2">
                {errors.title.message}
              </p>
            )}
            <DialogFooter>
              <button
                type="button"
                onClick={() => {
                  setOpenCreate(false);
                  reset();
                }}
                className="px-4 py-2 rounded border mr-2"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Chatroom</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this chatroom? This cannot be
            undone.
          </p>
          <DialogFooter>
            <button
              type="button"
              className="px-4 py-2 rounded border mr-2"
              onClick={() => setDeleteId(null)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-red-600 text-white rounded"
              onClick={onDelete}
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
