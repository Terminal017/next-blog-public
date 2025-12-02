import getDB from '../mongodb'
import { ArticleListType } from '@/types/index'
import { unstable_cacheTag } from 'next/cache'

interface ArticleListData extends ArticleListType {
  content: string
}

export async function getArticleList(
  index: number,
): Promise<[number, ArticleListType[]]> {
  //设置函数缓存，且永久缓存，减轻数据库压力
  'use cache'
  unstable_cacheTag(`articles`)
  const db = await getDB()
  const collection = db.collection<ArticleListType>('articles')

  const articles_sum = await collection.countDocuments().catch(() => {
    return 0
  })

  const article_list = (await collection
    .find({})
    .sort({ createAt: -1 })
    .project({ content: 0, _id: 0 })
    .limit(5)
    .skip((index - 1) * 5)
    .toArray()
    .catch(() => {
      return []
    })) as ArticleListType[]

  return [articles_sum, article_list]
}

//服务端直接获取文章内容
export async function getArticleContent(slug: string) {
  //设置函数缓存，且永久缓存，减轻数据库压力
  'use cache'
  unstable_cacheTag(`article-content-${slug}`)
  const db = await getDB()
  const collection = db.collection<ArticleListData>('articles')

  const doc_content = await collection.findOne({ slug: slug })

  return doc_content?.content || ''
}
