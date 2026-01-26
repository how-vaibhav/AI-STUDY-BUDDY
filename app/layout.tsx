import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Study Buddy for Bharat – Smart Study Planning for Indian Students",
  description:
    "AI-powered study planner, doubt solver, and notes summarizer for Indian college and competitive exam students.",
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body
        className="
          min-h-screen
          font-sans
          antialiased
          text-foreground
          bg-gradient-to-br
          from-background
          via-muted/30
          to-background
          selection:bg-primary/20
          selection:text-foreground
        "
      >
        {/* App content */}
        {children}

        {/* Analytics */}
        <Analytics />
      </body>
    </html>
  );
}
