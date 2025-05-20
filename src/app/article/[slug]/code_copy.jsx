"use client";
import { useState } from "react";

export default function CodeBlock({ pre, language }) {
  const language_list = {
    sh: "Shell",
    html: "HTML",
    css: "CSS",
    js: "JS",
    jsx: "JSX",
    python: "Python",
  };
  const code_language = language_list[language];

  const [copied, setCopied] = useState(false);

  //递归遍历获取文本
  const handleCodeCopy = () => {
    const get_code_text = (node) => {
      if (typeof node === "string") {
        return node;
      }
      if (!node) return "";
      if (Array.isArray(node)) {
        return node.map(get_code_text).join("");
      }

      //处理React元素
      if (node.props && node.props.children) {
        return get_code_text(node.props.children);
      }

      return String(node);
    };

    const CodeElement = pre.props.children;
    const codeText = get_code_text(CodeElement);

    console.log(codeText);

    navigator.clipboard
      .writeText(codeText)
      .then(() => {
        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 2000);
      })
      .catch((err) => {
        console.error("无法复制代码：", err);
      });
  };

  return (
    <div className="relative">
      <button
        className="absolute top-0 right-0 px-2 py-1 m-1.5 text-sm font-[Roboto] rounded text-on-surface hover:bg-[rgb(198,206,211)] dark:hover:bg-[rgb(53,58,62)]"
        onClick={handleCodeCopy}
      >
        {copied ? "已复制" : code_language}
      </button>
      {pre}
    </div>
  );
}
