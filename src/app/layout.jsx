import "@/styles/globals.css";
import Header from "@/ui/head_nav";
import Script from "next/script";
import { roboto } from "@/ui/font";

export const metadata = {
  title: "ST Blog",
  description: "A blog based on Next.js",
  icons: { icon: "/favicon.png" },
};

//静态导出视口设置
export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <head>
        <Script id="theme-init">
          {`
            (function() {
              try {
                const theme = localStorage.getItem('theme') || 'light'
                document.documentElement.classList = theme
              } catch(e) {}
            })();
          `}
        </Script>
      </head>
      <body className={`bg-background ${roboto.className}`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
