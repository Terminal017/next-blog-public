import "@/styles/globals.css";
import Header from "@/ui/head_nav";
import Script from "next/script";
import { roboto } from "@/ui/font";
import { cookies } from "next/headers";

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

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value || "light";
  return (
    <html lang="zh-CN" className={theme}>
      <body className={`bg-background ${roboto.className}`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
