/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Allow Cloudinary Images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**", // Allows all images from your Cloudinary account
      },
    ],
  },

  // 2. Your Existing Build Config
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
