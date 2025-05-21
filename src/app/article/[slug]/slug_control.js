import fs from "fs/promises";
import path from "path";

export async function generateStaticPath() {
  const articlesDirectory = path.join(process.cwd(), "content", "articles");
  const files = await fs.readdir(articlesDirectory);

  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => ({
      slug: file.replace(/\.mdx$/, ""),
    }));
}
