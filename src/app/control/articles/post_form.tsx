'use client'

import { useState, useEffect } from 'react'

import type { ArticleFormType } from '@/types/index'

export default function PostForm({
  formState,
  setFormState,
  onSuccess,
}: {
  formState: { state: boolean; slug: string | null }
  setFormState: React.Dispatch<
    React.SetStateAction<{ state: boolean; slug: string | null }>
  >
  onSuccess: () => void
}) {
  const [tagInput, setTagInput] = useState('')
  const [formData, setFormData] = useState<ArticleFormType>({
    slug: '',
    title: '',
    img: '',
    desc: '',
    tags: [],
    content: '',
  })

  //副作用：修改文章状态下获取文章数据以填充表单
  useEffect(() => {
    //修改文章数据获取并填充表单
    if (formState.slug) {
      fetch(`/api/control/article?slug=${formState.slug}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData(data)
        })
        .catch((error) => {
          console.error('获取文章数据错误', error)
        })
    }
  }, [formState.slug])

  // 处理 Enter 添加标签
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const val = tagInput.trim()
      if (!val) {
        return
      }
      if (!formData.tags.includes(val)) {
        setFormData((prev) => ({ ...prev, tags: [...prev.tags, val] }))
      }
      setTagInput('')
    }
  }

  // 删除标签
  const removeTag = (tag: string) => {
    const new_tags = formData.tags.filter((t) => t !== tag)
    setFormData((prev) => ({ ...prev, tags: new_tags }))
  }

  //受控表单提交函数
  async function postArticle(e: React.FormEvent) {
    e.preventDefault()
    const new_date = new Date().toISOString().split('T')[0]
    //完善表单数据
    const submitData = {
      ...formData,
      tags: formData.tags,
      createAt: new_date,
      updateAt: new_date,
    }

    const res = await fetch('/api/control/article', {
      method: formState.slug ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submitData),
    })

    if (res.ok) {
      //关闭表单并刷新数据
      setFormState({ state: false, slug: null })
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
        <div className="bg-surface-highest flex-shrink-0 rounded-t-md px-8 py-5">
          <h2 className="text-xl font-semibold">文章信息</h2>
        </div>
        {/* 表单部分,超出内容允许滚动 */}
        <form className="flex-1 overflow-y-auto" onSubmit={postArticle}>
          <div className="flex flex-col space-y-5 px-8 py-4">
            <div className="space-y-2">
              <label className="block font-medium">文章名称</label>
              {/*input在focus状态会缩小1px的padding以扩大1px的border*/}
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                name="title"
                className="border-outline/50 focus:border-primary/90 m-[1px] w-full
                 rounded-lg border-[1px] px-3 py-2 transition-colors duration-200
                 focus:border-2 focus:px-[11px] focus:py-[7px] focus:outline-none"
                placeholder="Title"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block font-medium">路由slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                name="slug"
                className="border-outline/50 focus:border-primary/90 m-[1px] w-full
                 rounded-lg border-[1px] px-3 py-2 transition-colors duration-200
                 focus:border-2 focus:px-[11px] focus:py-[7px] focus:outline-none"
                placeholder="Router"
                readOnly={!!formState.slug}
                required
              />
              {/* 修改状态下slug不可更改，这是为了维护用户体验和保护评论关联 */}
            </div>
            <div className="space-y-2">
              <label className="block font-medium">文章描述</label>
              <input
                type="text"
                value={formData.desc}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, desc: e.target.value }))
                }
                name="desc"
                className="border-outline/50 focus:border-primary/90 m-[1px] w-full
                 rounded-lg border-[1px] px-3 py-2 transition-colors duration-200
                 focus:border-2 focus:px-[11px] focus:py-[7px] focus:outline-none"
                placeholder="Description"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block font-medium">图片</label>
              <input
                type="url"
                value={formData.img}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, img: e.target.value }))
                }
                name="img"
                className="border-outline/50 focus:border-primary/90 m-[1px] w-full
                 rounded-lg border-[1px] px-3 py-2 transition-colors duration-200
                 focus:border-2 focus:px-[11px] focus:py-[7px] focus:outline-none"
                placeholder="https://img.startrails.site/img/A.webp"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block font-medium">标签</label>

              {/* 标签展示与输入 */}
              <div className="flex cursor-default flex-wrap gap-2">
                {formData.tags.map((tag) => (
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
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
                rows={10}
                className="border-outline/50 focus:border-primary/90 m-[1px]
                 w-full resize-none rounded-lg border-[1px] px-3 py-2
                 transition-colors duration-200 focus:border-2 focus:px-[11px]
                 focus:py-[7px] focus:outline-none"
                placeholder="MDX"
                required
              />
            </div>
            <div className="my-4 flex w-full justify-around">
              <button
                type="button"
                className="bg-surface-high rounded-sm px-8 py-2 text-xl
              transition-colors duration-200 hover:bg-red-400"
                onClick={(e) => {
                  e.preventDefault()
                  setFormState({ state: false, slug: null })
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
