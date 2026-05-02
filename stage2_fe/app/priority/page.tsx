"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { 
  Container, Typography, Box, CircularProgress, Alert, 
  Select, MenuItem, FormControl, InputLabel
} from "@mui/material";
import axios from "axios";
import Navbar from "../../components/Navbar";
import NotificationCard, { Notification } from "../../components/NotificationCard";
import { Log } from "../../logging_middleware/logger";

// Weight map for priority sorting (placement > result > event)
const TYPE_WEIGHT: Record<string, number> = {
  "Placement": 3,
  "Result": 2,
  "Event": 1,
};

function getPriorityScore(n: Notification): number {
  const weight = TYPE_WEIGHT[n.Type] || 0;
  const recency = new Date(n.Timestamp).getTime();
  // Combine: weight is primary, recency is secondary (higher = more recent = higher priority)
  return weight * 1e15 + recency;
}

export default function PriorityNotificationsPage() {
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  
  // Filters
  const [limit, setLimit] = useState<number>(10);
  const [typeFilter, setTypeFilter] = useState<string>("All");

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      Log("frontend", "info", "api", `Fetching notifications for priority inbox`);
      
      // Fetch a larger set, then sort and filter client-side
      const response = await axios.get(`/api/notifications?limit=50`);
      
      const data = response.data.notifications || response.data;
      setAllNotifications(Array.isArray(data) ? data : []);
      Log("frontend", "info", "api", `Successfully fetched ${Array.isArray(data) ? data.length : 0} notifications`);
    } catch (err: unknown) {
      setError("Failed to fetch notifications. Please try again.");
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      Log("frontend", "error", "api", `Failed to fetch: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedReadIds = localStorage.getItem("readNotifications");
    if (savedReadIds) {
      setReadIds(new Set(JSON.parse(savedReadIds)));
    }
    fetchNotifications();
  }, [fetchNotifications]);

  // Priority sorted + filtered notifications
  const displayedNotifications = useMemo(() => {
    let filtered = [...allNotifications];
    
    // Filter by type if selected
    if (typeFilter !== "All") {
      filtered = filtered.filter(n => n.Type === typeFilter);
    }

    // Sort by priority: weight (placement > result > event) + recency
    filtered.sort((a, b) => getPriorityScore(b) - getPriorityScore(a));

    // Limit to top N
    return filtered.slice(0, limit);
  }, [allNotifications, typeFilter, limit]);

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
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold", mb: 2 }}>
          Priority Inbox
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Notifications sorted by priority: Placement &gt; Result &gt; Event, then by recency.
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
        ) : displayedNotifications.length === 0 ? (
          <Alert severity="info">No priority notifications found matching your criteria.</Alert>
        ) : (
          <Box>
            {displayedNotifications.map((notif, index) => (
              <Box key={notif.ID} sx={{ position: "relative" }}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    position: "absolute", left: -28, top: 16, 
                    color: "text.secondary", fontWeight: "bold" 
                  }}
                >
                  #{index + 1}
                </Typography>
                <NotificationCard 
                  notification={notif} 
                  isRead={readIds.has(notif.ID)}
                  onMarkRead={handleMarkRead}
                />
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </>
  );
}
