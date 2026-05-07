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
        // Immutable static assets (JS/CSS chunks, fonts with content-hash names)
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Public folder assets (favicons, og-image, etc.)
        source: "/:path(.*\\.(?:svg|ico|png|jpg|jpeg|webp|woff2|woff|ttf|otf))",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
