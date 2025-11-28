import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Disable Next.js image optimization for self-hosted deployment
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.instarchiver.net',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
