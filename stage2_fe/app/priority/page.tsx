"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Container, Typography, Box, CircularProgress, Alert, 
  Select, MenuItem, FormControl, InputLabel 
} from "@mui/material";
import axios from "axios";
import Navbar from "../../components/Navbar";
import NotificationCard, { Notification } from "../../components/NotificationCard";
import { getToken } from "../../utils/token";
import { Log } from "../../logging_middleware/logger";

export default function PriorityNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  
  // Filters
  const [limit, setLimit] = useState<number>(5);
  const [typeFilter, setTypeFilter] = useState<string>("All");

  const fetchPriorityNotifications = useCallback(async () => {
    setLoading(true);
    try {
      Log("frontend", "info", "api", `Fetching priority notifications: limit=${limit}, type=${typeFilter}`);
      const token = getToken();
      
      let url = `/api/notifications?limit=${limit}`;
      if (typeFilter !== "All") {
        url += `&notification_type=${typeFilter}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const data = response.data.notifications || response.data;
      // In a real priority inbox, we'd sort by some weight. If the backend doesn't sort, we can sort it here or assume the backend handles it.
      // The prompt asks to display limited top 'n' and filter on type using the query parameters.
      setNotifications(Array.isArray(data) ? data : []);
      Log("frontend", "info", "api", `Successfully fetched priority notifications`);
    } catch (err: unknown) {
      setError("Failed to fetch notifications. Please try again.");
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      Log("frontend", "error", "api", `Failed to fetch: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [limit, typeFilter]);

  useEffect(() => {
    const savedReadIds = localStorage.getItem("readNotifications");
    if (savedReadIds) {
      setReadIds(new Set(JSON.parse(savedReadIds)));
    }
  }, []);

  useEffect(() => {
    fetchPriorityNotifications();
  }, [fetchPriorityNotifications]);

  const handleMarkRead = (id: string) => {
    const newReadIds = new Set(readIds);
    newReadIds.add(id);
    setReadIds(newReadIds);
    localStorage.setItem("readNotifications", JSON.stringify(Array.from(newReadIds)));
    Log("frontend", "info", "user_action", `Marked priority notification ${id} as read`);
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="md">
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold", mb: 4 }}>
          Priority Inbox
        </Typography>

        <Box sx={{ mb: 4, p: 3, bgcolor: "background.paper", borderRadius: 2, border: 1, borderColor: "divider" }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
            <Box sx={{ flex: 1 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Top N Limit</InputLabel>
                <Select
                  value={limit}
                  label="Top N Limit"
                  onChange={(e) => setLimit(Number(e.target.value))}
                >
                  <MenuItem value={5}>Top 5</MenuItem>
                  <MenuItem value={10}>Top 10</MenuItem>
                  <MenuItem value={15}>Top 15</MenuItem>
                  <MenuItem value={20}>Top 20</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: 1 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Notification Type</InputLabel>
                <Select
                  value={typeFilter}
                  label="Notification Type"
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <MenuItem value="All">All Types</MenuItem>
                  <MenuItem value="Placement">Placement</MenuItem>
                  <MenuItem value="Result">Result</MenuItem>
                  <MenuItem value="Event">Event</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : notifications.length === 0 ? (
          <Alert severity="info">No priority notifications found matching your criteria.</Alert>
        ) : (
          <Box>
            {notifications.map((notif) => (
              <NotificationCard 
                key={notif.id} 
                notification={notif} 
                isRead={readIds.has(notif.id)}
                onMarkRead={handleMarkRead}
              />
            ))}
          </Box>
        )}
      </Container>
    </>
  );
}
