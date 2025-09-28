import BlogList from '@/ui/blog_list'
import { article_data } from '@/lib/data'
import { notFound } from 'next/navigation'

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

  if (params_num < 1 || params_num > Math.ceil(article_data.length / 5)) {
    notFound()
  }

  return (
    <div className="flex flex-col">
      <BlogList page_number={params_num} />
    </div>
  )
}
