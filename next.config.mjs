/** @type {import('next').NextConfig} */
const nextConfig = {
  // No image optimization for now
  images: {
    unoptimized: true,
  },

  // Disable trailing slashes for cleaner URLs
  trailingSlash: false,
};

export default nextConfig;
