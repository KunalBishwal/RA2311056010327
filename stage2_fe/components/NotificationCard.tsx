import { Card, CardContent, Typography, Chip, Box, IconButton, Tooltip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FiberNewIcon from "@mui/icons-material/FiberNew";

// API returns uppercase field names: ID, Type, Message, Timestamp
export interface Notification {
  ID: string;
  Type: string;
  Message: string;
  Timestamp: string;
}

interface Props {
  notification: Notification;
  isRead: boolean;
  onMarkRead: (id: string) => void;
}

export default function NotificationCard({ notification, isRead, onMarkRead }: Props) {
  const getTypeColor = (type: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (type.toLowerCase()) {
      case "placement":
        return "warning";
      case "result":
        return "success";
      case "event":
        return "info";
      default:
        return "default";
    }
  };

  const formattedDate = (() => {
    try {
      return new Date(notification.Timestamp).toLocaleString();
    } catch {
      return notification.Timestamp;
    }
  })();

  return (
    <Card 
      variant="outlined" 
      sx={{ 
        mb: 2, 
        opacity: isRead ? 0.6 : 1,
        borderLeft: isRead ? "4px solid transparent" : "4px solid",
        borderLeftColor: isRead ? "transparent" : "primary.main",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: 3,
          transform: "translateY(-2px)"
        }
      }}
    >
      <CardContent sx={{ pb: "16px !important" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {!isRead && (
              <FiberNewIcon color="primary" sx={{ fontSize: 20 }} />
            )}
            <Chip 
              label={notification.Type} 
              size="small" 
              color={getTypeColor(notification.Type)} 
              variant="filled"
            />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {formattedDate}
            </Typography>
            {!isRead && (
              <Tooltip title="Mark as Read">
                <IconButton size="small" onClick={() => onMarkRead(notification.ID)} color="primary">
                  <CheckCircleIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
        <Typography variant="body1" sx={{ mt: 1, fontWeight: isRead ? 'normal' : 'medium' }}>
          {notification.Message}
        </Typography>
      </CardContent>
    </Card>
  );
}
