import fs from "fs/promises";
import path from "path";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkSlug from "remark-slug";
import rehypePrismPlus from "rehype-prism-plus";
import { visit } from "unist-util-visit";
import CodeBlock from "./code_copy.jsx";

/**
 * 读取MDX文件内容
 * @param {string} slug - 文章的slug
 * @returns {Promise<string>} 文件内容
 */
export async function read_mdx_file(slug) {
  const filePath = path.join(
      process.cwd(),
      "content",
      "articles",
      `${slug}.mdx`
    );
  
  return fs.readFile(filePath, "utf8");
}

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

export function get_mdx_options(headings) {
  return {
    mdxOptions: {
      remarkPlugins: [
        remarkFrontmatter,
        remarkGfm,
        remarkSlug,
        remarkExtractHeadings(headings),
      ],
      rehypePlugins: [
        [
          rehypePrismPlus,
          {
            showLineNumbers: false,       // 不显示行号
            ignoreMissing: true,          // 忽略缺失的语言定义
            defaultLanguage: "plaintext", // 默认语言
          },
        ],
      ],
    },
    parseFrontmatter: true, // 是否解析 frontmatter，默认为 false
  };
}

export const mdx_components = {
  pre: (props) => {
    const codeClass = props.className;

    // 检查是否有 className 并且是否包含语言标识
    if (codeClass.startsWith("language-")) {
      const language = codeClass.replace(/language-/, "");

      const preElement = <pre {...props} />;
      return <CodeBlock pre={preElement} language={language} />;
    }

    // 如果不是代码块，返回原始的pre
    return <pre {...props} />;
  },
};
