import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { PillNav } from "@/components/PillNav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.huskymillion.com"),
  title: "Pascal Pfohl — Art Direction for Moving Image, Content Production & Motion Design, Zürich",
  description: "Portfolio of Pascal Pfohl, Zürich: moving image from idea to final edit. Visual concept, direction, camera, edit and motion design for campaigns, social and brands.",
  keywords: ["Pascal Pfohl", "art direction moving image", "Art Director Bewegtbild", "motion design", "content production", "video production", "Zürich"],
  authors: [{ name: "Pascal Pfohl" }],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Pascal Pfohl — moving image from idea to final edit",
    description: "Portfolio of Pascal Pfohl, Zürich: art direction for moving image, content production + motion design, from idea to final edit.",
    url: "https://www.huskymillion.com", siteName: "Pascal Pfohl — huskymillion",
    locale: "en_US", type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Pascal Pfohl — portfolio" }],
  },
  twitter: { card: "summary_large_image", title: "Pascal Pfohl — moving image from idea to final edit",
    description: "Portfolio of Pascal Pfohl, Zürich: art direction for moving image, content production + motion design, from idea to final edit.", images: ["/og-image.jpg"] },
  icons: {
    icon:  { url: "/favicon.svg", type: "image/svg+xml" },
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        {/* Above-the-fold fonts: Brier Bold (hero title) + Mona Sans (body) */}
        <link rel="preload" href="/fonts/Brier-Bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/MonaSans-Variable.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        {/* Preconnect to Cloudflare R2 CDN to eliminate DNS + TLS overhead for media */}
        <link rel="preconnect" href="https://pub-0138911b93ac4d2288711fb008e069c8.r2.dev" />
        <link rel="dns-prefetch" href="https://pub-0138911b93ac4d2288711fb008e069c8.r2.dev" />
      </head>
      <body>
        <SmoothScrollProvider>
          {children}
          <PillNav />
        </SmoothScrollProvider>
        <Script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "dc4e4fd3c646463fb2d6603bd91bc876"}'
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
