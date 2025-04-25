import "@/styles/blist.css";
import BubbleHeader from "@/ui/bubble_header";
import { inter } from "./font";

export default function BlogList() {
  let article_data = {
    title: "Article Title",
    date: "2025.3.25",
    desc: "Article Description Article Description Article Description Article Description Article Description",
    tags: ["#Tag1", "#Tag2", "#Tag3"],
  };

  return (
    <main className="blog-list-page">
      <BubbleHeader content="Article" maxwidth={45} />
      <div className="blog-list">
        <ul className="blog-list-ul">
          <ArticleLi article_data={article_data} />
          <ArticleLi article_data={article_data} />
          <ArticleLi article_data={article_data} />
          <ArticleLi article_data={article_data} />
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
        <a href="#" className="blog-list-link">
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
                    {tag}
                  </div>
                );
              })}
            </div>
          </div>
        </a>
      </div>
    </li>
  );
}
