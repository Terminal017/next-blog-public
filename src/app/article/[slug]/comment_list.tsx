'use client'

import useSWR from 'swr'
import { MessageRemind, useMessage } from '@/ui/mini_component'
import type { KeyedMutator } from 'swr'
import { useState } from 'react'
import React from 'react'
import { sign_in_google } from './login'
import { Session } from 'next-auth'

//评论数据类型
interface CommentType {
  _id: string
  comment: string
  datetime: string
  user: { name: string; image: string }
  parentID: string
  rootID: string
  like: number
  liked: boolean
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
export function CommentList({
  page,
  session,
}: {
  page: string
  session: Session | null
}) {
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
  const [replyid, setReplyid] = useState<string | null>(null) //管理回复栏状态，确认位置

  //点赞评论
  async function handle_like(
    comment_id: string,
    liked: boolean,
    rootID: string,
  ) {
    try {
      const res = await fetch('/api/comment', {
        method: 'PATCH',
        body: JSON.stringify({ comment_id: comment_id, liked: liked }),
      })

      if (res.ok) {
        const res_data = await res.json()
        if (res_data.success) {
          console.log('点赞操作成功，乐观更新数据')
          mutate((current_data) => {
            if (!current_data) return []

            return current_data.map((item) => {
              if (item._id === comment_id) {
                return { ...item, like: item.like + (liked ? 1 : -1), liked }
              }

              if (item._id === rootID && item.children) {
                return {
                  ...item,
                  children: item.children.map((child) =>
                    child._id === comment_id
                      ? { ...child, like: child.like + (liked ? 1 : -1), liked }
                      : child,
                  ),
                }
              }
              return item
            })
          })
        } else {
          sendMessage(res_data.message)
        }
      } else {
        sendMessage('操作失败')
      }
    } catch {
      sendMessage('网络错误')
    }
  }

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
      className="mx-auto mt-16 mb-8 flex w-9/10 max-w-[53rem] flex-col 
    gap-4 max-md:mx-[0.75rem]"
    >
      <MessageRemind state={message} setState={setMessage} />
      <h2 className="text-3xl">{`评论`}</h2>
      <CommentPost
        page={page}
        mutate={mutate}
        sendMessage={sendMessage}
        parentID={null}
        rootID={null}
        setReplyid={setReplyid}
        session={session}
      />
      <h2 className="text-2xl tracking-wide">{`${data.reduce((total, item) => {
        return total + 1 + (item.children?.length || 0)
      }, 0)} 条评论`}</h2>
      {!isLoading &&
        (data.length === 0 ? (
          <div className="my-8 flex flex-row justify-center">
            <p className="text-2xl font-medium">
              {error
                ? '发生错误，评论加载失败 ( >_< )'
                : '没找到任何评论！( >_< )'}
            </p>
          </div>
        ) : (
          data.map((item, index) => {
            return (
              <CommentItem
                key={index}
                page={page}
                item={item}
                del_comment={del_comment}
                handle_like={handle_like}
                replyid={replyid}
                setReplyid={setReplyid}
                mutate={mutate}
                sendMessage={sendMessage}
                children={item.children || []}
                session={session}
              />
            )
          })
        ))}
    </div>
  )
}

