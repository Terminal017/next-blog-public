'use client'
import { useState, JSX } from 'react'

export default function CodeBlock({
  pre,
  language,
}: {
  pre: JSX.Element
  language: string
}) {
  const language_list: Record<string, string> = {
    sh: 'Shell',
    html: 'HTML',
    css: 'CSS',
    js: 'JS',
    jsx: 'JSX',
    ts: 'TS',
    tsx: 'TSX',
    json: 'JSON',
    python: 'Python',
  }
  const code_language = language_list[language] || ''

  const [copied, setCopied] = useState(false)

  //递归遍历获取文本
  const handleCodeCopy = () => {
    const get_code_text = (node: any): string => {
      if (typeof node === 'string') {
        return node
      }
      if (!node) {
        return ''
      }
      if (Array.isArray(node)) {
        return node.map(get_code_text).join('')
      }

      //处理React元素
      if (node.props && node.props.children) {
        return get_code_text(node.props.children)
      }

      return String(node)
    }

    const CodeElement = pre.props.children
    const codeText = get_code_text(CodeElement)

    navigator.clipboard
      .writeText(codeText)
      .then(() => {
        setCopied(true)

        setTimeout(() => {
          setCopied(false)
        }, 2000)
      })
      .catch(() => {
        alert('发生错误，无法复制代码')
      })
  }

  return (
    <div className="relative">
      <button
        className="text-on-surface absolute top-0 right-0 m-1.5 rounded px-2 py-1 font-[Roboto] text-sm font-normal hover:bg-[rgb(198,206,211)] dark:hover:bg-[rgb(53,58,62)]"
        onClick={handleCodeCopy}
      >
        {copied ? '已复制' : code_language}
      </button>
      {pre}
    </div>
  )
}
