# Gemini Frontend Clone - Feature Checklist

## Auth
- [ ] OTP-based Login/Signup with country code (fetch from restcountries.com)
- [ ] Simulated OTP send/validation (setTimeout)
- [ ] Form validation (React Hook Form + Zod)

## Dashboard
- [ ] List of chatrooms (CRUD: create, delete, persist)
- [ ] Toast notifications for actions

## Chatroom Interface
- [ ] Display user + AI messages
- [ ] Timestamps
- [ ] Typing indicator ("Gemini is typing…")
- [ ] Throttled AI replies (delayed setTimeout)
- [ ] Infinite reverse scroll (20/page, dummy data)
- [ ] Image uploads (base64 or preview URL)
- [ ] Copy-to-clipboard on message hover
- [ ] Auto-scroll to latest message

## Global UX
- [ ] Responsive (mobile, desktop)
- [ ] Dark mode toggle
- [ ] Debounced search bar for chatrooms
- [ ] Save data to localStorage
- [ ] Loading skeletons for messages
- [ ] Toast notifications
- [ ] Keyboard accessibility

## Technical
- [ ] Zustand/Redux for state management
- [ ] Clean, modular components
- [ ] README & Deployment

