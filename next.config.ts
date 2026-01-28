import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Allow Cloudinary Images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },

  // 2. Build Configuration
  // ESLint is removed from here because it's no longer supported in the config file.
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
