"use client"
import "@/styles/blist.css"
import BubbleHeader from "@/ui/bubble_header"
import Link from "next/link"
import { motion } from "motion/react"
import Image from "next/image"

export default function BlogList({ article_data }) {
  return (
    <motion.main
      className="blog-list-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <BubbleHeader content="Article" width={45} />
      <div className="blog-list">
        <ul className="blog-list-ul">
          {article_data.map((data) => {
            return <ArticleLi key={data.slug} article_data={data} />
          })}
        </ul>
      </div>
    </motion.main>
  )
}

function ArticleLi({ article_data }) {
  return (
    <li>
      <div className="blog-list-box bg-surface-low hover:bg-surface-container">
        <Link href={`/article/${article_data.slug}`} className="blog-list-link">
          <div className="blog-list-img">
            <Image
              src={`/images/${article_data.img}`}
              alt={article_data.title || "文章图片"}
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
        </Link>
      </div>
    </li>
  )
}
