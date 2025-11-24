import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // React Strict Mode for better development warnings
  reactStrictMode: true,

  // Statically typed links
  typedRoutes: true,

  // TypeScript environment variable IntelliSense
  experimental: {
    typedEnv: true,
  },

  // Image optimization (keep current setting)
  images: {
    unoptimized: true,
  },

  // Clean URLs without trailing slashes
  trailingSlash: false,
};

export default nextConfig;
