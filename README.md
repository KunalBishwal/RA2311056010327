# Campus Notification System

A full-stack campus notification platform with a Priority Inbox that ranks notifications by type importance and recency.

## Repository Structure

```
├── notification_app_fe/       # Frontend (Next.js + TypeScript)
├── notification_app_be/       # Backend (placeholder)
├── logging_middleware/        # Shared logging middleware
├── notification_system_design.md  # Architecture & design document
└── .gitignore
```

## Stage 1 — Priority Inbox

Implements a Priority Inbox that always displays the top N most important unread notifications.

**Priority Scoring:**
- Type weight: placement (3) > result (2) > event (1)
- Recency: normalized epoch timestamp as tiebreaker
- Data structure: Custom MaxHeap (no external algorithm libraries)

**Key Features:**
- User-selectable N (5, 10, 15, 20)
- Efficient insertion of new notifications while maintaining top N
- Mark read / dismiss with automatic re-prioritization
- Centralized logging middleware
- Responsive Ivory & Donkey Brown design

## Quick Start

```bash
cd notification_app_fe
npm install
npm run dev
```
