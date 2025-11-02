'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { MessageRemind } from '@/ui/mini_component'
import type { KeyedMutator } from 'swr'

interface CommentType {
  _id: string
  comment: string
  datetime: string
  user: { name: string; image: string }
}

interface PostResType {
  ok: boolean
  message: string
  data: {
    _id: string
    comment: string
    datetime: string
    user: {
      name: string
      image: string
    }
  }
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
    mutate,
  } = useSWR<CommentType[]>(`/api/comment?slug=${page}`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  //设置处理提示
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

  //删除评论
  async function del_comment(id: string) {
    try {
      const res = await fetch('/api/comment', {
        method: 'DELETE',
        body: JSON.stringify({ _id: id }),
      })
      if (res.ok) {
        const res_data = await res.json()
        //如果删除成功，则乐观更新
        if (res_data.success) {
          mutate(
            (current_data) => {
              if (current_data) {
                return current_data.filter((item) => item._id !== id)
              } else {
                return current_data
              }
            },
            { revalidate: false },
          )
        }
        //设置提醒
        change_postcom({ ok: res_data.ok, message: res_data.message })
      } else {
        change_postcom({ ok: true, message: '评论删除失败' })
      }
    } catch {
      change_postcom({ ok: true, message: '网络错误' })
    }
  }

  return (
    <div
      className="mx-auto flex w-9/10 max-w-[53rem] flex-col 
    max-md:mx-[0.75rem]"
    >
      <MessageRemind state={postCom} setState={setPostCom} />
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
                <div>
                  <p>{item.datetime}</p>
                </div>
                <button
                  className="bg-green-200 p-2"
                  onClick={() => del_comment(item._id)}
                >
                  删除
                </button>
              </div>
            )
          })
        ))}
      <CommentPust page={page} mutate={mutate} />
    </div>
  )
}

//提交评论组件
export function CommentPust({
  page,
  mutate,
}: {
  page: string
  mutate: KeyedMutator<CommentType[]>
}) {
  //设置处理提示
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
        const res_data: PostResType = await res.json()
        //如果成功返回数据，则乐观更新
        if (res_data.data) {
          mutate(
            (current_data) => {
              if (current_data) {
                return [...current_data, res_data.data]
              } else {
                return [res_data.data]
              }
            },
            { revalidate: false },
          )
        }

        change_postcom({ ok: res_data.ok, message: res_data.message })
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
