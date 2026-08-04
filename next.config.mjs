/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // 🔑 关键配置：禁止静态导出，改用 server/standalone 模式
  output: 'standalone',
  experimental: {
    serverActions: false,
  }
}

export default nextConfig
