import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
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
