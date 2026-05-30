"use client";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import CookieBanner from "./components/CookieBanner";

export default function RootLayout({ children }) {
  return (
    <html lang="pl" translate="no">
      <head>
        <link rel="icon" href="/icons/icon-192.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1A73E8" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="RynekPracy" />
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />

        {/* SEO */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>RynekPracownika.pl – Odwrócone ogłoszenia o pracę</title>
        <meta name="description" content="Pierwsza polska platforma odwróconych ogłoszeń o pracę. Elektryk, kierowca, spawacz – dodaj ogłoszenie ze swoją stawką. Firmy dzwonią do Ciebie." />
        <meta name="keywords" content="ogłoszenia o pracę, praca, elektryk, kierowca, spawacz, hydraulik, odwrócony rynek pracy, Polska" />
        <meta name="author" content="rynekpracownika.pl" />
        <link rel="canonical" href="https://rynekpracownika.pl" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rynekpracownika.pl" />
        <meta property="og:title" content="RynekPracownika.pl – Ty podajesz warunki. Pracodawca dzwoni do Ciebie." />
        <meta property="og:description" content="Pierwsza polska platforma odwróconych ogłoszeń o pracę. Dodaj ogłoszenie za darmo – firmy płacą za kontakt do Ciebie." />
        <meta property="og:image" content="https://rynekpracownika.pl/api/og" />
        <meta property="og:locale" content="pl_PL" />
        <meta property="og:site_name" content="rynekpracownika.pl" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="RynekPracownika.pl – Odwrócone ogłoszenia o pracę" />
        <meta name="twitter:description" content="Dodaj ogłoszenie ze swoją stawką. Firmy dzwonią do Ciebie." />
        <meta name="twitter:image" content="https://rynekpracownika.pl/api/og" />
      </head>
      <body>
        <SessionProvider>
          {children}
          <CookieBanner />
        </SessionProvider>
      </body>
    </html>
  );
}