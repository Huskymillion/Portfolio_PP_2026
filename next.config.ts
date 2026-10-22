import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Cloudflare R2 public bucket — primary media CDN
      {
        protocol: "https",
        hostname: "pub-0138911b93ac4d2288711fb008e069c8.r2.dev",
        pathname: "/**",
      },
      // Google Drive image proxy (Drive ID overrides in lib/media.ts)
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },

  async headers() {
    return [
      {
        // Security headers for every route (incl. /admin — Decap CMS only frames same-origin content)
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy",        value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options",        value: "SAMEORIGIN" },
        ],
      },
      {
        // Immutable static assets (JS/CSS chunks, fonts with content-hash names)
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Self-hosted fonts — file names change whenever a font changes
        source: "/fonts/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Other public assets (favicons, og-image, …) can be replaced under the same name
        source: "/:path(.*\\.(?:svg|ico|png|jpg|jpeg|webp))",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
