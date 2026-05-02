# Notification App — Frontend

A production-ready campus notification system with a **Priority Inbox** feature.  
Built with **Next.js (App Router)**, **TypeScript**, and **Vanilla CSS**.

## Features

- Priority Inbox algorithm (MaxHeap-based) — ranks by type weight + recency
- User-selectable Top N (5, 10, 15, 20)
- Efficient insertion of new notifications while maintaining priority ordering
- Mark as read / Dismiss with automatic re-prioritization
- Centralized logging middleware with server-side CORS proxy
- Responsive design (mobile + desktop)
- Ivory & Donkey Brown design system

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Vanilla CSS (no external UI frameworks)

## Getting Started

```bash
cd notification_app_fe
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Folder Structure

```
notification_app_fe/
├── app/
│   ├── api/logs/route.ts     # Server-side CORS proxy for logging
│   ├── globals.css            # Design system (Ivory + Donkey Brown)
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main dashboard + state management
├── components/
│   └── NotificationList.tsx   # Notification card list component
├── logging_middleware/
│   └── logger.ts              # Centralized Log() middleware
└── utils/
    ├── token.ts               # SSR-safe localStorage token management
    └── priorityInbox.ts       # MaxHeap priority algorithm
```
