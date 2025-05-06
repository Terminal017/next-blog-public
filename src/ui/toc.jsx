"use client";

import { useEffect, useState } from "react";

export default function ArticleTOC({ headings }) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    // 创建一个 Intersection Observer 实例（会一直观测直到组件卸载），检测标题位置
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // 如果元素正在进入视口
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      // Observer 的配置选项
      {
        rootMargin: "-100px 0px -70% 0px", // 设置观察区域
        threshold: 0.1, // 定义了元素多少比例，当10%的元素可见时触发
      }
    );

    const headingElements = document.querySelectorAll("h3");
    console.log("检测到标题元素：", headingElements);

    //观察所有元素
    headingElements.forEach((element) => {
      observer.observe(element);
    });

    // 清理函数，组件卸载时停止观察
    return () => {
      headingElements.forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, []); // 仅在组件挂载时运行一次

  //设置跳转目录方法
  const handleTocItemClick = (e, id) => {
    const headingElement = document.getElementById(id);

    if (headingElement) {
      headingElement.scrollIntoView({
        behavior: "smooth",
        block: "start", // 滚动到元素顶部对齐视口顶部
      });

      setActiveId(id);
    }
  };

  return (
    <div className="article-toc-container">
      <div className="article-toc">
        <h6>目录</h6>
        <ul>
          {headings.map((heading) => {
            return (
              <li key={heading.id}>
                <span
                  className={`toc-item ${
                    activeId === heading.id ? "toc-item-active" : ""
                  }`}
                  onClick={(e) => handleTocItemClick(e, heading.id)}
                >
                  {heading.text}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
