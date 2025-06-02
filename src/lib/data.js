let article_data = []

article_data.push({
  slug: "next-darkmode",
  title: "Next.js中Tailwind v4的深浅模式切换",
  img: "A1.webp",
  date: "2025-05-07",
  desc: "演示如何在Next.js v15中使用Tailwind v4新版本实现深浅色模式切换。",
  tags: ["Next.js", "Tailwind", "dark-mode"],
})



const article_map = {}
article_data.forEach((item) => {
  article_map[item.slug] = item
});

export {article_data, article_map}