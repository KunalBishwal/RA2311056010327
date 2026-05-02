"use client";

import { useEffect, useState, useCallback } from "react";
import { Log } from "../logging_middleware/logger";
import { setToken } from "../utils/token";
import { getTopNPrioritized, insertAndMaintainTopN } from "../utils/priorityInbox";
import NotificationList, { Notification } from "../components/NotificationList";

const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    title: "Google On-Campus Drive",
    message: "Google is visiting campus on 15 May for SDE roles. Eligible branches: CSE, IT, ECE.",
    type: "placement",
    timestamp: "2026-05-02 09:00",
    read: false,
  },
  {
    id: 2,
    title: "Mid-Semester Results Published",
    message: "Mid-semester examination results for Semester 6 are now available on the portal.",
    type: "result",
    timestamp: "2026-05-01 14:30",
    read: false,
  },
  {
    id: 3,
    title: "Hackathon 2026 Registration Open",
    message: "Register for the annual 48-hour hackathon. Prizes worth ₹2,00,000. Last date: 10 May.",
    type: "event",
    timestamp: "2026-04-30 10:00",
    read: true,
  },
  {
    id: 4,
    title: "Microsoft Internship Results",
    message: "Internship selection results for Microsoft SWE Intern are out. Check your email.",
    type: "result",
    timestamp: "2026-04-29 16:45",
    read: false,
  },
  {
    id: 5,
    title: "Workshop: System Design Basics",
    message: "Free workshop on System Design fundamentals by Prof. Sharma. Venue: LT-3, 3 PM.",
    type: "event",
    timestamp: "2026-04-28 11:00",
    read: true,
  },
  {
    id: 6,
    title: "Amazon SDE-1 Campus Recruitment",
    message: "Final round results for Amazon SDE-1 campus recruitment have been declared.",
    type: "placement",
    timestamp: "2026-04-27 18:00",
    read: false,
  },
  {
    id: 7,
    title: "Sports Day Event",
    message: "Annual sports day on 5 May. Register for track events at the PE office.",
    type: "event",
    timestamp: "2026-04-26 08:30",
    read: true,
  },
  {
    id: 8,
    title: "End-Sem Exam Schedule Released",
    message: "End-semester examination timetable for all branches is now live on the portal.",
    type: "result",
    timestamp: "2026-04-25 12:00",
    read: false,
  },
  {
    id: 9,
    title: "TCS NQT Registration Deadline",
    message: "Last date to register for TCS National Qualifier Test is 8 May. Apply on the TCS portal.",
    type: "placement",
    timestamp: "2026-04-24 09:15",
    read: false,
  },
  {
    id: 10,
    title: "Cultural Fest — Aaruush 2026",
    message: "Aaruush inter-college cultural festival begins 12 May. Volunteer registration open.",
    type: "event",
    timestamp: "2026-04-23 13:00",
    read: true,
  },
  {
    id: 11,
    title: "CGPA Recalculation Notice",
    message: "Students with re-evaluation requests can view updated CGPA from the academic portal.",
    type: "result",
    timestamp: "2026-04-22 15:30",
    read: false,
  },
  {
    id: 12,
    title: "Infosys InfyTQ Certification",
    message: "Infosys InfyTQ certification exam scheduled for 20 May. Eligible students check email.",
    type: "placement",
    timestamp: "2026-04-21 10:00",
    read: false,
  },
  {
    id: 13,
    title: "Blood Donation Camp",
    message: "NSS Blood Donation Camp on 6 May at Main Auditorium. All students welcome.",
    type: "event",
    timestamp: "2026-04-20 08:00",
    read: true,
  },
  {
    id: 14,
    title: "Lab Internal Marks Released",
    message: "Lab internal assessment marks for all departments have been uploaded to the portal.",
    type: "result",
    timestamp: "2026-04-19 16:00",
    read: false,
  },
  {
    id: 15,
    title: "Wipro Elite NLTH Drive",
    message: "Wipro Elite NLTH on-campus drive for 2026 batch. Pre-register by 5 May.",
    type: "placement",
    timestamp: "2026-04-18 11:30",
    read: false,
  },
];

const TOP_N_OPTIONS = [5, 10, 15, 20];

interface ToastMessage {
  id: number;
  text: string;
  type: "success" | "info";
}

