'use server'
import getDB from '@/features/mongodb'

import type { ArticleInfType } from '@/types/index'

export default async function getArticle(
  index: number,
): Promise<[number, ArticleInfType[]]> {
  const db = await getDB()
  const collection = db.collection<ArticleInfType>('articles')

  const articles_sum = await collection.countDocuments().catch(() => {
    return 0
  })

  const article_list = (await collection
    .find({})
    .sort({ createAt: -1 })
    .project({ _id: 1, title: 1, createAt: 1, updateAt: 1 })
    .limit(10)
    .skip((index - 1) * 10)
    .toArray()
    .catch(() => {
      return []
    })) as ArticleInfType[]

  return [articles_sum, article_list]
}
