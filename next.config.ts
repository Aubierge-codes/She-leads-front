import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/auth/login', destination: '/dashboard', permanent: false },
      { source: '/auth/:path*', destination: '/dashboard', permanent: false },
    ];
  },
};

export default nextConfig;
