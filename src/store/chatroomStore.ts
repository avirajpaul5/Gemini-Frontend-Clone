import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import type { Chatroom } from "../types/Chatroom";

type ChatroomState = {
  chatrooms: Chatroom[];
  addChatroom: (title: string) => void;
  deleteChatroom: (id: string) => void;
  selectedChatroomId: string | null;
  setSelectedChatroomId: (id: string | null) => void;
};

// Zustand store function
export const chatroomStore = create<ChatroomState>()(
  persist(
    (set) => ({
      chatrooms: [],
      addChatroom: (title) =>
        set((state) => ({
          chatrooms: [
            ...state.chatrooms,
            { id: nanoid(), title, createdAt: Date.now() },
          ],
        })),
      deleteChatroom: (id) =>
        set((state) => ({
          chatrooms: state.chatrooms.filter((c) => c.id !== id),
        })),
      selectedChatroomId: null,
      setSelectedChatroomId: (id) => set(() => ({ selectedChatroomId: id })),
    }),
    {
      name: "chatrooms-storage",
    }
  )
);

export const useChatroomStore = chatroomStore;
