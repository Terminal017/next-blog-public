import "@/styles/globals.css"
import Header from "@/ui/head_nav"
import { roboto, misans } from "@/ui/fonts/font"
import { cookies } from "next/headers"
import { Analytics } from "@vercel/analytics/next"

export const metadata = {
  title: "星轨前哨基地",
  description: "Orbital Command Center is online",
  keywords: ["Next.js", "React", "blog", "frontend", "Star Trails"],
  icons: { icon: "/favicon.svg" },

  //添加openGraph和twitter元数据
  openGraph: {
    title: "Star Trails",
    description: "Orbital Command Center is online",
    url: "https://startrails.site",
    type: "website",
    images: [
      {
        url: "https://startrails.site/favicon.svg",
        width: 1200,
        height: 630,
        alt: "The Icon of the BASE",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Star Trails",
    description: "Orbital Command Center is online",
    images: ["https://startrails.site/favicon.svg"],
  },
}

//静态导出视口设置
export const viewport = {
  width: "device-width",
  initialScale: 1,
}

export default async function RootLayout({ children }) {
  const cookieStore = await cookies()
  const theme = cookieStore.get("theme")?.value || "light"
  return (
    <html lang="zh-CN" className={theme}>
      <body className={`bg-background ${roboto.variable} ${misans.variable}`}>
        <Header />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
