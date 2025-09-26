interface ArticleDataType {
  slug: string
  title: string
  img: string
  date: string
  desc: string
  tags: string[]
}

const article_data: ArticleDataType[] = []

article_data.push({
  slug: 'prettier-format',
  title: '让Prettier格式化Tailwind CSS',
  img: 'A4.webp',
  date: '2025-09-19',
  desc: '尝试使用Prettier来格式化Tailwind CSS类名顺序',
  tags: ['prettier', 'Tailwind'],
})

article_data.push({
  slug: 'welcome-to-ts',
  title: '加入TypeScript！',
  img: 'A3.webp',
  date: '2025-09-10',
  desc: '记录关于TypeScript的学习和网站的TypeScript重构',
  tags: ['TypeScript', 'Next.js'],
})

article_data.push({
  slug: 'devlog-1-0',
  title: '基地开发日志1.0',
  img: 'A2.webp',
  date: '2025-06-07',
  desc: '详细记录基地第一阶段开发的过程，包括技术选型、页面设计和功能实现',
  tags: ['开发日志', 'Next.js'],
})

article_data.push({
  slug: 'next-darkmode',
  title: 'Next.js中Tailwindv4的深浅模式切换',
  img: 'A1.webp',
  date: '2025-05-07',
  desc: '展示如何在Next.js v15中使用Tailwind v4新版本实现深浅色模式切换。',
  tags: ['Next.js', 'Tailwind', 'dark-mode'],
})

const article_map: { [key: string]: ArticleDataType } = {}
article_data.forEach((item) => {
  article_map[item.slug] = item
})

export { article_data, article_map }
