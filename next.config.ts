import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/about-us/team-members",
        destination: "/about-us/overview",
        permanent: true,
      },
      {
        source: "/our-business/industry-focus",
        destination: "/our-business/illustrative-themes",
        permanent: true,
      },
      {
        source: "/our-business/service-focus",
        destination: "/our-business/overview",
        permanent: true,
      },
      {
        source: "/our-business/transactions",
        destination: "/our-business/illustrative-themes",
        permanent: true,
      },
      {
        source: "/our-partners",
        destination: "/contact-us/our-office",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
