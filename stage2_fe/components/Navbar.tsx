import { AppBar, Toolbar, Typography, Button, Box, TextField } from "@mui/material";
import Link from "next/link";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useEffect, useState } from "react";
import { getToken, setToken } from "../utils/token";

export default function Navbar() {
  const [tokenInput, setTokenInput] = useState("");

  useEffect(() => {
    const saved = getToken();
    if (saved) setTokenInput(saved);
  }, []);

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTokenInput(val);
    setToken(val);
    if (val.length > 50) {
      window.location.reload(); // Reload to trigger fetches with new token
    }
  };

  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
      <Toolbar>
        <NotificationsIcon sx={{ mr: 2, color: "primary.main" }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: "bold" }}>
          Campus Connect
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField 
            size="small" 
            placeholder="Paste your Bearer Token here..." 
            value={tokenInput}
            onChange={handleTokenChange}
            sx={{ width: 250, bgcolor: "background.paper", borderRadius: 1 }}
          />
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
