import "@/styles/article_details.css";
import "@/styles/theme/highlight.css";
import ArticleLayoutWrapper from "./ani";

export default async function ArticleDetailsLayout({ children }) {
  return <ArticleLayoutWrapper>{children}</ArticleLayoutWrapper>;
}
