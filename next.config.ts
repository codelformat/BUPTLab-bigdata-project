import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://140.143.193.160:10000/:path*'
      }
    ];
  }
};

export default nextConfig;
