import "@/styles/blist.css";
import BubbleHeader from "@/ui/bubble_header";
import Link from "next/link";

export default function BlogList() {
  let article_data = {
    slug: "next-darkmode",
    title: "Next.js 中 Tailwind v4 的深浅模式切换",
    date: "2025-05-07",
    desc: "演示如何在Next.js v15中使用Tailwind v4新版本实现深浅色模式切换。",
    tags: ["Next.js", "Tailwind", "dark-mode"],
  };

  return (
    <main className="blog-list-page">
      <BubbleHeader content="Article" maxwidth={45} />
      <div className="blog-list">
        <ul className="blog-list-ul">
          <ArticleLi article_data={article_data} />
        </ul>
      </div>
    </main>
  );
}

function ArticleLi({ article_data }) {
  return (
    <li>
      <div className="blog-list-box bg-surface-low hover:bg-surface-container">
        <Link href={`/article/${article_data.slug}`} className="blog-list-link">
          <div className="blog-list-img">
            <img src="./images/A1.png" />
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
                );
              })}
            </div>
          </div>
        </Link>
      </div>
    </li>
  );
}
