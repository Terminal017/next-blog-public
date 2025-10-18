import BlogList from '@/ui/blog_list'
import { notFound } from 'next/navigation'
import { getArticleList } from '@/lib/server/articles_post'

export default async function AritclePage({
  params,
}: {
  params: Promise<{ page_number: string }>
}) {
  const { page_number } = await params
  const params_num = Number(page_number)
  if (!Number.isInteger(params_num)) {
    notFound()
  }

  const [articles_sum, article_list] = await getArticleList(params_num)

  if (params_num < 1 || params_num > Math.ceil(articles_sum / 5)) {
    notFound()
  }

  return (
    <div className="flex flex-col">
      <BlogList
        page_number={params_num}
        article_sum={articles_sum}
        article_list={article_list}
      />
    </div>
  )
}
