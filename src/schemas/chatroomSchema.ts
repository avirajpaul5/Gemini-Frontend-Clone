import { z } from "zod";

export const chatroomSchema = z.object({
  title: z
    .string()
    .min(2, "Chatroom title must be at least 2 characters")
    .max(32, "Chatroom title must be at most 32 characters"),
});

export type ChatroomSchema = z.infer<typeof chatroomSchema>;
