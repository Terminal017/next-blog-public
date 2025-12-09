'use client'

import { useState, useRef, useEffect } from 'react'
import { CoreIcon } from '@/components/icons'
import { motion } from 'motion/react'

type MessageType = {
  id: string
  role: 'user' | 'assistant'
  content: string[]
}

//AI问答按钮组件
export function ButtonAIChat({ slug }: { slug: string }) {
  const [openChat, setOpenChat] = useState(false)

  return (
    <>
      <button
        className="hover:bg-second-container ml-auto rounded-sm px-2
          py-1 text-base font-medium transition-colors duration-200
          ease-in-out"
        onClick={() => setOpenChat(true)}
      >
        Ask AI
      </button>
      {openChat && (
        <ArticleAIChat slug={slug} onClose={() => setOpenChat(false)} />
      )}
    </>
  )
}

//AI问答组件
export function ArticleAIChat({
  slug,
  onClose,
}: {
  slug: string
  onClose: () => void
}) {
  const [question, setQuestion] = useState('')
  const [isStreaming, setIsStreaming] = useState(false) //判断回答传输是否终止
  const [messageList, setMessageList] = useState<MessageType[]>([
    {
      id: '1',
      role: 'assistant',
      content: [
        '你好！我是一个经过文章训练的AI助手，欢迎询问我任何有关文章内容的问题',
      ],
    },
  ])

  //保存终止流式输出方式
  const abortControllerRef = useRef<AbortController | null>(null)

  //发送问题
  async function sendQuestion(message: string) {
    //如果有正在进行的流式回答，阻止新的提问
    if (isStreaming) {
      return
    }

    const userId = crypto.randomUUID()
    const assistantId = crypto.randomUUID()

    //添加用户问题到消息列表
    setMessageList((prev) => [
      ...prev,
      { id: userId, role: 'user', content: [message] },
    ])
    setQuestion('')

    //插入占位符
    setMessageList((prev) => [
      ...prev,
      { id: assistantId, role: 'assistant', content: [''] },
    ])

    // 创建 Controller，保存引用
    const controller = new AbortController()
    abortControllerRef.current = controller

    setIsStreaming(true)

    //调用API获取回答
    try {
      const response = await fetch('/api/aistream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: message,
          slug: slug,
        }),
        signal: controller.signal, //标记信号
      })

      if (!response.ok) {
        const res_data = await response.json()
        setMessageList((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? { ...msg, content: [res_data.message || '模型未响应'] }
              : msg,
          ),
        )
        return
      }

      const reader = response.body!.getReader()
      const decoder = new TextDecoder()

      //读取流并增量写入answer
      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          break
        }
        const text = decoder.decode(value)
        setMessageList((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? { ...msg, content: [...msg.content, text] }
              : msg,
          ),
        )
      }
    } catch (err) {
      //用户手动终止
      if (err instanceof DOMException && err.name === 'AbortError') {
        setMessageList((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? { ...msg, content: [...msg.content, '\n已终止'] }
              : msg,
          ),
        )
      } else {
        setMessageList((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? { ...msg, content: [...msg.content, '\n客户端错误'] }
              : msg,
          ),
        )
      }
    } finally {
      //结束重设状态
      setIsStreaming(false)
      abortControllerRef.current = null
    }
  }

  //禁用外层背景滚动
  useEffect(() => {
    const { overflow } = document.body.style
    document.body.style.overflow = 'clip'
    return () => {
      document.body.style.overflow = overflow
    }
  })

  return (
    <div
      className="bg-surface-highest/60 fixed top-0 left-0 z-100 h-full w-full
    backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        className="bg-surface-low absolute top-1/12 left-1/2
      flex h-3/4 max-h-[80vh] w-9/10 max-w-[50rem] -translate-x-1/2 flex-col 
     overflow-hidden rounded-md shadow-sm"
        onMouseDown={(e) => e.stopPropagation()} // 阻止事件冒泡
      >
        <div
          className="text-on-background/80 flex flex-row justify-between 
        px-4 py-3"
        >
          <p>Ask AI</p>
          <p>由Gemini驱动</p>
        </div>
        <div className="grow-1 overflow-scroll px-12 py-8 max-md:px-6">
          {messageList.map((msg, index) => {
            if (msg.role === 'user') {
              return (
                <div key={index} className="mb-6 flex w-full justify-end">
                  <div
                    className="bg-second-container mr-11 max-w-3/4 rounded-md px-4
                  py-2 max-md:mr-0"
                  >
                    <p>{msg.content.join()}</p>
                  </div>
                </div>
              )
            } else if (msg.role === 'assistant') {
              return (
                <div
                  key={index}
                  className="mr-11 mb-6 flex flex-row gap-3 max-md:mr-0
                max-md:gap-2"
                >
                  <div className="h-8 w-8 shrink-0">
                    <CoreIcon />
                  </div>
                  <div className="pt-1">
                    {msg.content?.map((block, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.18 }}
                        className="whitespace-pre-wrap"
                      >
                        {block}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )
            }
          })}
        </div>
        <div className="mx-17 my-4 px-6 py-4 max-md:mx-2">
          <div
            className="bg-surface-container flex flex-row items-center
          rounded-md p-1 shadow-sm"
          >
            <textarea
              className="w-full resize-none overflow-hidden
               px-3 py-2 focus:outline-none"
              rows={1}
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value)
                const t = e.currentTarget as HTMLTextAreaElement
                t.style.height = 'auto'
                t.style.height = `${t.scrollHeight}px`
              }}
              onKeyDown={(e) => {
                // Enter 提交 (不按 Shift)
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  if (question.trim()) {
                    sendQuestion(question)
                    e.currentTarget.style.height = 'auto'
                  }
                }
                // Shift+Enter 浏览器默认换行
              }}
              required
            ></textarea>
            <button
              disabled={!question.trim() && !isStreaming}
              onClick={() => {
                if (isStreaming) {
                  //终止回答
                  abortControllerRef.current?.abort()
                } else {
                  sendQuestion(question)
                }
              }}
              className={`${
                isStreaming
                  ? 'text-on-surface/80'
                  : question
                    ? 'hover:bg-surface-highest text-purple-400 dark:text-blue-400'
                    : 'text-surface-highest'
              } 
              rounded-md p-2.5 disabled:cursor-not-allowed`}
            >
              {isStreaming ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  fill="currentColor"
                  height="1.5em"
                  width="1.5em"
                >
                  <path d="M320-320h320v-320H320v320ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                </svg>
              ) : (
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 512 512"
                  role="presentation"
                  aria-hidden="true"
                  focusable="false"
                  className="-rotate-30"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M476.59 227.05l-.16-.07L49.35 49.84A23.56 23.56 0 0027.14 52 24.65 24.65 0 0016 72.59v113.29a24 24 0 0019.52 23.57l232.93 43.07a4 4 0 010 7.86L35.53 303.45A24 24 0 0016 327v113.31A23.57 23.57 0 0026.59 460a23.94 23.94 0 0013.22 4 24.55 24.55 0 009.52-1.93L476.4 285.94l.19-.09a32 32 0 000-58.8z"></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="fixed top-9/10 left-1/2 hidden -translate-x-1/2 max-md:block">
        <button
          onClick={onClose}
          className="text-on-background/80 bg-surface-highest h-12 w-12
        rounded-full p-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            fill="currentColor"
          >
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
