import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Clerk — Orbital Debris Removal",
  description: "Kepler 13: A contactless deorbit system using laser nudge and gas drag to clear LEO of debris.",
  icons: {
    icon: '/clerk-logo-light.png',
    apple: '/clerk-logo-light.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ backgroundColor: '#080A0F', margin: 0, padding: 0 }}>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
