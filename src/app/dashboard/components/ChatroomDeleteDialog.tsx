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
        <p>
          Are you sure you want to delete this chatroom? This cannot be undone.
        </p>
        <DialogFooter>
          <button
            type="button"
            className="px-4 py-2 rounded border mr-2"
            onClick={onCancel}
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
  );
}
