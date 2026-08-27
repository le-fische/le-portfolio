import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/le-portfolio",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
