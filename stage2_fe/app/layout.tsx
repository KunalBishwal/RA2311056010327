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
