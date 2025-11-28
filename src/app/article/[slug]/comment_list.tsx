'use client'

import useSWR from 'swr'
import { MessageRemind, useMessage } from '@/ui/mini_component'
import type { KeyedMutator } from 'swr'
import React, { useState, useRef } from 'react'
import { sign_in_google } from './login'
import { Session } from 'next-auth'
import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'
import { LoadingAni } from '@/ui/animation/ani_icon'
import { animate } from 'motion'

//评论数据类型
interface CommentType {
  _id: string
  tem_id?: string //临时ID用于乐观更新
  comment: string
  datetime: string
  user: { name: string; image: string }
  own_check: boolean
  parentID: string
  rootID: string
  like: number
  liked: boolean
  children?: CommentType[]
}

//提交评论返回数据类型
interface PostResType {
  message: string
  success: boolean
  comment_id?: string
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
    revalidateOnMount: true,
  })

  const { message, setMessage, sendMessage } = useMessage() //管理消息提醒
  const [replyid, setReplyid] = useState<string | null>(null) //管理回复栏状态，确认位置
  const commentRef = useRef<Map<string, CommentType>>(new Map()) //存储评论引用以同步ID

  //点赞评论
  async function handle_like(
    comment_id: string,
    liked: boolean,
    rootID: string,
  ) {
    //点赞乐观更新
    mutate(
      (current_data) => {
        if (!current_data) {
          return []
        }

        return current_data.map((item) => {
          if (item._id === comment_id) {
            return { ...item, like: item.like + (liked ? 1 : -1), liked }
          }

          if (item._id === rootID && item.children) {
            return {
              ...item,
              children: item.children.map((child) =>
                child._id === comment_id
                  ? {
                      ...child,
                      like: child.like + (liked ? 1 : -1),
                      liked,
                    }
                  : child,
              ),
            }
          }
          return item
        })
      },
      { revalidate: false },
    )

    try {
      const res = await fetch('/api/comment', {
        method: 'PATCH',
        body: JSON.stringify({ comment_id: comment_id, liked: liked }),
      })

      if (res.ok) {
        const res_data = await res.json()
        if (!res_data.success) {
          sendMessage(res_data.message)
          mutate() //点赞失败则回滚更新
        }
      } else {
        mutate()
        sendMessage('操作失败')
      }
    } catch {
      sendMessage('网络错误')
    }
  }

  //删除评论
  async function del_comment(id: string, rootID: string) {
    //进行删除的乐观更新
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
                children: item.children?.filter((child) => child._id !== id),
              }
            })
          }
        }
      },
      { revalidate: false },
    )
    try {
      const res = await fetch('/api/comment', {
        method: 'DELETE',
        body: JSON.stringify({ _id: id }),
      })
      if (res.ok) {
        const res_data = await res.json()
        sendMessage(res_data.message)
        if (!res_data.success) {
          mutate() //删除失败则回滚
        }
      } else {
        mutate()
        sendMessage('评论删除失败')
      }
    } catch {
      sendMessage('网络错误')
    }
  }

  return (
    <div
      className="mx-auto mt-16 mb-8 flex w-9/10 max-w-[53rem] flex-col 
    gap-4 max-md:mx-auto"
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
        commentRef={commentRef.current}
      />
      <h2 className="text-2xl tracking-wide">{`${data.reduce((total, item) => {
        return total + 1 + (item.children?.length || 0)
      }, 0)} 条评论`}</h2>

      {isLoading ? (
        <div className="mt-8 mb-12 flex flex-row items-center justify-center">
          <p className="mr-3 text-2xl font-medium">评论加载中</p>
          <LoadingAni width={30} />
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {data.length === 0 ? (
            <div className="mt-8 mb-12 flex flex-row justify-center">
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
                  key={item.tem_id || item._id}
                  page={page}
                  item={item}
                  del_comment={del_comment}
                  handle_like={handle_like}
                  replyid={replyid}
                  setReplyid={setReplyid}
                  mutate={mutate}
                  sendMessage={sendMessage}
                  childItems={item.children || []}
                  session={session}
                  ani_delay={index * 0.15}
                  commentRef={commentRef.current}
                />
              )
            })
          )}
        </AnimatePresence>
      )}
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
  childItems,
  session,
  ani_delay,
  commentRef,
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
  childItems: CommentType[]
  session: Session | null
  ani_delay: number
  commentRef: Map<string, CommentType>
}) {
  return (
    <motion.div
      className="text-on-background cursor-default flex-col rounded-xl px-4 py-4
      shadow-[0_0_12px_rgba(2,6,23,0.06)] ring-1 ring-gray-200 dark:ring-gray-700"
      initial={{ opacity: 0, x: -300 }}
      animate={{
        opacity: 1,
        x: 0,
        transition: { duration: 0.75, ease: 'easeInOut', delay: ani_delay },
      }}
      exit={{
        opacity: 0,
        x: 500,
        transition: { duration: 0.75, ease: 'easeInOut' },
      }}
    >
      <div className="flex flex-row gap-4">
        <Image
          className="h-12 w-12 rounded-full"
          src={item.user.image}
          alt="用户头像"
          width={48}
          height={48}
        />
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
                  ? 'fill-primary text-primary'
                  : `hover:fill-primary hover:text-primary fill-gray-800 dark:fill-gray-200`
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
                if (replyid === item._id) {
                  setReplyid(null)
                } else {
                  setReplyid(item._id)
                }
              }}
            >
              {replyid === item._id ? '取消回复' : '回复'}
            </button>
            {item.own_check && (
              <button
                className="hover:bg-surface-highest rounded-4xl px-4 py-2"
                onClick={() => del_comment(item._id, item.rootID)}
              >
                删除
              </button>
            )}
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
          commentRef={commentRef}
        />
      )}
      {childItems.map((child_item, index) => {
        return (
          <React.Fragment key={index}>
            <div className="ml-14 flex flex-row gap-4">
              <Image
                className="h-9 w-9 rounded-full"
                src={child_item.user.image}
                alt="用户头像"
                width={36}
                height={36}
              />
              <div className="flex flex-col">
                <div className="flex flex-row flex-wrap items-end gap-x-3 whitespace-nowrap">
                  <p className="text-primary text-base font-medium">
                    {child_item.user.name}
                  </p>
                  {
                    //二级评论回复设计：这里的设计是基于评论而非基于user
                    //即回复二级评论时无论是否是一级评论的作者都会显示
                    child_item.parentID !== item._id && (
                      <p className="shrink-0 text-base max-md:order-1">
                        {(() => {
                          const name = item.children?.find(
                            (obj) => obj._id === child_item.parentID,
                          )?.user?.name
                          return name ? `回复 ${name}` : ''
                        })()}
                      </p>
                    )
                  }
                  <p
                    className="shrink-0 text-[15px] text-gray-600
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
                        ? 'fill-primary text-primary'
                        : `hover:fill-primary hover:text-primary fill-gray-800 dark:fill-gray-200`
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
                      if (replyid === child_item._id) {
                        setReplyid(null)
                      } else {
                        setReplyid(child_item._id)
                      }
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
                commentRef={commentRef}
              />
            )}
          </React.Fragment>
        )
      })}
    </motion.div>
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
  commentRef,
}: {
  page: string
  mutate: KeyedMutator<CommentType[]>
  sendMessage: (message: string) => void
  parentID: string | null
  rootID: string | null
  setReplyid: (id: string | null) => void
  session: Session | null
  commentRef: Map<string, CommentType>
}) {
  async function post_commit(formdata: FormData) {
    //新增评论数据
    const tem_id = crypto.randomUUID()
    const new_item: CommentType = {
      _id: '',
      tem_id: tem_id,
      comment: formdata.get('comment') as string,
      datetime: new Date().toISOString().split('T')[0],
      user: {
        name: session?.user?.name || '>-<',
        image: session?.user?.image || '',
      },
      own_check: true,
      parentID: parentID || '',
      rootID: rootID || '',
      like: 0,
      liked: false,
    }

    commentRef.set(tem_id, new_item) //将临时评论存入引用以同步ID

    //乐观更新
    mutate(
      (current_data) => {
        if (!current_data) {
          return [new_item]
        } else {
          if (!new_item.rootID) {
            return [new_item, ...current_data]
          }
          return current_data.map((item) => {
            if (item._id !== new_item.rootID) {
              return item
            } else {
              return {
                ...item,
                children: [new_item, ...(item.children || [])],
              }
            }
          })
        }
      },
      { revalidate: false },
    )

    formdata.append('slug', page)
    formdata.append('parentID', parentID || '')
    formdata.append('rootID', rootID || '')
    try {
      const res = await fetch('/api/comment', {
        method: 'POST',
        body: formdata,
      })
      if (res.ok) {
        const res_data: PostResType = await res.json()
        sendMessage(res_data.message)
        if (res_data.success) {
          const comment = commentRef.get(tem_id)
          if (comment && res_data.comment_id) {
            //同步ID
            comment._id = res_data.comment_id
            commentRef.delete(tem_id)
          }
        } else {
          //发生错误回滚更新
          mutate()
        }
      } else {
        sendMessage('评论上传失败')
        mutate()
      }
    } catch {
      sendMessage('网络错误')
    }
  }

  return (
    <div
      className={`my-2 w-auto rounded-xl px-5 py-4 shadow-[0_0_12px_rgba(2,6,23,0.06)]
      ring-1 ring-gray-200 max-md:px-3 max-md:py-3 dark:ring-gray-700 
      ${parentID ? 'ml-12' : ''}`}
    >
      <form
        action={post_commit}
        className="flex flex-col gap-1.5 max-md:gap-1"
        onSubmit={() => {
          //关闭回复栏
          setReplyid(null)
        }}
      >
        <div className="flex min-h-4 flex-row items-center gap-4">
          {session?.user && (
            <>
              <Image
                src={session.user.image || ''}
                alt="用户头像"
                className="h-12 w-12 rounded-full"
                width={48}
                height={48}
              />
              <p className="text-xl font-medium">{session.user.name}</p>
            </>
          )}
        </div>
        <div className="w-full">
          <textarea
            className="border-outline/80 focus:border-primary/90 min-h-16
            w-full resize-none overflow-hidden rounded-sm border-[1.5px] border-solid
            px-2 py-1 leading-[1.5] focus:outline-none max-md:h-5"
            name="comment"
            onInput={(e) => {
              // 自动调整高度,上面resize-none取消用户调整高度
              const t = e.currentTarget as HTMLTextAreaElement
              t.style.height = 'auto'
              t.style.height = `${t.scrollHeight}px`
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
              Google登录
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
