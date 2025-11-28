import '@/styles/article_details.css'
import '@/styles/theme/highlight.css'

export default async function ArticleDetailsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <main className="article-details-page relative">{children}</main>
}
