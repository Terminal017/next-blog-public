import getDB from '@/features/mongodb'

export default async function sitemap() {
  const database = await getDB()
  const collection = database.collection('articles')
  const article_data = await collection
    .find({}, { projection: { slug: 1, updateAt: 1 } })
    .toArray()

  const sitemap_static = [
    {
      url: 'https://startrails.site/',
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: 'https://startrails.site/about',
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: 'https://startrails.site/article',
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: 'https://startrails.site/project',
      lastModified: new Date(),
      priority: 0.7,
    },
  ]

  const sitemap_article = article_data.map((item) => {
    return {
      url: `https://startrails.site/article/${item.slug}`,
      lastModified: new Date(item.updateAt),
      priority: 0.5,
    }
  })

  return [...sitemap_static, ...sitemap_article]
}
