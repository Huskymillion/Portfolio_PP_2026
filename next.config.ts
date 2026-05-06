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
};

export default nextConfig;
