/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@edgenetai/proto'],
  output: 'export',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;

