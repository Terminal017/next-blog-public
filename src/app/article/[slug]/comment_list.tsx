'use client'

import useSWR from 'swr'
import { MessageRemind, useMessage } from '@/ui/mini_component'
import type { KeyedMutator } from 'swr'
import { useState } from 'react'

//评论数据类型
interface CommentType {
  _id: string
  comment: string
  datetime: string
  user: { name: string; image: string }
  parentID: string
  rootID: string
  children?: CommentType[]
}

//提交评论返回数据类型
interface PostResType {
  message: string
  data: {
    _id: string
    comment: string
    datetime: string
    user: {
      name: string
      image: string
    }
    parentID: string
    rootID: string
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

  const { message, setMessage, sendMessage } = useMessage() //管理消息提醒
  const [replyid, setReplyid] = useState<string | null>(null)

  //删除评论
  async function del_comment(id: string, rootID: string) {
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
              if (!current_data) {
                return current_data
              } else {
                if (!rootID) {
                  return current_data.filter((item) => item._id !== id)
                } else {
                  return current_data.map((item) => {
                    if (item._id !== rootID) {
                      return item
                    }
                    return {
                      ...item,
                      children: item.children?.filter(
                        (child) => child._id !== id,
                      ),
                    }
                  })
                }
              }
            },
            { revalidate: false },
          )
        }
        //设置提醒
        sendMessage(res_data.message)
      } else {
        sendMessage('评论删除失败')
      }
    } catch {
      sendMessage('网络错误')
    }
  }

  return (
    <div
      className="mx-auto flex w-9/10 max-w-[53rem] flex-col 
    max-md:mx-[0.75rem]"
    >
      <MessageRemind state={message} setState={setMessage} />
      {!isLoading &&
        (data.length === 0 ? (
          <div>
            <p>{error ? '评论加载失败' : '没有评论'}</p>
          </div>
        ) : (
          data.map((item, index) => {
            return (
              <CommentItem
                key={index}
                page={page}
                item={item}
                del_comment={del_comment}
                replyid={replyid}
                setReplyid={setReplyid}
                mutate={mutate}
                sendMessage={sendMessage}
                children={item.children || []}
              />
            )
          })
        ))}
      <br></br>
      <br></br>
      <CommentPost
        page={page}
        mutate={mutate}
        sendMessage={sendMessage}
        parentID={null}
        rootID={null}
        setReplyid={setReplyid}
      />
    </div>
  )
}

function CommentItem({
  page,
  item,
  del_comment,
  replyid,
  setReplyid,
  mutate,
  sendMessage,
  children,
}: {
  page: string
  item: CommentType
  del_comment: (id: string, rootID: string) => Promise<void>
  replyid: string | null
  setReplyid: (id: string | null) => void
  mutate: KeyedMutator<CommentType[]>
  sendMessage: (message: string) => void
  children: CommentType[]
}) {
  return (
    <div className="flex-col">
      <div className="flex">
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
          className="bg-purple-200 p-2"
          onClick={() => {
            replyid === item._id ? setReplyid(null) : setReplyid(item._id)
          }}
        >
          {replyid === item._id ? '取消回复' : '回复'}
        </button>
        <button
          className="bg-green-200 p-2"
          onClick={() => del_comment(item._id, item.rootID)}
        >
          删除
        </button>
      </div>
      {replyid === item._id && (
        <CommentPost
          page={page}
          mutate={mutate}
          sendMessage={sendMessage}
          parentID={item._id}
          rootID={item._id}
          setReplyid={setReplyid}
        />
      )}
      {children.map((child_item, index) => {
        return (
          <div className="ml-8 flex" key={index}>
            <div>
              <img src={child_item.user.image}></img>
            </div>
            <div>
              <p>{child_item.user.name}</p>
              <p>{child_item.comment}</p>
            </div>
            <button
              className="rounded-2xl bg-purple-200 p-1"
              onClick={() => {
                replyid === child_item._id
                  ? setReplyid(null)
                  : setReplyid(child_item._id)
              }}
            >
              {replyid === child_item._id ? '取消回复' : '回复'}
            </button>
            <button
              className="bg-green-200 p-2"
              onClick={() => del_comment(child_item._id, child_item.rootID)}
            >
              删除
            </button>
            {replyid === child_item._id && (
              <CommentPost
                page={page}
                mutate={mutate}
                sendMessage={sendMessage}
                parentID={child_item._id}
                rootID={item._id}
                setReplyid={setReplyid}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

//提交评论组件
export function CommentPost({
  page,
  mutate,
  sendMessage,
  parentID,
  rootID,
  setReplyid,
}: {
  page: string
  mutate: KeyedMutator<CommentType[]>
  sendMessage: (message: string) => void
  parentID: string | null
  rootID: string | null
  setReplyid: (id: string | null) => void
}) {
  async function post_commit(formdata: FormData) {
    formdata.append('slug', page)
    formdata.append('parentID', parentID || '')
    formdata.append('rootID', rootID || '')
    try {
      const res = await fetch('/api/comment', {
        method: 'POST',
        body: formdata,
      })
      if (res.ok) {
        setReplyid(null)
        const res_data: PostResType = await res.json()
        //如果成功返回数据，则乐观更新
        if (res_data.data) {
          mutate(
            (current_data) => {
              const new_item = res_data.data
              if (!current_data) {
                return [new_item]
              } else {
                if (!new_item.rootID) {
                  return [...current_data, new_item]
                }
                return current_data.map((item) => {
                  if (item._id !== new_item.rootID) {
                    return item
                  } else {
                    return {
                      ...item,
                      children: [...(item.children || []), new_item],
                    }
                  }
                })
              }
            },
            { revalidate: false },
          )
        }
        sendMessage(res_data.message)
      } else {
        sendMessage('评论上传失败')
      }
    } catch {
      sendMessage('网络错误')
    }
  }

  return (
    <>
      <form action={post_commit}>
        <label>评论</label>
        <input className="border" name="comment" required></input>
        <button type="submit">提交</button>
      </form>
    </>
  )
}
