/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "export",
  trailingSlash: true,
  distDir: "dist",
  basePath: "/apps/ndf",
};

export default nextConfig;
