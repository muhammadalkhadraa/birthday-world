/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["framer-motion"],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
