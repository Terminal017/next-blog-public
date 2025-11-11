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
}

export default nextConfig
