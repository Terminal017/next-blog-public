import BlogList from '@/app/article/blog_list'
import { getArticleList } from '@/features/posts/get_articles'

export default async function AritclePage() {
  const [article_sum, article_list] = await getArticleList(1)

  return (
    <BlogList
      page_number={1}
      article_sum={article_sum}
      article_list={article_list}
    />
  )
}
