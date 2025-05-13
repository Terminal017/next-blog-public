import "@/styles/article_details.css";

// export const metadata = {
//   title: "ST Blog",
//   description: "A blog based on Next.js",
//   icons: { icon: "/favicon.png" },
// };

// //静态导出视口设置
// export const viewport = {
//   width: "device-width",
//   initialScale: 1,
// };

export default async function ArticleDetailsLayout({ children }) {
  return <main className="article-details-page relative">{children}</main>;
}
