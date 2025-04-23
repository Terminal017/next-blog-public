import "@/styles/globals.css";
import Header from "@/ui/head_nav";

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>ST Blog</title>
        <meta name="description" content="A blog based on Next.js" />
        <link rel="icon" href="/favicon.png" />
      </head>
      <body className="bg-background">
        <Header />
        {children}
      </body>
    </html>
  );
}
