"use client";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import CookieBanner from "./components/CookieBanner";

export default function RootLayout({ children }) {
  return (
    <html lang="pl" translate="no">
      <body>
        <SessionProvider>
          {children}
          <CookieBanner />
        </SessionProvider>
      </body>
    </html>
  );
}