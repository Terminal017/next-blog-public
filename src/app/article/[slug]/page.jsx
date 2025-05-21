import { notFound } from "next/navigation";
import { article_map } from "../data";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import { read_mdx_file, get_mdx_options, mdx_components } from "./mdx-process";
import { generateStaticPath } from "./slug_control";
import ArticleTOC from "@/ui/toc.jsx";
import PrismLoader from "./prism_loader.jsx";

// gene用于生成动态路由的所有可用路由，返回值应该当是一个对象数组：{ id: string }[]。在构建时会自动调用
export async function generateStaticParams() {
  return await generateStaticPath();
}

//导出的dynamicParams定义方法不在路由表中的行为，为false时表示访问不存在的会自动进入404页面
export const dynamicParams = false;

//这只meta
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
  let content = "";

  try {
    content = await read_mdx_file(slug);
  } catch (e) {
    console.error("Error! List Wrong!");
    notFound();
  }

  const headings = [];
  const mdx_options = get_mdx_options(headings);

  return (
    <>
      <article className="article-container">
        <MDXRemote
          source={content}
          options={mdx_options}
          components={mdx_components}
        />
        <PrismLoader />
      </article>
      <ArticleTOC headings={headings} />
    </>
  );
}
