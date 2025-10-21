import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  output: 'standalone',
  env: {
    // Explicitly expose environment variables to client-side
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  },
  publicRuntimeConfig: {
    // Additional runtime config for client-side access
    backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
  },
  turbopack: {
    root: '/Users/raghavankarthik/ai-law-junior/frontend',
  },
};

export default nextConfig;
