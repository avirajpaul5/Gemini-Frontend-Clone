# Gemini-Style Chat App — Kuvaka Tech Assignment

[🌐 Live Demo](https://gemini-frontend-clone-aviraj-paul-s-projects.vercel.app/) | [📦 Public Repo](https://github.com/avirajpaul5/Gemini-Frontend-Clone)

---

## Project Overview

A modern, Gemini-inspired conversational AI frontend built for the Kuvaka Tech frontend developer assignment.

- **Tech Stack:** Next.js 15 (App Router), React 18, TypeScript, Tailwind CSS, Zustand, React Hook Form, Zod.
- **Core Features:** OTP authentication (country picker), chatroom management (CRUD), realistic AI chat simulation, image upload, responsive UI, state persisted in localStorage.

---

## Setup & Run Instructions

```bash
# 1. Clone the repository
git clone https://github.com/avirajpaul5/Gemini-Frontend-Clone.git
cd Gemini-Frontend-Clone

# 2. Install dependencies (pnpm, npm, or yarn)
pnpm install

# 3. Start the development server
pnpm dev

# 4. Visit the app
http://localhost:3000
```

- **Requirements:** Node.js 18+, pnpm 8+ (or npm 9/yarn 3)
- No environment variables needed (data is local-only).
- **Production deploy:** Auto-deployed to [Vercel](https://gemini-frontend-clone-aviraj-paul-s-projects.vercel.app/)

---

## Folder & Component Structure

```txt
src/
├─ app/              # Next.js App Router pages (auth, dashboard)
├─ components/       # UI: chatroom, sidebar, message, dialogs, modals, primitives
├─ hooks/            # Custom React hooks (dark mode, scroll, debounce)
├─ store/            # Zustand store slices (auth, chatrooms, messages)
├─ schemas/          # Zod schemas for form validation
├─ types/            # Shared TypeScript types
├─ styles/           # Tailwind global styles, theme config
├─ utils/            # Helpers (country code, formatting)
```

- **Components:** Split by feature (chatroom, sidebar, UI primitives) for modularity and reusability.
- **State:** Modular Zustand slices; persisted and hydrated from localStorage.

---

## Implementation Details

### Throttling & AI Delay

- **Simulated AI Reply:** After a user message, a “Gemini is typing…” indicator appears. AI response is delayed via `setTimeout` (randomized 1.2–2.5s) to mimic real-world latency and rate limits.
- **Throttle Logic:** Ensures no overlapping or too-frequent bot replies, making the chat feel natural.

### Pagination & Infinite Scroll

- **Message Pagination:** Each chatroom loads the 20 latest messages first (from state/dummy data).
- **Reverse Infinite Scroll:** As the user scrolls to the top, older messages are fetched (client-side only), with a skeleton loader shown during loading.
- **Data Model:** Messages are keyed by `chatroomId` in the Zustand store and paginated per room.

### Form Validation

- **OTP/Login/Chatroom Forms:** All major forms are built with React Hook Form and Zod schemas.
- **Validation:** Phone numbers/country codes are validated for correct pattern, length, and presence. Errors are displayed inline for instant feedback.
- **Robustness:** Prevents submission unless form is valid; keyboard and accessibility friendly.

---

## Screenshots

| Authentication (OTP)               | Chatroom Dashboard                            | Chat UI (AI Typing, Image Upload) | Mobile & Dark Mode     |
| ---------------------------------- | --------------------------------------------- | --------------------------------- | ---------------------- |
| ![Authnetication screen](auth.png) | ![Chatroom dashboard](chatroom dashboard.png) | ![Chat UI](dark mode.png)         | ![OTP screen](otp.png) |

---

> _All required documentation per Kuvaka Tech’s spec is included above. For code walk-through or more technical notes, feel free to reach out!_

---
