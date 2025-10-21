const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Don't fail build on linting warnings during production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Don't fail build on type errors during production builds (optional)
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, './src');
    return config;
  },
}

module.exports = nextConfig
