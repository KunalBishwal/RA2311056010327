# Stage 1

# Notification System Design

**Stack:** Next.js (App Router) · TypeScript · Vanilla CSS

---

## 1. Architecture Overview

The Campus Notification Platform is a single-page, frontend-only application built with **Next.js App Router** and **TypeScript**. It implements a **Priority Inbox** that ranks campus notifications by a composite score derived from notification type weight and timestamp recency.

### High-Level Architecture

```
┌──────────────────────────────────────────────┐
│                  Browser                      │
│  ┌──────────────┐  ┌──────────────────────┐  │
│  │  page.tsx     │  │  NotificationList    │  │
│  │  (State Mgmt) │──│  (Presentation)      │  │
│  └──────┬───────┘  └──────────────────────┘  │
│         │                                     │
│  ┌──────▼───────┐  ┌──────────────────────┐  │
│  │ priorityInbox│  │  logger.ts           │  │
│  │ (MaxHeap)    │  │  (Logging Middleware) │  │
│  └──────────────┘  └──────────┬───────────┘  │
│                               │               │
│  ┌────────────────────────────▼────────────┐ │
│  │  /api/logs (Server-Side Proxy Route)     │ │
│  └────────────────────────────┬────────────┘ │
└───────────────────────────────│──────────────┘
                                │
                    ┌───────────▼───────────┐
                    │ External Evaluation   │
                    │ Logging Service        │
                    │ (20.207.122.201)       │
                    └───────────────────────┘
```

---

## 2. Priority Inbox Algorithm

### 2.1 Scoring Function

Each notification receives a composite priority score:

```
Score(n) = TypeWeight(n.type) + RecencyWeight(n.timestamp)
```

**Type Weights** (higher = more important):

| Type        | Weight | Rationale                              |
|-------------|--------|----------------------------------------|
| `placement` | 3      | Career-critical, time-sensitive        |
| `result`    | 2      | Academic importance, actionable        |
| `event`     | 1      | Informational, lower urgency           |

**Recency Weight:**

```
RecencyWeight = epoch_ms(timestamp) / 1e13
```

This normalizes timestamps into a fractional value (~0.17 for current dates) that acts as a tiebreaker within the same type tier. More recent notifications get higher fractional scores, ensuring they rank above older ones of the same type.

### 2.2 Data Structure — MaxHeap

A custom **MaxHeap** (binary heap) is implemented from scratch without any external algorithm libraries.

**Core Operations:**

| Operation      | Time Complexity | Description                              |
|----------------|-----------------|------------------------------------------|
| `insert(n)`    | O(log n)        | Insert notification and sift up          |
| `extractMax()` | O(log n)        | Remove highest-priority item and sift down |
| `getTopN()`    | O(N log n)      | Extract top N items by repeated extractMax |

**Implementation Details:**

- **Sift Up**: After insertion at the tail, compare with parent and swap upward until heap property is restored.
- **Sift Down**: After extracting root, move last element to root and swap downward with the larger child until heap property is restored.
- **Comparison**: Uses the `computeScore()` function to compare notification priorities.

### 2.3 Efficient Insertion

When a new notification is added:

1. It is appended to the master `allNotifications` array.
2. The entire array is re-heapified via `insertAndMaintainTopN()`.
3. Only the top N are extracted, maintaining O(N log n) performance.

This ensures the displayed list always reflects the globally optimal top-N ranking after each insertion.

### 2.4 Why MaxHeap?

A **MaxHeap** is ideal for this problem because:

- **Top-N extraction** is the core operation — a heap gives us the top N items in O(N log n) without sorting the entire list.
- **Insertion** is O(log n), making it efficient for incoming notifications.
- Unlike a sorted array, we don't need to maintain order across the entire dataset — only the top N matters.
- It handles dynamic updates (mark-read, dismiss) cleanly by simply rebuilding the heap from the current state.

---

## 3. State Management

### State Variables

| State                    | Type             | Purpose                                     |
|--------------------------|------------------|---------------------------------------------|
| `allNotifications`       | `Notification[]` | Complete master list of all notifications    |
| `displayedNotifications` | `Notification[]` | Top-N prioritized subset currently shown     |
| `topN`                   | `number`         | User-selected N value (5, 10, 15, 20)        |
| `loading`                | `boolean`        | Loading state for fetch simulation           |
| `hasFetched`             | `boolean`        | Whether initial fetch has occurred           |
| `showAddModal`           | `boolean`        | Modal visibility toggle                      |
| `toasts`                 | `ToastMessage[]` | Active toast notification messages           |

### State Flow

```
User Action → Log() → Update allNotifications → recomputeDisplay() → Update displayedNotifications → Re-render
```

