"use client";

import { useEffect } from "react";
import { Log } from "../logging_middleware/logger";
import { computeScore } from "../utils/priorityInbox";

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: "placement" | "event" | "result";
  timestamp: string;
  read: boolean;
}

interface NotificationListProps {
  notifications: Notification[];
  loading: boolean;
  onMarkRead: (id: number) => void;
  onDismiss: (id: number) => void;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  loading,
  onMarkRead,
  onDismiss,
}) => {
  useEffect(() => {
    Log("frontend", "info", "NotificationList", "NotificationList component mounted");

    return () => {
      Log("frontend", "info", "NotificationList", "NotificationList component unmounted");
    };
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      Log("frontend", "info", "NotificationList", `Rendering ${notifications.length} notifications`);
    }
  }, [notifications]);

  const handleMarkAsRead = (notification: Notification) => {
    Log(
      "frontend",
      "info",
      "NotificationList",
      `User marked notification #${notification.id} ("${notification.title}") as read`
    );
    onMarkRead(notification.id);
  };

  const handleDismiss = (notification: Notification) => {
    Log(
      "frontend",
      "info",
      "NotificationList",
      `User dismissed notification #${notification.id} ("${notification.title}")`
    );
    onDismiss(notification.id);
  };

  const getTypeIcon = (type: Notification["type"]): string => {
    switch (type) {
      case "placement": return "💼";
      case "result": return "📊";
      case "event": return "🎉";
      default: return "🔔";
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
        <p className="loading-text">Fetching notifications...</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📭</div>
        <h3 className="empty-title">No Notifications Yet</h3>
        <p className="empty-desc">Click &quot;Fetch Notifications&quot; to load your campus updates</p>
      </div>
    );
  }

  return (
    <div className="notification-grid">
      {notifications.map((n, index) => (
        <div
          key={n.id}
          className={`notification-card ${n.read ? "notification-card--read" : ""} notification-card--${n.type}`}
        >
          <div className="card-accent"></div>
          <div className="card-content">
            <div className="card-top">
              <div className="card-badge-row">
                <span className="card-priority-rank">{index + 1}</span>
                <span className="card-icon">{getTypeIcon(n.type)}</span>
                <span className={`card-badge card-badge--${n.type}`}>
                  {n.type.toUpperCase()}
                </span>
              </div>
              <time className="card-time">🕐 {n.timestamp}</time>
            </div>

            <h3 className="card-title">{n.title}</h3>
            <p className="card-message">{n.message}</p>

            <div className="card-footer">
              {!n.read ? (
                <button className="card-btn" onClick={() => handleMarkAsRead(n)}>
                  ✓ Mark as Read
                </button>
              ) : (
                <span className="card-read-label">✓ Read</span>
              )}
              <button className="card-btn card-btn--dismiss" onClick={() => handleDismiss(n)}>
                ✕ Dismiss
              </button>
              <span className="card-score">Score: {computeScore(n).toFixed(4)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
