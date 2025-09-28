import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true
  }
  // Remove output: 'export'
};

export default nextConfig;
