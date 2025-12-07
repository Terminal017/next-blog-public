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
        <ArticleAbstract abstract={content.abstract} />
        <MDXClient {...content.content} components={mdx_components} />
      </article>
      <ArticleTOC headings={content.headings} />
    </>
  )
}

// Ai摘要的客户端组件版本
function ArticleAbstract({ abstract }: { abstract: string }) {
  return (
    <div className="border-outline-v mt-6 w-full rounded-md border p-4">
      <div className="flex flex-row items-center gap-1">
        <div className="flex h-5 w-5 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            fill="currentColor"
          >
            <path d="M440-183v-274L200-596v274l240 139Zm80 0 240-139v-274L520-457v274Zm-40-343 237-137-237-137-237 137 237 137ZM160-252q-19-11-29.5-29T120-321v-318q0-22 10.5-40t29.5-29l280-161q19-11 40-11t40 11l280 161q19 11 29.5 29t10.5 40v318q0 22-10.5 40T800-252L520-91q-19 11-40 11t-40-11L160-252Zm320-228Z" />
          </svg>
        </div>
        <div className="text-base font-medium tracking-widest">AI摘要</div>
      </div>
      <div className="text-on-background/70 mt-2 text-sm">{abstract}</div>
    </div>
  )
}
