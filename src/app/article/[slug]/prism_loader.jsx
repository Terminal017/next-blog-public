"use client";

import { useEffect } from "react";
import "prismjs";
// 导入你喜欢的主题
import "prismjs/components/prism-shell-session";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-css";
import "prismjs/components/prism-markdown";

export default function PrismLoader() {
  useEffect(() => {
    // 在组件挂载后加载 Prism
    if (typeof window !== "undefined") {
      window.Prism.highlightAll();
    }
  }, []);

  return null;
}
