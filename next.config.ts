import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // output: 'export' // removed for dynamic API routes
};

export default nextConfig;
