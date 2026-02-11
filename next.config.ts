import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,

  // productionBrowserSourceMaps: false,
  // compiler: {
  //   removeConsole: false,
  // },
  images: {
    domains: ["res.cloudinary.com", "via.placeholder.com"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
