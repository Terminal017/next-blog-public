'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { MessageRemind } from '@/ui/mini_component'

interface CommentType {
  _id?: string
  comment: string
  datetime: Date
  user: { name: string; image: string }
}

//评论列表
export function CommentList({ page }: { page: string }) {
  const fetcher = (url: string) => fetch(url).then((res) => res.json())

  //useSWR封装了返回机制与状态管理
  //useSWR比fetch多缓存机制，错误返回和提交状态获取
  const {
    data = [],
    error,
    isLoading,
  } = useSWR<CommentType[]>(`/api/comment?slug=${page}`, fetcher)

  return (
    <div
      className="mx-auto flex w-9/10 max-w-[53rem] flex-col 
    max-md:mx-[0.75rem]"
    >
      {!isLoading &&
        (data.length === 0 ? (
          <div>
            <p>{error ? '评论加载失败' : '没有评论'}</p>
          </div>
        ) : (
          data.map((item, index) => {
            return (
              <div key={index} className="flex">
                <div>
                  <img src={item.user.image}></img>
                </div>
                <div>
                  <p>{item.user.name}</p>
                  <p>{item.comment}</p>
                </div>
              </div>
            )
          })
        ))}
      <CommentPust page={page} />
    </div>
  )
}

export function CommentPust({ page }: { page: string }) {
  function change_postcom(post_comment: { ok: boolean; message: string }) {
    setPostCom(post_comment)
    setTimeout(
      () =>
        setPostCom((prev) => {
          return { ok: false, message: prev.message }
        }),
      3000,
    )
  }
  const [postCom, setPostCom] = useState<{ ok: boolean; message: string }>({
    ok: false,
    message: '',
  })
  async function post_commit(formdata: FormData) {
    formdata.append('slug', page)
    try {
      const res = await fetch('/api/comment', {
        method: 'POST',
        body: formdata,
      })
      if (res.ok) {
        const res_data = await res.json()
        change_postcom(res_data)
      } else {
        change_postcom({ ok: true, message: '评论上传失败' })
      }
    } catch {
      change_postcom({ ok: true, message: '网络错误' })
    }
  }

  return (
    <>
      <MessageRemind state={postCom} setState={setPostCom} />
      <form action={post_commit}>
        <label>评论</label>
        <input className="border" name="comment"></input>
        <button type="submit">提交</button>
      </form>
    </>
  )
}
