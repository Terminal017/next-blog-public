import fs from "fs/promises";
import path from "path";
import { marked } from "marked";
import { notFound } from "next/navigation";

// 预生成所有可能的路径参数
export async function generateStaticParams() {
  const articlesDirectory = path.join(process.cwd(), "content", "articles");
  const files = await fs.readdir(articlesDirectory);

  return files
    .filter((file) => file.endsWith(".md"))
    .map((file) => ({
      slug: file.replace(/\.md$/, ""),
    }));
}

//不存在列表的路由会进入404
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

  const html = marked.parse(content);

  return <article dangerouslySetInnerHTML={{ __html: html }} />;
}
