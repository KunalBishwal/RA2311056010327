import type { Metadata } from "next";
import { Poppins, Playfair_Display, Lora } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-windsor",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const lora = Lora({
  variable: "--font-farnham",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Campus Notifications | Priority Inbox",
  description: "Stay updated with campus placement drives, exam results, and events.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${playfairDisplay.variable} ${lora.variable}`}>
      <body>{children}</body>
    </html>
  );
}
