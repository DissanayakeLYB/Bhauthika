import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Keep the phone-sized preview free of the floating dev badge.
  devIndicators: false,
};

export default nextConfig;
