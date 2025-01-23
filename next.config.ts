import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};
module.exports = {
  images: {
    domains: ['res.cloudinary.com', 'firebasestorage.googleapis.com'],
  },
};

export default nextConfig;
