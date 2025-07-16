import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import React from "react";

interface ChatroomDeleteDialogProps {
  open: boolean;
  onCancel: () => void;
  onDelete: () => void;
}

export default function ChatroomDeleteDialog({
  open,
  onCancel,
  onDelete,
}: ChatroomDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Chatroom</DialogTitle>
        </DialogHeader>
        <p className="text-[#19191C] dark:text-[#F3F3F6]">
          Are you sure you want to delete this chatroom? This cannot be undone.
        </p>
        <DialogFooter>
          <button
            type="button"
            className="px-4 py-2 rounded border mr-2 bg-[#F3F3F6] dark:bg-[#232328] text-black dark:text-[#F3F3F6] hover:bg-[#E5E6EC] dark:hover:bg-[#232328] transition"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-red-600 hover:bg-red-600 text-white rounded transition"
            onClick={onDelete}
          >
            Delete
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
