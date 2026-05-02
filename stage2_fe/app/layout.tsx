"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import { useEffect } from "react";
import { setToken } from "../utils/token";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    // Set the token on app initialization
    setToken(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJrYjUyMzRAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzY5OTE1NSwiaWF0IjoxNzc3Njk4MjU1LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiYzgxZjkwNWUtOTQ5OC00YjkxLWI0MTEtMDhmNjNjM2RlMDY5IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoia3VuYWwgYmlzaHdhbCIsInN1YiI6ImNkYzkwMTUyLWZjZWYtNDY2OS1hZWQ2LTg2ZWRmZTdjN2YxYSJ9LCJlbWFpbCI6ImtiNTIzNEBzcm1pc3QuZWR1LmluIiwibmFtZSI6Imt1bmFsIGJpc2h3YWwiLCJyb2xsTm8iOiJyYTIzMTEwNTYwMTAzMjciLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiJjZGM5MDE1Mi1mY2VmLTQ2NjktYWVkNi04NmVkZmU3YzdmMWEiLCJjbGllbnRTZWNyZXQiOiJwUFJ6WHlaZU5FZVpjclJkIn0.6R4OlEPSsyarts51rXDGPRdixpuxnbbG9yIRMzbE8rE"
    );
  }, []);

  return (
    <html lang="en">
      <head>
        <title>Campus Notifications | Stage 2</title>
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
