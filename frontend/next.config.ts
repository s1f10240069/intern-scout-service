import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/companies/dashboard",
        destination: "/company/students",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
