import styles from "@/styles/blist.module.css";
import "@/styles/globals.css";
import { inter } from "./font";

export default function BlogList() {
  let article_data = {
    title: "Article Title",
    date: "2025.3.25",
    desc: "Article Description Article Description Article Description Article Description Article Description",
    tags: ["#Tag1", "#Tag2", "#Tag3"],
  };

  return (
    <main className={styles["blog-list-page"]}>
      <div className={styles["blog-list"]}>
        <ul className={styles["blog-list-ul"]}>
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
      <div className={styles["blog-list-box"]}>
        <a href="#" className={styles["blog-list-link"]}>
          <div className={styles["blog-list-img"]}>
            <img src="./images/A1.png" />
          </div>
          <div className={styles["blog-list-content"]}>
            <h3 className={inter.className}>{article_data.title}</h3>
            <div className={styles["blog-list-time"]}>
              <span className={inter.className}>{article_data.date}</span>
            </div>
            <p className={inter.className}>{article_data.desc}</p>
            <div className={`${styles["blog-list-tag"]} ${inter.className}`}>
              {article_data.tags.map((tag) => {
                return <div key={tag}>{tag}</div>;
              })}
            </div>
          </div>
        </a>
      </div>
    </li>
  );
}
