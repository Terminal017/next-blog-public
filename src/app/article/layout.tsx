import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: '文档 - 星轨',
    template: '%s - 星轨', // 文章标题模版
  },
  description: 'The basic information about Star Trails',
  keywords: ['Next.js', 'React', 'blog', 'frontend', 'Star Trails'],

  openGraph: {
    title: 'Star Trails',
    description: 'Well, hello world!',
    url: 'https://startrails.site/about',
    type: 'website',
    images: [
      {
        url: 'https://startrails.site/favicon.svg',
        width: 1200,
        height: 630,
        alt: 'The Icon of the BASE',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Star Trails',
    description: 'Well, hello world!',
    images: ['https://startrails.site/favicon.svg'],
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
