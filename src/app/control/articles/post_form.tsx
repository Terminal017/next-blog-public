'use client'

import { useState } from 'react'

export default function PostForm({
  setFormState,
  onSuccess,
}: {
  setFormState: (open: string) => void
  onSuccess: () => void
}) {
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  // 处理 Enter 添加标签
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const val = tagInput.trim()
      if (!val) return
      if (!tags.includes(val)) setTags([...tags, val])
      setTagInput('')
    }
  }

  // 删除标签
  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  //提交表单函数
  async function postArticle(formdata: FormData) {
    const new_date = new Date().toISOString()
    //完善表单数据
    formdata.set('tags', JSON.stringify(tags))
    formdata.append('createAt', new_date.split('T')[0])
    formdata.append('updateAt', new_date.split('T')[0])

    const res = await fetch('/api/article', {
      method: 'POST',
      body: formdata,
    })
    if (res.ok) {
      //关闭表单并刷新数据
      setFormState('close')
      onSuccess()
    } else {
      console.error('文章提交失败')
    }
  }

  return (
    <div
      className="bg-background/80 fixed inset-0 z-10 flex h-full w-full 
    justify-center"
    >
      <div
        className="bg-surface border-outline my-20 flex
        w-[40rem] max-w-9/10 flex-col rounded-md shadow-md"
      >
        <div className="bg-surface-high flex-shrink-0 rounded-t-md px-8 py-5">
          <h2 className="text-xl font-semibold">文章信息</h2>
        </div>
        {/* 表单部分,超出内容允许滚动 */}
        <form className="flex-1 overflow-y-auto" action={postArticle}>
          <div className="flex flex-col space-y-5 px-8 py-4">
            <div className="space-y-2">
              <label className="block font-medium">文章名称</label>
              {/*input在focus状态会缩小1px的padding以扩大1px的border*/}
              <input
                type="text"
                name="title"
                className="border-outline/50 focus:border-primary/90 m-[1px] w-full
                 rounded-lg border-[1px] px-3 py-2 transition-colors duration-200
                 focus:border-2 focus:px-[11px] focus:py-[7px] focus:outline-none"
                placeholder="Title"
              ></input>
            </div>
            <div className="space-y-2">
              <label className="block font-medium">路由slug</label>
              <input
                type="text"
                name="slug"
                className="border-outline/50 focus:border-primary/90 m-[1px] w-full
                 rounded-lg border-[1px] px-3 py-2 transition-colors duration-200
                 focus:border-2 focus:px-[11px] focus:py-[7px] focus:outline-none"
                placeholder="Router"
              ></input>
            </div>
            <div className="space-y-2">
              <label className="block font-medium">文章描述</label>
              <input
                type="text"
                name="desc"
                className="border-outline/50 focus:border-primary/90 m-[1px] w-full
                 rounded-lg border-[1px] px-3 py-2 transition-colors duration-200
                 focus:border-2 focus:px-[11px] focus:py-[7px] focus:outline-none"
                placeholder="Description"
              ></input>
            </div>
            <div className="space-y-2">
              <label className="block font-medium">图片</label>
              <input
                type="url"
                name="img"
                className="border-outline/50 focus:border-primary/90 m-[1px] w-full
                 rounded-lg border-[1px] px-3 py-2 transition-colors duration-200
                 focus:border-2 focus:px-[11px] focus:py-[7px] focus:outline-none"
                placeholder="https://img.startrails.site/img/A.webp"
              ></input>
            </div>
            <div className="space-y-2">
              <label className="block font-medium">标签</label>

              {/* 标签展示与输入 */}
              <div className="flex cursor-default flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-surface-high border-outline-v flex items-center rounded
                    border px-3 py-1 text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 h-4 w-4"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        fill="currentColor"
                      >
                        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                name="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                className="border-outline/50 focus:border-primary/90 m-[1px] w-full
                 rounded-lg border-[1px] px-3 py-2 transition-colors duration-200
                 focus:border-2 focus:px-[11px] focus:py-[7px] focus:outline-none"
                placeholder="Tags（按下Enter键保存）"
              />
            </div>
            <div className="space-y-2">
              <label className="block font-medium">文章内容</label>
              <textarea
                name="content"
                className="border-outline/50 focus:border-primary/90 m-[1px] min-h-36
                 w-full resize-none rounded-lg border-[1px] px-3 py-2
                 transition-colors duration-200 focus:border-2 focus:px-[11px]
                 focus:py-[7px] focus:outline-none"
                placeholder="MDX"
              ></textarea>
            </div>
            <div className="my-4 flex w-full justify-around">
              <button
                type="button"
                className="bg-surface-high rounded-sm px-8 py-2 text-xl
              transition-colors duration-200 hover:bg-red-400"
                onClick={(e) => {
                  e.preventDefault()
                  setFormState('close')
                }}
              >
                取消
              </button>
              <button
                type="submit"
                className="bg-surface-high rounded-sm px-8 py-2 text-xl
              transition-colors duration-200 hover:bg-green-400"
              >
                确认
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
