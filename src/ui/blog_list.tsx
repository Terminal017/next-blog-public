'use client'
import '@/styles/blist.css'
import BubbleHeader from '@/ui/bubble_header'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface ArticleListType {
  slug: string
  title: string
  img: string
  date: string
  desc: string
  tags: string[]
}

export default function BlogList({
  page_number,
  article_sum,
  article_list,
}: {
  page_number: number
  article_sum: number
  article_list: ArticleListType[]
}) {
  //控制网页跳转，useRouter可以指定跳转的网页
  const router = useRouter()

  return (
    <main className="blog-list-page">
      <BubbleHeader content="Article" width={45} />
      <div className="blog-list">
        <ul className="blog-list-ul">
          {article_list.map((data) => {
            return <ArticleLi key={data.slug} article_data={data} />
          })}
        </ul>
      </div>
      <div className="blog-page-button">
        <button
          className={`bg-surface-low ${
            page_number === 1 ? '' : 'hover:bg-third-container'
          }`}
          onClick={() => {
            if (page_number > 1) {
              router.push(`/article/page/${page_number - 1}`)
            }
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="90%"
            viewBox="0 -960 960 960"
            width="90%"
            fill="currentColor"
          >
            <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
          </svg>
        </button>
        {Array.from({ length: Math.ceil(article_sum / 5) }).map((_, index) => {
          return (
            <button
              key={index}
              className={`bg-surface-low hover:bg-third-container ${
                page_number === index + 1 ? 'bg-third-container' : ''
              }`}
              onClick={() => {
                router.push(`/article/page/${index + 1}`)
              }}
            >
              <p className="pointer-events-none">{index + 1}</p>
            </button>
          )
        })}
        <button
          className={`bg-surface-low ${
            page_number === Math.ceil(article_sum / 5)
              ? ''
              : 'hover:bg-third-container'
          }`}
          onClick={() => {
            if (page_number < Math.ceil(article_sum / 5)) {
              router.push(`/article/page/${page_number + 1}`)
            }
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="90%"
            viewBox="0 -960 960 960"
            width="90%"
            fill="currentColor"
          >
            <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
          </svg>
        </button>
      </div>
    </main>
  )
}

function ArticleLi({ article_data }: { article_data: ArticleListType }) {
  return (
    <li>
      <Link
        href={`/article/${article_data.slug}`}
        className="blog-list-box bg-surface-low hover:bg-surface-container"
      >
        <div className="blog-list-innerbox">
          <div className="blog-list-img">
            <Image
              src={`${article_data.img}`}
              alt={article_data.title || '文章图片'}
              width={228}
              height={132}
            />
          </div>
          <div className="blog-list-content">
            <h3 className="text-on-surface">{article_data.title}</h3>
            <div className="blog-list-time">
              <span className="text-on-surface-v/80">{article_data.date}</span>
            </div>
            <p className="text-on-surface-v">{article_data.desc}</p>
            <div className="blog-list-tag">
              {article_data.tags.map((tag) => {
                return (
                  <div
                    key={tag}
                    className="text-on-surface-v bg-surface-v hover:bg-surface-tint/10"
                  >
                    {`#${tag}`}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </Link>
    </li>
  )
}
