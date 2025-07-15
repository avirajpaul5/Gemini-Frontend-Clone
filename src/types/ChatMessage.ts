export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: number;
  image?: string; // for future image uploads
}
