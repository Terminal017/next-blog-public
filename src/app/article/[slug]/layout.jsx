import "@/styles/article_details.css";

export default async function ArticleDetailsLayout({ children }) {
  return <main className="article-details-page relative">{children}</main>;
}
