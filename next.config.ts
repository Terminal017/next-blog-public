import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  //添加允许外部图片的域名
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.startrails.site',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        // 为 Next.js Image 优化器输出设置强缓存
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

export default nextConfig
