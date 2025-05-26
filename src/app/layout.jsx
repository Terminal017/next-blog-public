import "@/styles/globals.css";
import Header from "@/ui/head_nav";
import { roboto, misans } from "@/ui/fonts/font";
import { cookies } from "next/headers";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: "Star Trail",
  description: "A blog based on Next.js",
  icons: { icon: "/favicon.svg" },
};

//静态导出视口设置
export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value || "light";
  return (
    <html lang="zh-CN" className={theme}>
      <body className={`bg-background ${roboto.variable} ${misans.variable}`}>
        <Header />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
