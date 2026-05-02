import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import Link from "next/link";
import NotificationsIcon from "@mui/icons-material/Notifications";

export default function Navbar() {
  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
      <Toolbar>
        <NotificationsIcon sx={{ mr: 2, color: "primary.main" }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: "bold" }}>
          Campus Connect
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button component={Link} href="/" color="inherit">
            All Notifications
          </Button>
          <Button component={Link} href="/priority" variant="outlined" color="primary">
            Priority Inbox
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