function CommentItem({
  page,
  item,
  del_comment,
  handle_like,
  replyid,
  setReplyid,
  mutate,
  sendMessage,
  children,
  session,
}: {
  page: string
  item: CommentType
  del_comment: (id: string, rootID: string) => Promise<void>
  handle_like: (
    comment_id: string,
    liked: boolean,
    rootID: string,
  ) => Promise<void>
  replyid: string | null
  setReplyid: (id: string | null) => void
  mutate: KeyedMutator<CommentType[]>
  sendMessage: (message: string) => void
  children: CommentType[]
  session: Session | null
}) {
  return (
    <div
      className="text-on-background cursor-default flex-col rounded-xl px-4 py-4
      shadow-[0_0_12px_rgba(2,6,23,0.06)] ring-1 ring-gray-200 dark:ring-gray-700"
    >
      <div className="flex flex-row gap-4">
        <img
          className="h-12 w-12 rounded-full"
          src={item.user.image}
          alt="用户头像"
        ></img>
        <div className="flex flex-col">
          <div className="flex flex-row items-end gap-3">
            <p className="text-primary text-base font-medium">
              {item.user.name}
            </p>
            <p
              className="text-[15px] text-gray-600 
            dark:text-gray-400"
            >
              {item.datetime}
            </p>
          </div>
          <div className="mt-1.5">
            <p className="text-base wrap-anywhere whitespace-pre-wrap">
              {item.comment}
            </p>
          </div>
          <div
            className="flex flex-row text-sm text-gray-800
          dark:text-gray-200"
          >
            <button
              className={`${
                item.liked
                  ? 'fill-red-500 text-red-500 dark:fill-red-400 dark:text-red-400'
                  : `fill-gray-800 hover:fill-red-500 hover:text-red-500 dark:fill-gray-200 
                    dark:hover:fill-red-400 dark:hover:text-red-400`
              } mr-3 flex items-center `}
              onClick={() => handle_like(item._id, !item.liked, item.rootID)}
            >
              <svg
                className="relative bottom-0.25 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
              >
                <path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z" />
              </svg>

              <span className="ml-1">{item.like}</span>
            </button>
            <button
              className="hover:bg-surface-highest rounded-4xl px-4 py-2"
              onClick={() => {
                replyid === item._id ? setReplyid(null) : setReplyid(item._id)
              }}
            >
              {replyid === item._id ? '取消回复' : '回复'}
            </button>
            <button
              className="hover:bg-surface-highest rounded-4xl px-4 py-2"
              onClick={() => del_comment(item._id, item.rootID)}
            >
              删除
            </button>
          </div>
        </div>
      </div>
      {replyid === item._id && (
        <CommentPost
          page={page}
          mutate={mutate}
          sendMessage={sendMessage}
          parentID={item._id}
          rootID={item._id}
          setReplyid={setReplyid}
          session={session}
        />
      )}
      {children.map((child_item, index) => {
        return (
          <React.Fragment key={index}>
            <div className="ml-14 flex flex-row gap-4">
              <img
                className="h-9 w-9 rounded-full"
                src={child_item.user.image}
                alt="用户头像"
              ></img>
              <div className="flex flex-col">
                <div className="flex flex-row items-end gap-3">
                  <p className="text-primary text-base font-medium">
                    {child_item.user.name}
                  </p>
                  {
                    //二级评论回复设计：这里的设计是基于评论而非基于user
                    //即回复二级评论时无论是否是一级评论的作者都会显示
                    child_item.parentID !== item._id && (
                      <p>{`回复 ${
                        item.children?.find(
                          (obj) => obj._id === child_item.parentID,
                        )?.user.name
                      }`}</p>
                    )
                  }
                  <p
                    className="text-[15px] text-gray-600
              dark:text-gray-400"
                  >
                    {child_item.datetime}
                  </p>
                </div>
                <div className="mt-1.5">
                  <p className="text-base wrap-anywhere whitespace-pre-wrap">
                    {child_item.comment}
                  </p>
                </div>
                <div
                  className="flex flex-row text-sm text-gray-800
            dark:text-gray-200"
                >
                  <button
                    className={`${
                      child_item.liked
                        ? 'fill-red-500 text-red-500 dark:fill-red-400 dark:text-red-400'
                        : `fill-gray-800 hover:fill-red-500 hover:text-red-500 dark:fill-gray-200 
                          dark:hover:fill-red-400 dark:hover:text-red-400`
                    } mr-3 flex items-center `}
                    onClick={() =>
                      handle_like(
                        child_item._id,
                        !child_item.liked,
                        child_item.rootID,
                      )
                    }
                  >
                    <svg
                      className="relative bottom-0.25 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                    >
                      <path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z" />
                    </svg>
                    <span className="ml-1">{child_item.like}</span>
                  </button>
                  <button
                    className="hover:bg-surface-highest rounded-4xl px-4 py-2"
                    onClick={() => {
                      replyid === child_item._id
                        ? setReplyid(null)
                        : setReplyid(child_item._id)
                    }}
                  >
                    {replyid === child_item._id ? '取消回复' : '回复'}
                  </button>
                  <button
                    className="hover:bg-surface-highest rounded-4xl px-4 py-2"
                    onClick={() =>
                      del_comment(child_item._id, child_item.rootID)
                    }
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
            {replyid === child_item._id && (
              <CommentPost
                page={page}
                mutate={mutate}
                sendMessage={sendMessage}
                parentID={child_item._id}
                rootID={item._id}
                setReplyid={setReplyid}
                session={session}
              />
            )}
          </React.Fragment>
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
  session,
}: {
  page: string
  mutate: KeyedMutator<CommentType[]>
  sendMessage: (message: string) => void
  parentID: string | null
  rootID: string | null
  setReplyid: (id: string | null) => void
  session: Session | null
}) {
  //获取用户登陆状态

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
              const new_item = { ...res_data.data, like: 0, liked: false }
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
    <div
      className="my-2 w-full rounded-xl px-5 py-4 
      shadow-[0_0_12px_rgba(2,6,23,0.06)] ring-1 ring-gray-200 dark:ring-gray-700"
    >
      <form action={post_commit} className="flex flex-col gap-2">
        <div className="flex min-h-4 flex-row items-center gap-4">
          {session?.user && (
            <>
              <img
                src={session.user.image || ''}
                alt="用户头像"
                className="h-12 w-12 rounded-full"
              />
              <p className="text-xl font-medium">{session.user.name}</p>
            </>
          )}
        </div>
        <div className="w-full">
          <textarea
            className="border-outline/80 focus:border-primary/90
            min-h-16 w-full resize-none overflow-hidden rounded-sm
            border-[1.5px] border-solid px-2 py-1 leading-[1.5] focus:outline-none"
            name="comment"
            onInput={(e) => {
              // 自动调整高度,上面resize-none取消用户调整高度
              const t = e.currentTarget as HTMLTextAreaElement
              t.style.height = 'auto'
              t.style.height = t.scrollHeight + 'px'
            }}
            required
          ></textarea>
        </div>
        <div className="flex flex-row justify-end">
          {session ? (
            <button
              type="submit"
              onClick={(e) => {
                // 从当前按钮向上找到 form，再找 textarea
                const form = e.currentTarget.closest('form')
                const textarea = form?.querySelector('textarea')
                if (textarea) {
                  // 延迟重置，让表单先提交
                  setTimeout(() => {
                    textarea.value = ''
                    textarea.style.height = 'auto'
                  }, 100)
                }
              }}
              className="bg-primary-container rounded-sm px-4 py-1.25
                        text-lg hover:brightness-95 dark:hover:brightness-125"
            >
              提交
            </button>
          ) : (
            <button
              type="button"
              onClick={() => sign_in_google()}
              className="bg-primary-container rounded-sm px-4 py-1.25
          text-lg hover:brightness-95 dark:hover:brightness-125"
            >
              Google登陆
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
