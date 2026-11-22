import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      // Missing files in /public/images fall through to a mango-colored SVG
      // so <img> requests do not 404. Files that exist in /public still win.
      fallback: [
        {
          source: '/images/:path*',
          destination: '/api/image-fallback',
        },
      ],
    }
  },
};

export default nextConfig;
