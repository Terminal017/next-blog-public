import fs from "fs/promises";
import path from "path";
import { notFound } from "next/navigation";
import ArticleTOC from "@/ui/toc.jsx";
import { article_map } from "../data";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkSlug from "remark-slug";
import { visit } from "unist-util-visit";

// gene用于生成动态路由的所有可用路由，返回值应该当是一个对象数组：{ id: string }[]。在构建时会自动调用
export async function generateStaticParams() {
  const articlesDirectory = path.join(process.cwd(), "content", "articles");
  const files = await fs.readdir(articlesDirectory);

  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => ({
      slug: file.replace(/\.mdx$/, ""),
    }));
}

//导出的dynamicParams定义方法不在路由表中的行为，为false时表示访问不存在的会自动进入404页面
export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = article_map[slug];
  return {
    title: article.title,
    description: article.desc,
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const filePath = path.join(
    process.cwd(),
    "content",
    "articles",
    `${slug}.mdx`
  );
  let content = "";

  try {
    content = await fs.readFile(filePath, "utf8");
  } catch (e) {
    console.error("Error! List Wrong!");
    notFound();
  }

  const headings = [];
  function remarkExtractHeadings(headings) {
    return () => (tree) => {
      visit(tree, "heading", (node) => {
        if (node.depth === 3) {
          const textNode = node.children.find((child) => child.type === "text");
          if (textNode) {
            const text = textNode.value;
            const id = node.data?.id;
            if (id) {
              headings.push({ text, id });
            }
          }
        }
      });
    };
  }

  const options = {
    mdxOptions: {
      remarkPlugins: [
        remarkFrontmatter,
        remarkGfm,
        remarkSlug,
        remarkExtractHeadings(headings),
      ],
    },
    parseFrontmatter: true, // 是否解析 frontmatter，默认为 false
  };

  const components = {};

  return (
    <>
      <article className="article-container">
        <MDXRemote source={content} options={options} components={components} />
      </article>
      <ArticleTOC headings={headings} />
    </>
  );
}
