import fs from "fs/promises";
import path from "path";

export async function generateStaticPath() {
  //生成文章资源静态路径
  const articlesDirectory = path.join(process.cwd(), "content", "articles");
  //读取所有文件名，返回数组
  const files = await fs.readdir(articlesDirectory);

  //返回所有路径
  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => ({
      slug: file.replace(/\.mdx$/, ""),
    }));
}
