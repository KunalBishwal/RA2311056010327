"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Campus Notifications</title>
        <meta name="description" content="Campus notification platform with priority inbox for placements, events, and results" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
