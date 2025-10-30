import { notFound } from 'next/navigation'
import { article_map } from '../../../lib/data'
import { MDXRemote } from 'next-mdx-remote-client/rsc'
import { getFrontmatter } from 'next-mdx-remote-client/utils'
import { get_mdx_options, mdx_components } from './mdx-process'
import { getArticleContent } from '@/lib/server/articles_post'
import CommentList from './comment_list'
import ArticleTOC from '@/ui/toc'
import SignInButton from './login'

import type { Metadata } from 'next'
import type { MDXRemoteProps } from 'next-mdx-remote-client/rsc'

//导出的dynamicParams定义方法不在路由表中的行为，为false时表示访问不存在的会自动进入404页面
export const dynamicParams = false

//设置metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = article_map[slug] || {}
  return {
    title: article.title,
    description: article.desc,
    authors: [{ name: 'Star Trial' }],
    openGraph: {
      title: article.title,
      description: article.desc,
      url: `https://startrails.site/article/${slug}`,
      type: 'article',
      publishedTime: article.date,
      authors: ['Star Trial'],
      tags: article.tags,
    },
    twitter: {
      title: article.title,
      description: article.desc,
    },
  }
}

interface HeadingType {
  text: string
  id: string
}

//设置动态路由，其实params是返回后续URL值的期约
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  let content = ''

  try {
    content = await getArticleContent(slug)
  } catch {
    notFound()
  }

  const headings: HeadingType[] = []
  const mdx_options = get_mdx_options(headings)

  //提取元标签
  const { frontmatter } = getFrontmatter(content) as {
    frontmatter: Record<string, string>
  }

  const title = frontmatter.title || 'unknown title'
  const dateTime = frontmatter.datetime
    ? new Date(frontmatter.datetime).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'unknown time'

  return (
    <>
      <article className="article-container">
        <h1>{title}</h1>
        <time>{dateTime}</time>
        <MDXRemote
          source={content}
          options={mdx_options as MDXRemoteProps['options']}
          components={mdx_components}
        />
      </article>
      <ArticleTOC headings={headings} />
      <SignInButton />
      <CommentList page={slug} />
    </>
  )
}
