import { MDXRemote } from 'next-mdx-remote-client/rsc'
import { getFrontmatter } from 'next-mdx-remote-client/utils'
import { get_mdx_options, mdx_components } from './mdx-process'
import { getArticleContent } from '@/features/posts/get_articles'
import { getArticleMetadata } from '@/features/posts/get_articles'
import { CommentList } from './comment_list'
import ArticleTOC from '@/components/toc'
import { auth } from '../../../../auth'
import ClientArticle from './client_fallback'
import { notFound } from 'next/navigation'

import type { Metadata } from 'next'
import type { MDXRemoteProps } from 'next-mdx-remote-client/rsc'
import type { HeadingType } from '@/types/index'

//导出的dynamicParams定义方法不在路由表中的行为，为false时表示访问不存在的会自动进入404页面
export const dynamicParams = false

// 设置metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  try {
    const article = (await getArticleMetadata(slug)) || {
      title: 'unknown title',
      desc: 'no description',
      createAt: '',
      tags: [],
    }

    return {
      title: article.title,
      description: article.desc,
      authors: [{ name: 'Star Trial' }],
      openGraph: {
        title: article.title,
        description: article.desc,
        url: `https://startrails.site/article/${slug}`,
        type: 'article',
        publishedTime: article.createAt,
        authors: ['Star Trial'],
        tags: article.tags,
      },
      twitter: {
        title: article.title,
        description: article.desc,
      },
    }
  } catch {
    return {
      title: 'Article',
      description: 'Article page',
    }
  }
}

//设置动态路由，params是返回后续URL值的期约
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  //获取用户登录信息
  const session = await auth()

  const { slug } = await params

  //文章内容和服务端降级状态
  let content = ''
  let ssrFailed = false

  // 服务端获取文章内容，获取失败进行降级状态
  try {
    content = await getArticleContent(slug)
  } catch {
    ssrFailed = true
  }

  //如果查询不存在的路由则返回404页面
  if (!ssrFailed && !content) {
    notFound()
  }

  if (ssrFailed) {
    return (
      <>
        <ClientArticle slug={slug} />
        <CommentList page={slug} session={session} />
      </>
    )
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
      <CommentList page={slug} session={session} />
    </>
  )
}
