import { sign_in_google } from './login'
import { Session } from 'next-auth'
import Image from 'next/image'

import type { KeyedMutator } from 'swr'
import type { CommentType, PostResType } from '@/types/index'

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