Every state mutation triggers:
1. A `Log()` call to the middleware
2. A heap-based recomputation of the top-N display

---

## 4. Logging Middleware

### Design

The logging middleware (`Log()`) is a centralized function that sends structured log entries to an external evaluation service.

**Function Signature:**

```typescript
Log(stack: string, level: string, package: string, message: string): Promise<void>
```

### CORS Resolution

Browser-to-API calls are blocked by CORS. Solution: a Next.js API route (`/api/logs`) acts as a **server-side proxy**, forwarding requests from the browser to the external service.

```
Browser → /api/logs (Next.js Route) → http://20.207.122.201/evaluation-service/logs
```

### Integration Points

| Event Type            | Example                                         |
|-----------------------|-------------------------------------------------|
| Page load             | Token initialization, component mounting        |
| Button clicks         | Fetch, clear, add, mark-read, dismiss           |
| API calls             | Before/after fetch simulation                   |
| Error handling        | Catch blocks with error message forwarding      |
| Component lifecycle   | Mount/unmount hooks in NotificationList          |

---

## 5. Design System

### Color Palette — Ivory & Donkey Brown

| Token              | Hex       | Usage                              |
|--------------------|-----------|------------------------------------|
| `--ivory`          | `#FFFFF0` | Primary text, modal backgrounds    |
| `--donkey-dark`    | `#816E5C` | Gradient endpoints, accents        |
| `--donkey-mid`     | `#A69279` | Borders, muted text, focus states  |
| `--donkey-light`   | `#C4B49A` | Stat numbers, button text          |
| `--bg-primary`     | `#1A1612` | Page background (warm dark)        |
| `--bg-card`        | `#2A241E` | Card backgrounds                   |

### Type-Specific Accents

| Notification Type | Color     | Hex       |
|-------------------|-----------|-----------|
| Placement         | Gold      | `#C9A96E` |
| Result            | Teal      | `#7EB8A8` |
| Event             | Lavender  | `#B8A0D2` |

### Typography

- **Font**: Inter (loaded via `next/font/google`)
- **Weights**: 600 (labels), 700 (titles), 800 (headings, stats)

### Responsive Design

- **Desktop** (>600px): Side-by-side action bar, full-width cards
- **Mobile** (<=600px): Stacked layout, full-width buttons, compact stat chips

---

## 6. Component Structure

```
notification_app_fe/
├── app/
│   ├── api/logs/route.ts       # Server-side CORS proxy for logging
│   ├── globals.css              # Design system (Vanilla CSS only)
│   ├── layout.tsx               # Root layout with Inter font
│   └── page.tsx                 # Main dashboard + state management
├── components/
│   └── NotificationList.tsx     # Notification card list component
├── logging_middleware/
│   └── logger.ts                # Centralized Log() middleware
└── utils/
    ├── token.ts                 # SSR-safe localStorage token management
    └── priorityInbox.ts         # MaxHeap priority algorithm
```

---

## 7. User Interactions

| Action              | Behavior                                                          |
|---------------------|-------------------------------------------------------------------|
| Fetch Notifications | Simulates API call, loads 15 seed notifications, heap-sorts top N |
| Change Top N        | Re-extracts top N from existing pool via heap                     |
| Add Notification    | Opens modal, inserts into heap, recomputes top N                  |
| Mark as Read        | Toggles read state, recomputes (visual fade for read items)       |
| Dismiss             | Removes from master list, recomputes top N                        |
| Clear All           | Resets all state to initial                                       |

---

## 8. Performance Characteristics

| Operation                | Complexity   | Notes                                           |
|--------------------------|--------------|-------------------------------------------------|
| Initial sort (N items)   | O(N log N)   | Build heap + extract top K                      |
| Insert single item       | O(N log N)   | Full rebuild (could optimize with persistent heap) |
| Mark read / Dismiss      | O(N log N)   | State update + recompute                        |
| Change Top N             | O(N log N)   | Re-extract from heap                            |
| Render                   | O(K)         | Only top K cards rendered                       |

---

## 9. Constraints & Design Decisions

1. **No external algorithm libraries** — MaxHeap implemented from scratch in TypeScript
2. **No console.log** — All logging routed through `Log()` middleware
3. **Vanilla CSS only** — No Tailwind, no UI framework (except `next/font`)
4. **Frontend only** — No database, notifications are seeded client-side
5. **SSR-safe** — All `localStorage` access guarded with `typeof window` checks
6. **Production-grade code** — Clean, well-structured, self-documenting codebase

---

## 10. Screenshots

Screenshots of the Priority Inbox output (both desktop and mobile views) are included in the repository.
