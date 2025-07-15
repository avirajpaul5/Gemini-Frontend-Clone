import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import type { Chatroom } from "../types/Chatroom";
import { ChatMessage } from "@/types/ChatMessage";

type ChatroomState = {
  chatrooms: Chatroom[];
  addChatroom: (title: string) => void;
  deleteChatroom: (id: string) => void;
  selectedChatroomId: string | null;
  setSelectedChatroomId: (id: string | null) => void;
  messages: { [chatroomId: string]: ChatMessage[] };
  addMessage: (
    chatroomId: string,
    message: Omit<ChatMessage, "id" | "timestamp">
  ) => void;
  loadInitialMessages: (chatroomId: string) => void;
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

      messages: {},
      addMessage: (chatroomId, message) =>
        set((state) => {
          const chatMessages = state.messages[chatroomId] || [];
          return {
            messages: {
              ...state.messages,
              [chatroomId]: [
                ...chatMessages,
                {
                  ...message,
                  id: Math.random().toString(36).slice(2), // use nanoid if you like
                  timestamp: Date.now(),
                },
              ],
            },
          };
        }),
      loadInitialMessages: (chatroomId) =>
        set((state) => {
          if (state.messages[chatroomId]) return {}; // Already loaded
          return {
            messages: {
              ...state.messages,
              [chatroomId]: [
                {
                  id: "welcome",
                  text: "Welcome to this chatroom!",
                  sender: "ai",
                  timestamp: Date.now() - 10000,
                },
              ],
            },
          };
        }),
    }),
    {
      name: "chatrooms-storage",
    }
  )
);

export const useChatroomStore = chatroomStore;
