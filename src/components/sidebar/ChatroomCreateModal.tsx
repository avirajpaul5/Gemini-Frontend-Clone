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
import React from "react";

interface ChatroomCreateModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (title: string) => void;
}

export default function ChatroomCreateModal({
  open,
  onOpenChange,
  onCreate,
}: ChatroomCreateModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChatroomSchema>({
    resolver: zodResolver(chatroomSchema),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Chatroom</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((data) => {
            onCreate(data.title);
            reset();
          })}
        >
          <input
            type="text"
            placeholder="Chatroom Title"
            className="border p-2 rounded w-full mb-1 bg-white dark:bg-[#232328] text-[#19191C] dark:text-[#F3F3F6] border-[#E5E6EC] dark:border-[#2C2C32] transition-colors"
            {...register("title")}
            disabled={isSubmitting}
            autoFocus
          />
          {errors.title && (
            <p className="text-red-500 text-sm mb-2">{errors.title.message}</p>
          )}
          <DialogFooter>
            <button
              type="button"
              onClick={() => {
                onOpenChange(false);
                reset();
              }}
              className="px-4 py-2 rounded border mr-2 bg-[#F3F3F6] dark:bg-[#232328] text-black dark:text-[#F3F3F6] hover:bg-[#E5E6EC] dark:hover:bg-[#232328] transition"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#1877FF] hover:bg-blue-600 text-white rounded transition"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
