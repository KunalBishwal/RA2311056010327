"use client";

import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import Link from "next/link";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
      <Toolbar>
        <NotificationsIcon sx={{ mr: 2, color: "primary.main" }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: "bold" }}>
          Campus Notifications
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Button 
            component={Link} 
            href="/" 
            color="inherit"
            variant={pathname === "/" ? "contained" : "text"}
            sx={pathname === "/" ? { bgcolor: "primary.main", color: "background.default" } : {}}
          >
            All Notifications
          </Button>
          <Button 
            component={Link} 
            href="/priority" 
            variant={pathname === "/priority" ? "contained" : "outlined"} 
            color="primary"
            sx={pathname === "/priority" ? { color: "background.default" } : {}}
          >
            Priority Inbox
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
