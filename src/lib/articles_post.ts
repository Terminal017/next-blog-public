import getDB from './mongodb'

interface ArticleListType {
  slug: string
  title: string
  img: string
  date: string
  desc: string
  tags: string[]
}

interface ArticleListData extends ArticleListType {
  content: string
}

export async function getArticleList(
  index: number,
): Promise<[number, ArticleListType[]]> {
  const db = await getDB()
  const collection = db.collection<ArticleListType>('articles')

  const articles_sum = await collection.countDocuments().catch((e) => {
    console.error('查询文章文档出错')
    return 0
  })

  const article_list = (await collection
    .find({})
    .sort({ date: -1 })
    .project({ content: 0, _id: 0 })
    .limit(5)
    .skip((index - 1) * 5)
    .toArray()
    .catch((e) => {
      console.error('查询文章列表出错', e)
      return []
    })) as ArticleListType[]

  return [articles_sum, article_list]
}

export async function getArticleContent(slug: string) {
  const db = await getDB()
  const collection = db.collection<ArticleListData>('articles')

  const doc_content = await collection.findOne({ slug: slug })

  return doc_content?.content || ''
}
