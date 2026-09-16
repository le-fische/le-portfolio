import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Local files under /public need nothing. Add a pattern here before
    // referencing an image hosted elsewhere, e.g.
    // { protocol: "https", hostname: "cdn.example.com" }
    remotePatterns: [],
  },
};

export default nextConfig;
