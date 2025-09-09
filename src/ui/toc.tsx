"use client"

import { useEffect, useState, useRef } from "react"

interface HeadingType {
  text: string
  id: string
}

export default function ArticleTOC({ headings }: {headings: HeadingType[]}) {
  const [activeId, setActiveId] = useState("")
  const clickedRef = useRef(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // 创建一个 Intersection Observer 实例（会一直观测直到组件卸载），检测标题位置
    //Intersection Observer 会针对每一个脱离或进入阈值区域的目标元素都触发一次回调。
    const observer = new IntersectionObserver(
      (entries) => {
        if (clickedRef.current) {
          return // 如果是点击滚动，则跳过观察
        }
        entries.forEach((entry) => {
          // 如果元素正在进入视口
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      // Observer 的配置选项
      {
        rootMargin: "-20px 0px -75% 0px", // 设置观察区域
        threshold: 0.1, // 定义了元素多少比例，当10%的元素可见时触发
      }
    )

    const headingElements = document.querySelectorAll(
      "article.article-container h3"
    )

    //观察所有元素
    headingElements.forEach((element) => {
      observer.observe(element)
    })

    // 清理函数，组件卸载时停止观察
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      headingElements.forEach((element) => {
        observer.unobserve(element)
      })
    }
  }, []) // 仅在组件挂载时运行一次

  //设置跳转目录方法
  const handleTocItemClick = (
    e: React.MouseEvent<HTMLSpanElement>,
    id: string,
  ) => {
    const headingElement = document.getElementById(id)

    clickedRef.current = true

    setActiveId(id) //立即高亮再跳转

    if (headingElement) {
      headingElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start', // 滚动到元素顶部对齐视口顶部
      })
    }

    // 清理原本的定时器，避免高频点击时计时器冲突
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      clickedRef.current = false
    }, 1000)
  }

  return (
    <div className="article-toc-container">
      <div className="article-toc">
        <h6>目录</h6>
        <ul>
          {headings.map((heading, index) => {
            return (
              <li key={heading.id}>
                <span
                  className={`toc-item ${
                    activeId === heading.id ? "toc-item-active" : ""
                  }`}
                  onClick={(e) => handleTocItemClick(e, heading.id)}
                >
                  {`${index + 1}. ${heading.text}`}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
