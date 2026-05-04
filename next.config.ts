import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Google Drive image proxy (used by lib/media.ts for Drive-hosted images)
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      // Vercel Blob / other CDN — add your domain here if needed
    ],
  },
};

export default nextConfig;
