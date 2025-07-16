// components/ChatInputPortal.tsx
import { createPortal } from "react-dom";
import { useEffect, useState, ReactNode } from "react";

export default function ChatInputPortal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const portalRoot = document.getElementById("chat-input-portal-root");
  if (!portalRoot) return null;

  return createPortal(children, portalRoot);
}
