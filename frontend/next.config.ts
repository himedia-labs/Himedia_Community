import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    qualities: [70, 75, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
        pathname: '/gh/jdecked/twemoji@15.1.0/assets/svg/**',
      },
    ],
  },
};

export default nextConfig;
