import fs from "fs/promises";
import path from "path";
import { marked, Renderer } from "marked";
import { notFound } from "next/navigation";
import "@/styles/article_details.css";
import ArticleTOC from "@/ui/toc.jsx";

// gene用于生成动态路由的所有可用路由，返回值应该当是一个对象数组：{ id: string }[]。在构建时会自动调用
export async function generateStaticParams() {
  const articlesDirectory = path.join(process.cwd(), "content", "articles");
  const files = await fs.readdir(articlesDirectory);

  return files
    .filter((file) => file.endsWith(".md"))
    .map((file) => ({
      slug: file.replace(/\.md$/, ""),
    }));
}

//导出的dynamicParams定义方法不在路由表中的行为，为false时表示访问不存在的会自动进入404页面
export const dynamicParams = false;

// params为路由参数：{ slug: "hello-world" }
export default async function Page({ params }) {
  const { slug } = await params;
  const filePath = path.join(
    process.cwd(),
    "content",
    "articles",
    `${slug}.md`
  );
  let content = "";

  try {
    content = await fs.readFile(filePath, "utf8");
  } catch (e) {
    console.error("Error! List Wrong!");
    notFound();
  }

  //Markdown转换为HTML
  const headings = [];

  const renderer = new Renderer();
  renderer.heading = (token) => {
    const { text, depth } = token;
    if (depth === 3) {
      // 生成 id 并记录
      const id = text.toLowerCase().replace(/\s+/g, "-");
      headings.push({ text, id });
      return `<h3 id="${id}">${text}</h3>`;
    }
    //其他暂时保持默认
    return `<h${depth}>${text}</h${depth}>`;
  };

  marked.use({ renderer });
  marked.setOptions({
    gfm: true, //启用GFM规范
    breaks: true, //启用换行符转换为br
    headerIds: false,
  });
  const html = marked.parse(content);

  return (
    <main className="relative">
      <article
        className="article-container"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <ArticleTOC headings={headings} />
    </main>
  );
}
