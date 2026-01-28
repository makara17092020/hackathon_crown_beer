/** @type {import('next').NextConfig} */
const nextConfig = {
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

  // 2. Build Config
  // ✅ REMOVED the eslint block.
  // ✅ Kept typescript ignore for now.
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
