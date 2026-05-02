import { Card, CardContent, Typography, Chip, Box, IconButton, Tooltip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CircleIcon from "@mui/icons-material/Circle";


export interface Notification {
  id: string;
  type: string;
  message: string;
  created_at: string; // Assuming standard API format
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

  const formattedDate = new Date(notification.created_at).toLocaleString();

  return (
    <Card 
      variant="outlined" 
      sx={{ 
        mb: 2, 
        opacity: isRead ? 0.6 : 1,
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
            {!isRead ? (
              <CircleIcon color="primary" sx={{ fontSize: 12 }} />
            ) : null}
            <Chip 
              label={notification.type} 
              size="small" 
              color={getTypeColor(notification.type)} 
              variant="filled"
            />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {formattedDate}
            </Typography>
            {!isRead && (
              <Tooltip title="Mark as Read">
                <IconButton size="small" onClick={() => onMarkRead(notification.id)} color="primary">
                  <CheckCircleIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
        <Typography variant="body1" sx={{ mt: 1, fontWeight: isRead ? 'normal' : 'medium' }}>
          {notification.message}
        </Typography>
      </CardContent>
    </Card>
  );
}
