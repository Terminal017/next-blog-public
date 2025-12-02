import '@/styles/globals.css'
import Header from '@/components/head_nav'
import { roboto, misans } from '@/styles/fonts/font'
//类型导入
import { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: '星轨前哨基地',
  description: 'Orbital Command Center is online',
  keywords: ['Next.js', 'React', 'blog', 'frontend', 'Star Trails'],
  icons: { icon: '/favicon.svg' },

  //添加openGraph和twitter元数据
  openGraph: {
    title: 'Star Trails',
    description: 'Orbital Command Center is online',
    url: 'https://startrails.site',
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
    description: 'Orbital Command Center is online',
    images: ['https://startrails.site/favicon.svg'],
  },
}

//静态导出视口设置
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  /* 可以使用cookie获取主题用于SSR渲染，现已替换为localStorage方案，保证部分页面可以静态导出
   * localStorage方案：
   * (1) 使用useEffect，在水合后执行，会有短暂闪烁。
   * (2) 在head里注入脚本让它第一时间运行。注意，一般来说React仅管理指定的root节点内的内容，
   * 但next根布局组件会渲染整个HTML骨架，导致html标签也参加水合检查，需要添加suppressHydrationWarning忽略。
   * 还有，开发模式下记得禁用多余的插件（你也不想再看到：哇，翻译插件在改我注入的代码！）
   */

  return (
    <html lang="zh-CN" suppressHydrationWarning className="dark">
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* 默认背景色，防止白屏 */
              html.light body {
                background-color: #F6FAFE;
              }
              
              html.dark body{
                background-color: #0F1417;
              }
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // 注入JS代码，从 localStorage 获取主题并立刻更新到HTML标签
                  var theme = localStorage.getItem('theme') || 'light';
                  
                  if (!localStorage.getItem('theme')) {
                    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    theme = prefersDark ? 'dark' : 'light';
                  }
  
                  document.documentElement.className = theme;
                } catch (e) {
                  console.error('Failed to load theme:', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`text-on-background ${roboto.variable} ${misans.variable}`}
      >
        <Header />
        {children}
      </body>
    </html>
  )
}
