import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/companies/dashboard",
        destination: "/company/students",
        permanent: false,
      },
      {
        source: "/companies/login",
        destination: "/login?account_type=company",
        permanent: false,
      },
      {
        source: "/companies/new",
        destination: "/register?account_type=company",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
