import { MDXRemote } from 'next-mdx-remote-client/rsc'
import { get_mdx_options, mdx_components } from './mdx-process'
import { getArticleContent } from '@/features/posts/get_articles'
import { getArticleMetadata } from '@/features/posts/get_articles'
import { CommentList } from './comment_list'
import ArticleTOC from '@/components/toc'
import { auth } from '../../../../auth'
import ClientArticle from './client_fallback'
import { notFound } from 'next/navigation'
import ArticleAbstract from './article_abstract'

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
  // const session = await auth()

  //测试的伪造session
  const session = {
    user: {
      id: 'user-001',
      role: 'admin',
      email: 'test001@gmail.com',
      name: 'Admin',
      image:
        'https://lh3.googleusercontent.com/a/ACg8ocLG8Jk5Btg0SHI-NABEJwdhhfRKj2wRzaZTXODhMEQdlYa-smg=s96-c',
    },
    expires: '2026-012-12T10:15:30.123Z',
  }

  const { slug } = await params

  //文章内容和服务端降级状态
  let content: {
    title: string
    datetime: string
    mdxContent: string
    abstract: string
  } = { title: '', datetime: '', mdxContent: '', abstract: '' }
  let ssrFailed = false

  // 服务端获取文章内容，获取失败进行降级状态
  try {
    content = await getArticleContent(slug)
  } catch {
    ssrFailed = true
  }

  //如果查询不存在的路由则返回404页面
  if (!ssrFailed && !content.mdxContent) {
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

  return (
    <>
      <article className="article-container">
        <h1>{content.title}</h1>
        <time>{content.datetime}</time>
        <ArticleAbstract abstract={content.abstract} slug={slug} />
        <MDXRemote
          source={content.mdxContent}
          options={mdx_options as MDXRemoteProps['options']}
          components={mdx_components}
        />
      </article>
      <ArticleTOC headings={headings} />
      <CommentList page={slug} session={session} />
    </>
  )
}
