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
  metadataBase: new URL("https://pascalpfohl.com"),
  title: "Pascal Pfohl — Creative Content Producer",
  description:
    "Pascal Pfohl is a creative content producer based in Munich, specialising in advertising storytelling, brand campaigns, video, motion, and photography.",
  keywords: ["creative content producer", "content production", "advertising", "video", "motion", "photography", "Munich", "Pascal Pfohl"],
  authors: [{ name: "Pascal Pfohl" }],
  openGraph: {
    title:       "Pascal Pfohl — Creative Content Producer",
    description: "Creative content production, video & motion — Munich.",
    url:         "https://pascalpfohl.com",
    siteName:    "Pascal Pfohl",
    locale:      "en_US",
    type:        "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Pascal Pfohl portfolio" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Pascal Pfohl — Creative Content Producer",
    description: "Creative content production, video & motion — Munich.",
    images:      ["/og-image.jpg"],
  },
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
