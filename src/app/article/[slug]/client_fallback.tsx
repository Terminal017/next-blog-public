'use client'
import { useState } from 'react'
import ArticleTOC from '@/components/toc'
//MDX Clinet解析，相当难用那
import { MDXClient } from 'next-mdx-remote-client'
import { mdx_components } from './mdx-process'
import { LoadingAni } from '@/components/animation/ani_loading'
import type { ArticleClientGET } from '@/types/index'

export default function ClientArticle({ slug }: { slug: string }) {
  const [content, setContent] = useState<ArticleClientGET | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  async function fetchArticle() {
    setLoading(true)
    fetch(`/api/article?slug=${slug}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error`)
        }
        return res.json()
      })
      .then((data) => {
        setContent(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  if (content === null) {
    return (
      <article className="article-container min-h-148">
        {loading ? (
          <div className="mt-4 flex items-center justify-center gap-4">
            <h2 className="text-4xl font-bold">文章加载中</h2>
            <LoadingAni width={36} />
          </div>
        ) : (
          <div className="mt-4 flex justify-center">
            <h2 className="text-4xl font-bold">文章加载失败</h2>
          </div>
        )}
        <div className="mt-16 flex w-full justify-center">
          <button
            className="bg-surface-highest flex items-center rounded-sm px-4 py-3
            hover:bg-green-200"
            onClick={() => fetchArticle()}
          >
            <div className="text-xl font-medium">点击重试</div>
          </button>
        </div>
      </article>
    )
  }

  return (
    <>
      <article className="article-container">
        <h1>{content.title}</h1>
        <time>{content.date}</time>
        <MDXClient {...content.content} components={mdx_components} />
      </article>
      <ArticleTOC headings={content.headings} />
    </>
  )
}
