import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow unoptimized images for pixel art that needs to be rendered precisely
    unoptimized: true,
    // Set long cache times for static images
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    // Use the built-in loader
    loader: 'default',
  },
};

export default nextConfig;
