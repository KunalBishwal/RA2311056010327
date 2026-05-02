"use client";

import { useState, useEffect } from "react";
import { Container, Typography, Box, CircularProgress, Alert } from "@mui/material";
import axios from "axios";
import Navbar from "../components/Navbar";
import NotificationCard, { Notification } from "../components/NotificationCard";
import { Log } from "../logging_middleware/logger";

export default function AllNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load read status from localStorage
    const savedReadIds = localStorage.getItem("readNotifications");
    if (savedReadIds) {
      setReadIds(new Set(JSON.parse(savedReadIds)));
    }

    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      Log("frontend", "info", "api", "Fetching ALL notifications");
      // No auth header needed — proxy handles token server-side
      const response = await axios.get("/api/notifications?limit=50");
      
      const data = response.data.notifications || response.data;
      setNotifications(Array.isArray(data) ? data : []);
      Log("frontend", "info", "api", `Successfully fetched ${Array.isArray(data) ? data.length : 0} notifications`);
    } catch (err: unknown) {
      setError("Failed to fetch notifications. Please try again.");
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      Log("frontend", "error", "api", `Failed to fetch: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = (id: string) => {
    const newReadIds = new Set(readIds);
    newReadIds.add(id);
    setReadIds(newReadIds);
    localStorage.setItem("readNotifications", JSON.stringify(Array.from(newReadIds)));
    Log("frontend", "info", "user_action", `Marked notification ${id} as read`);
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="md">
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold", mb: 4 }}>
          All Notifications
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : notifications.length === 0 ? (
          <Alert severity="info">No notifications found.</Alert>
        ) : (
          <Box>
            {notifications.map((notif) => (
              <NotificationCard 
                key={notif.ID} 
                notification={notif} 
                isRead={readIds.has(notif.ID)}
                onMarkRead={handleMarkRead}
              />
            ))}
          </Box>
        )}
      </Container>
    </>
  );
}