export default function Home() {
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [displayedNotifications, setDisplayedNotifications] = useState<Notification[]>([]);
  const [topN, setTopN] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [nextId, setNextId] = useState<number>(100);

  const [formTitle, setFormTitle] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formType, setFormType] = useState<Notification["type"]>("event");

  useEffect(() => {
    setToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJrYjUyMzRAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzY5OTE1NSwiaWF0IjoxNzc3Njk4MjU1LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiYzgxZjkwNWUtOTQ5OC00YjkxLWI0MTEtMDhmNjNjM2RlMDY5IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoia3VuYWwgYmlzaHdhbCIsInN1YiI6ImNkYzkwMTUyLWZjZWYtNDY2OS1hZWQ2LTg2ZWRmZTdjN2YxYSJ9LCJlbWFpbCI6ImtiNTIzNEBzcm1pc3QuZWR1LmluIiwibmFtZSI6Imt1bmFsIGJpc2h3YWwiLCJyb2xsTm8iOiJyYTIzMTEwNTYwMTAzMjciLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiJjZGM5MDE1Mi1mY2VmLTQ2NjktYWVkNi04NmVkZmU3YzdmMWEiLCJjbGllbnRTZWNyZXQiOiJwUFJ6WHlaZU5FZVpjclJkIn0.6R4OlEPSsyarts51rXDGPRdixpuxnbbG9yIRMzbE8rE");
    Log("frontend", "info", "page", "Notification Dashboard page loaded");
    Log("frontend", "info", "lifecycle", "App initialized and token set in localStorage");
  }, []);

  const showToast = useCallback((text: string, type: "success" | "info" = "info") => {
    const toastId = Date.now();
    setToasts((prev) => [...prev, { id: toastId, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toastId));
    }, 3000);
  }, []);

  const recomputeDisplay = useCallback(
    (all: Notification[], n: number) => {
      const prioritized = getTopNPrioritized(all, n);
      setDisplayedNotifications(prioritized);
      Log("frontend", "info", "priorityInbox", `Recomputed top ${n} from ${all.length} notifications`);
    },
    []
  );

  const fetchNotifications = useCallback(async () => {
    Log("frontend", "info", "api", "Fetch Notifications button clicked");
    setLoading(true);

    try {
      Log("frontend", "info", "api", "Fetching notifications from server");
      await new Promise<void>((resolve) => setTimeout(resolve, 1200));

      setAllNotifications(SEED_NOTIFICATIONS);
      const prioritized = getTopNPrioritized(SEED_NOTIFICATIONS, topN);
      setDisplayedNotifications(prioritized);
      setHasFetched(true);
      Log("frontend", "info", "api", `Notifications fetched — ${SEED_NOTIFICATIONS.length} total, showing top ${topN}`);
      showToast(`Loaded ${SEED_NOTIFICATIONS.length} notifications`, "success");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      Log("frontend", "error", "api", `Error fetching notifications: ${errorMessage}`);
      setAllNotifications([]);
      setDisplayedNotifications([]);
    } finally {
      setLoading(false);
      Log("frontend", "info", "api", "Fetch notifications request completed");
    }
  }, [topN, showToast]);

  const handleTopNChange = (newN: number) => {
    Log("frontend", "info", "page", `User changed Top N from ${topN} to ${newN}`);
    setTopN(newN);
    if (allNotifications.length > 0) {
      recomputeDisplay(allNotifications, newN);
    }
  };

  const clearNotifications = () => {
    Log("frontend", "info", "page", "Clear Notifications button clicked");
    setAllNotifications([]);
    setDisplayedNotifications([]);
    setHasFetched(false);
    showToast("All notifications cleared", "info");
    Log("frontend", "info", "page", "Notifications cleared successfully");
  };

  const handleMarkRead = (id: number) => {
    const updatedAll = allNotifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    setAllNotifications(updatedAll);
    recomputeDisplay(updatedAll, topN);
    showToast("Notification marked as read", "success");
  };

  const handleDismiss = (id: number) => {
    Log("frontend", "info", "page", `Dismissing notification #${id}`);
    const updatedAll = allNotifications.filter((n) => n.id !== id);
    setAllNotifications(updatedAll);
    recomputeDisplay(updatedAll, topN);
    showToast("Notification dismissed", "info");
  };

  const handleAddNotification = () => {
    if (!formTitle.trim() || !formMessage.trim()) return;

    const newNotification: Notification = {
      id: nextId,
      title: formTitle.trim(),
      message: formMessage.trim(),
      type: formType,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
      read: false,
    };

    Log("frontend", "info", "page", `Adding new notification: "${newNotification.title}" (${newNotification.type})`);

    const { topN: newTopN, all: newAll } = insertAndMaintainTopN(
      displayedNotifications,
      allNotifications,
      newNotification,
      topN
    );

    setAllNotifications(newAll);
    setDisplayedNotifications(newTopN);
    setNextId((prev) => prev + 1);
    setShowAddModal(false);
    setFormTitle("");
    setFormMessage("");
    setFormType("event");
    showToast(`"${newNotification.title}" added`, "success");
    Log("frontend", "info", "priorityInbox", `Inserted and recomputed top ${topN} — now ${newAll.length} total`);
  };

  const unreadCount = allNotifications.filter((n) => !n.read).length;
  const placementCount = allNotifications.filter((n) => n.type === "placement").length;

  return (
    <main className="app-container">
      <div className="hero-section">
        <div className="hero-glow"></div>
        <div className="hero-content">
          <div className="hero-icon">🔔</div>
          <h1 className="hero-title">Campus Notifications</h1>
          <p className="hero-subtitle">
            Priority Inbox — placement drives, exam results &amp; campus events ranked by importance
          </p>
        </div>
      </div>

      <div className="dashboard">
        <div className="stats-bar">
          <div className="stat-chip">
            <span className="stat-number">{allNotifications.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-chip stat-chip--unread">
            <span className="stat-number">{unreadCount}</span>
            <span className="stat-label">Unread</span>
          </div>
          <div className="stat-chip stat-chip--read">
            <span className="stat-number">{allNotifications.length - unreadCount}</span>
            <span className="stat-label">Read</span>
          </div>
          <div className="stat-chip stat-chip--priority">
            <span className="stat-number">{placementCount}</span>
            <span className="stat-label">Placements</span>
          </div>
        </div>

        <div className="action-bar">
          <button
            id="btn-fetch"
            className="btn btn--primary"
            onClick={fetchNotifications}
            disabled={loading}
          >
            <span className="btn-icon">⚡</span>
            {loading ? "Fetching..." : "Fetch Notifications"}
          </button>

          {hasFetched && (
            <button
              id="btn-add"
              className="btn btn--add"
              onClick={() => {
                Log("frontend", "info", "page", "Add Notification modal opened");
                setShowAddModal(true);
              }}
              disabled={loading}
            >
              <span className="btn-icon">＋</span>
              Add New
            </button>
          )}

          {hasFetched && (
            <button
              id="btn-clear"
              className="btn btn--danger"
              onClick={clearNotifications}
              disabled={loading}
            >
              <span className="btn-icon">🗑</span>
              Clear All
            </button>
          )}

          <div className="priority-select-wrapper">
            <label className="priority-label" htmlFor="topn-select">Top N</label>
            <select
              id="topn-select"
              className="priority-select"
              value={topN}
              onChange={(e) => handleTopNChange(Number(e.target.value))}
            >
              {TOP_N_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>

        {hasFetched && !loading && displayedNotifications.length > 0 && (
          <>
            <div className="section-heading">Priority Inbox</div>
            <p className="result-text">
              Showing top <strong>{displayedNotifications.length}</strong> of{" "}
              <strong>{allNotifications.length}</strong> notification
              {allNotifications.length !== 1 ? "s" : ""} — sorted by type weight &amp; recency
            </p>
          </>
        )}

        <NotificationList
          notifications={displayedNotifications}
          loading={loading}
          onMarkRead={handleMarkRead}
          onDismiss={handleDismiss}
        />
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Add Notification</h2>

            <div className="form-group">
              <label className="form-label" htmlFor="add-title">Title</label>
              <input
                id="add-title"
                className="form-input"
                type="text"
                placeholder="Notification title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="add-message">Message</label>
              <textarea
                id="add-message"
                className="form-textarea"
                placeholder="Notification details..."
                value={formMessage}
                onChange={(e) => setFormMessage(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="add-type">Type</label>
              <select
                id="add-type"
                className="form-select"
                value={formType}
                onChange={(e) => setFormType(e.target.value as Notification["type"])}
              >
                <option value="placement">Placement</option>
                <option value="result">Result</option>
                <option value="event">Event</option>
              </select>
            </div>

            <div className="modal-actions">
              <button
                className="btn btn--secondary"
                onClick={() => {
                  Log("frontend", "info", "page", "Add Notification modal cancelled");
                  setShowAddModal(false);
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn--primary"
                onClick={handleAddNotification}
                disabled={!formTitle.trim() || !formMessage.trim()}
              >
                <span className="btn-icon">✓</span>
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast--${toast.type}`}>
            {toast.text}
          </div>
        ))}
      </div>

      <footer className="app-footer">
        <p>Campus Notification Platform &bull; Priority Inbox System</p>
      </footer>
    </main>
  );
}