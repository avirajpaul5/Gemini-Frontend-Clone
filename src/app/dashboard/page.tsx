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

export default function Dashboard() {
  const chatrooms = useChatroomStore((state) => state.chatrooms);
  const addChatroom = useChatroomStore((state) => state.addChatroom);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const handleDeleteClick = (id: string) => setDeleteId(id);
  const deleteChatroom = useChatroomStore((state) => state.deleteChatroom);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChatroomSchema>({
    resolver: zodResolver(chatroomSchema),
  });

  // Handle form submit
  const onSubmit = (data: ChatroomSchema) => {
    addChatroom(data.title);
    setOpen(false);
    reset();
    toast.success("Chatroom created!");
  };

  // Memoized/debounced filter
  const filteredChatrooms = useMemo(() => {
    if (!search.trim()) return chatrooms;
    return chatrooms.filter((c) =>
      c.title.toLowerCase().includes(search.trim().toLowerCase())
    );
  }, [chatrooms, search]);

  return (
    <>
      <button
        className="fixed bottom-8 right-8 z-20 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
        onClick={() => setOpen(true)}
        aria-label="Create New Chatroom"
      >
        +
      </button>
      <div className="max-w-2xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold mb-6">Your Chatrooms</h1>
        <input
          type="text"
          className="mb-4 px-3 py-2 border rounded w-full"
          placeholder="Search chatrooms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search chatrooms"
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Chatroom</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
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
                    setOpen(false);
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
                  onClick={() => {
                    if (deleteId) {
                      deleteChatroom(deleteId);
                      setDeleteId(null);
                      toast.success("Chatroom deleted.");
                    }
                  }}
                >
                  Delete
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Dialog>
        <div>
          {filteredChatrooms.length === 0 ? (
            <p className="text-gray-500">
              No chatrooms yet. Start by creating one!
            </p>
          ) : (
            <ul>
              {filteredChatrooms.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between border-b py-2 group"
                >
                  <span>{c.title}</span>
                  <button
                    onClick={() => handleDeleteClick(c.id)}
                    className="text-red-500 opacity-0 group-hover:opacity-100 transition"
                    aria-label="Delete Chatroom"
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
