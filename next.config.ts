import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.NODE_ENV === "production" ? "/Gym-High-Bar-live-result" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
