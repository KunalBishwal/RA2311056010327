# Campus Notification System

A full-stack campus notification platform demonstrating a frontend design system, API integration, logging middleware, and Priority Inbox algorithms.

## Repository Structure

```
├── notification_app_fe/       # Stage 1: Frontend (Next.js + Vanilla CSS)
├── stage2_fe/                 # Stage 2: Frontend (Next.js + Material UI + API Integration)
├── notification_system_design.md  # Architecture & design document (Stage 1)
└── .gitignore
```

## Stage 1 — Priority Inbox (Vanilla CSS)

Located in `notification_app_fe/`. Implements a Priority Inbox that ranks notifications by type importance and recency using a custom MaxHeap algorithm and pure Vanilla CSS.

## Stage 2 — API Integration & Material UI

Located in `stage2_fe/`. This sub-directory contains the Stage 2 implementation.

**Key Features:**
- **Material UI**: Fully styled using MUI components as per requirements. No Tailwind or native CSS used for component styling.
- **API Integration**: Fetches notifications dynamically from `http://20.207.122.201/evaluation-service/notifications`.
- **CORS Bypass**: Utilizes a Next.js Server Route (`/api/notifications`) to bypass browser CORS restrictions and forward the token.
- **Multiple Pages**: 
  - `/` (Home): Displays ALL notifications fetched from the API.
  - `/priority`: Dedicated page displaying priority notifications with Top-N limit filters and Type filters matching the query parameters.
- **Read State Tracking**: Uses LocalStorage to track which notifications have been clicked/read across pages, visually dimming them.
- **Centralized Logging**: `Log()` middleware re-used from Stage 1.

## Quick Start

### For Stage 2

```bash
cd stage2_fe
npm install
npm run build
npm run start
```
