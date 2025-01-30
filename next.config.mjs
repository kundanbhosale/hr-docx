/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
    ignoreBuildErrors: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [{ hostname: "images.unsplash.com" }],
  },
  experimental: {
    serverComponentsExternalPackages: ["puppeteer-core"],
  },
};

export default nextConfig;
