'use client'

import type { ArticleInfType } from '@/types/index'
import { useEffect, useState } from 'react'
import { LoadingAni } from '@/components/animation/ani_loading'
import { motion } from 'motion/react'
import Link from 'next/link'

export default function ControlArticles() {
  const [article_list, setArticleList] = useState<ArticleInfType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true)
        const res = await fetch('/api/article?page=1&sort=createAt:1')

        if (res.ok) {
          const data = await res.json()
          setArticleList(data)
        }
      } catch (error) {
        console.error('控制台获取文章数据错误', error)
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
  }, []) //组件挂载时请求一次

  const article_num = article_list.length

  //加载时显示加载动画
  if (loading) {
    return (
      <div
        className="flex h-100 w-full items-center justify-center 
      text-3xl font-semibold "
      >
        <p className="mr-4">文章信息加载中</p>
        <LoadingAni width={36} />
      </div>
    )
  }

  return (
    <main className="container-main">
      <div className="mt-12 grid w-[60rem] max-w-9/10">
        <div className="mt-12 mb-6 flex w-full flex-row items-end justify-between">
          <h1 className="text-3xl font-bold tracking-widest">文章列表</h1>
          <button
            className="border-outline/80 hover:border-primary hover:text-primary 
            rounded-lg border px-3 py-1 text-lg font-medium"
          >
            Add New
          </button>
        </div>
        <div
          className="border-outline overflow-x-auto rounded-lg border-2
        border-solid py-2"
        >
          <table className="w-full ">
            <caption className="px-4 py-1 text-left text-sm font-medium">
              共 {article_num} 篇文章
            </caption>
            <thead className="bg-surface-highest text-left">
              <tr>
                <th className="py-3 pl-8">文章标题</th>
                <th className="px-4 py-3">创建时间</th>
                <th className="px-4 py-3">修改时间</th>
                <th className="px-4 py-3">修改</th>
                <th className="px-4 py-3">删除</th>
              </tr>
            </thead>
            <tbody>
              {article_list.map((article, index) => (
                <tr
                  key={index}
                  className="hover:bg-surface-high cursor-default"
                >
                  <td className="py-4 pl-8 font-medium">{article.title}</td>
                  <td className="px-4 py-4">{article.createAt}</td>
                  <td className="px-4 py-4">{article.updateAt}</td>
                  <td className="px-4 py-4">
                    <motion.button
                      className="flex h-6 w-6 items-end"
                      initial={{ rotate: 0, scale: 1, color: 'inherit' }}
                      whileHover={{
                        rotate: [0, -10, 10, 0],
                        scale: 1.1,
                        color: 'var(--md-sys-color-primary)',
                        transition: { duration: 0.3, ease: 'easeInOut' },
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        fill="currentColor"
                      >
                        <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                      </svg>
                    </motion.button>
                  </td>
                  <td className="px-4 py-4">
                    <motion.button
                      className="flex h-6 w-6 items-end"
                      initial={{ scale: 1, color: 'inherit' }}
                      whileHover={{
                        scale: 1.15,
                        color: 'var(--md-sys-color-primary)',
                        transition: {
                          duration: 0.2,
                          type: 'spring',
                          stiffness: 500,
                          damping: 8,
                          mass: 0.3,
                        },
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        fill="currentColor"
                      >
                        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                      </svg>
                    </motion.button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-12 flex justify-start">
          <Link
            className="border-outline hover:border-primary hover:text-primary 
            flex flex-row items-center rounded-lg border-[1.5px] p-1 pr-2"
            href={'/control'}
          >
            <svg
              className="h-8 w-8"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              fill="currentColor"
            >
              <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
            </svg>
            <span className="text-lg">中控台</span>
          </Link>
        </div>
      </div>
    </main>
  )
}
