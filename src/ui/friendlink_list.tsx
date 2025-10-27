'use client'

import BubbleHeader from '@/ui/bubble_header'
import { useState, useEffect, useActionState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { add_new_friend } from '@/lib/server/handle_friendlink'

interface friendlinkType {
  title: string
  site: string
  avatar: string
  description: string
  email: string
  datetime: Date
}

export default function FriendLinkList({
  friendlink_data,
}: {
  friendlink_data: friendlinkType[]
}) {
  return (
    <main className="flex w-full flex-col items-center">
      <BubbleHeader content="Friend Links" width={45}></BubbleHeader>
      <div className="w-[45rem] max-w-4/5 max-md:max-w-9/10">
        <h2
          className="before:bg-inverse-primary relative mt-8 px-4 py-8 text-[1.75rem]
        leading-none font-semibold before:absolute before:top-8 before:left-0
        before:h-[1.75rem] before:w-[6px] before:content-['']"
        >
          My Friends
        </h2>
      </div>
      <div
        className="mt-4 grid w-[45rem] max-w-4/5 grid-cols-2
      gap-8 max-md:max-w-9/10 max-md:grid-cols-1"
      >
        {friendlink_data.map((item, index) => {
          return (
            <a
              href={item.site}
              target="_blank"
              className="bg-surface-low dark:bg-surface-high hover:border-primary 
               group flex flex-row rounded-2xl border-[2.5px] border-solid
               border-transparent px-6 py-5 shadow-md transition-all duration-300
               ease-linear  hover:scale-101"
              key={index}
            >
              <div className="flex flex-row items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center">
                  <img
                    src={item.avatar}
                    alt="网站头像"
                    className="group-hover:border-primary h-full w-full rounded-full
                    border-[2.5px] border-solid border-transparent object-cover
                    transition-all duration-300 ease-linear"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <h3
                    className="text-on-surface group-hover:text-primary 
                  text-lg font-medium"
                  >
                    {item.title}
                  </h3>
                  <p className="text-on-surface-v text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            </a>
          )
        })}
      </div>
      <div className="w-[45rem] max-w-4/5 max-md:max-w-9/10">
        <h2
          className="before:bg-inverse-primary relative mt-20 px-4 py-8 text-[1.75rem]
        leading-none font-semibold before:absolute before:top-8 before:left-0
        before:h-[1.75rem] before:w-[6px] before:content-['']"
        >
          申请友链
        </h2>
      </div>
      <FriendLinkForm />
    </main>
  )
}

//表单组件
export function FriendLinkForm() {
  const [toggles, setToggles] = useState(0)
  //获取表单信息状态
  const [form_state, form_action, ispeding] = useActionState(add_new_friend, {
    ok: false,
    message: '',
  })

  //获取提示组件状态，控制提示组件生成
  const [prompt, setPrompt] = useState({
    ok: false,
    message: '',
  })

  //异步返回结果后同步状态
  useEffect(() => {
    if (form_state.message) {
      setPrompt(form_state)
      setTimeout(() => {
        setPrompt({ ok: false, message: form_state.message })
      }, 4000)
    }
  }, [form_state])

  const friendlink_form = [
    {
      text: '站点名称',
      f_name: 'name',
      placeholder: 'your_site_name',
      type: 'text',
    },
    {
      text: '站点地址',
      f_name: 'site',
      placeholder: 'https://example.com',
      type: 'url',
    },
    {
      text: '站点头像',
      f_name: 'avatar',
      placeholder: 'https://img.example.com/img',
      type: 'text',
    },
    {
      text: '站点描述',
      f_name: 'description',
      placeholder: 'your_site_description',
      type: 'text',
    },
    {
      text: '邮箱地址',
      f_name: 'email',
      placeholder: 'example@gmail',
      type: 'eamil',
    },
  ]

  return (
    <>
      <motion.div
        className={`bg-third-container fixed top-14 left-1/2 z-200
        flex -translate-x-1/2 flex-col items-center
        gap-4 rounded-md px-12 py-4 shadow-xl`}
        initial={{ opacity: 0, y: -64 }}
        animate={{ opacity: prompt.ok ? 1 : 0, y: prompt.ok ? 0 : -64 }}
        transition={{ duration: 0.3, ease: prompt.ok ? 'easeOut' : 'easeIn' }}
        onClick={() => setPrompt({ ok: false, message: form_state.message })}
      >
        <p className="cursor-default text-xl whitespace-nowrap">
          {prompt.message}
        </p>
      </motion.div>
      <div
        className="text-on-surface flex h-[30rem] w-[45rem] max-w-4/5 
      flex-col gap-2 max-md:max-w-9/10"
      >
        <div
          className=" border-outline/80 bg-surface-low flex 
        flex-col rounded-md border-[2px] border-solid text-base"
        >
          <button
            className={`flex flex-row items-center justify-between 
            border-b-2 border-solid p-3 transition-all
            ${toggles === 1 ? 'border-outline/80' : 'border-transparent'}`}
            onClick={() => setToggles((prev) => (prev === 1 ? 0 : 1))}
          >
            <span className="font-medium">星轨基地信息</span>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="currentColor"
                className={`${toggles === 1 ? '-rotate-90' : 'rotate-0'} 
              duration-300 ease-in-out`}
              >
                <path d="M559-246 325-480l234-234 52 53-181 181 181 181-52 53Z" />
              </svg>
            </div>
          </button>
          <AnimatePresence>
            {toggles === 1 && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="bg-background overflow-hidden rounded-md"
              >
                <div className="relative px-3 py-4 leading-[1.7]">
                  <p>名称： StarTrail</p>
                  <p>网址： https://startrails.site</p>
                  <p>头像： https://startrails.site/favicon.svg</p>
                  <p>描述： 星轨的基地</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div
          className="border-outline/80 bg-surface-low flex flex-col 
        rounded-md border-[2px] border-solid text-base"
        >
          <button
            className={`flex flex-row items-center justify-between 
            border-b-2 border-solid p-3 transition-all
            ${toggles === 2 ? 'border-outline/80' : 'border-transparent'}`}
            onClick={() => setToggles((prev) => (prev === 2 ? 0 : 2))}
          >
            <span className="font-medium">申请友链</span>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="currentColor"
                className={`${toggles === 2 ? '-rotate-90' : 'rotate-0'} 
              duration-300 ease-in-out`}
              >
                <path d="M559-246 325-480l234-234 52 53-181 181 181 181-52 53Z" />
              </svg>
            </div>
          </button>
          <AnimatePresence>
            {toggles === 2 && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="bg-background overflow-hidden rounded-md"
              >
                <form
                  action={form_action}
                  className="flex flex-col gap-4 px-3 py-4"
                  //e是键盘事件对象，currentTarget表示绑定事件的元素，target表示触发事件的元素
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      const form = e.currentTarget
                      const inputs = Array.from(form.querySelectorAll('input'))
                      const index = inputs.indexOf(e.target as HTMLInputElement)
                      //按下enter键后进入下一个输入框
                      if (index < inputs.length - 1) {
                        inputs[index + 1].focus()
                      }
                    }
                  }}
                >
                  {friendlink_form.map((items, index) => {
                    return (
                      <div className="flex w-full items-center" key={index}>
                        <label>{`${items.text}：`} </label>
                        <input
                          type={items.type}
                          name={items.f_name}
                          placeholder={items.placeholder}
                          required
                          className="border-outline/80 ml-1 flex-1 rounded 
                        border px-2 py-0.5"
                        />
                      </div>
                    )
                  })}
                  <div className="mt-4 flex flex-row justify-around text-lg">
                    <button
                      className="bg-primary-container text-on-primary-container
                    w-28 rounded-sm px-2 py-1 transition-all duration-200
                    hover:bg-[rgb(160_220_245)]
                    dark:brightness-115 dark:hover:bg-[rgb(15_100_130)]"
                      type="reset"
                      disabled={ispeding}
                    >
                      清空
                    </button>
                    <button
                      className="bg-primary-container text-on-primary-container
                    w-28 rounded-sm px-2 py-1 transition-all duration-200
                    hover:bg-[rgb(160_220_245)]
                    dark:brightness-115 dark:hover:bg-[rgb(15_100_130)]"
                      type="submit"
                      disabled={ispeding}
                    >
                      {ispeding ? '正在提交...' : '提交信息'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}
