/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output as static export (SPA mode) for initial migration
  output: "export",

  // Custom output directory to match Vite's dist folder
  distDir: "./dist",

  // No image optimization in static export mode
  images: {
    unoptimized: true,
  },

  // Disable trailing slashes for cleaner URLs
  trailingSlash: false,

  // Configure path aliases to match existing tsconfig.json
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": "/src",
    };
    return config;
  },
};

export default nextConfig;
