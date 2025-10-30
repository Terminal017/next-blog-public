'use client'

import useSWR from 'swr'

interface CommentType {
  _id?: string
  comment: string
  datetime: Date
  user: { name: string; image: string }
}

export default function CommentList({ page }: { page: string }) {
  const fetcher = (url: string) => fetch(url).then((res) => res.json())

  //useSWR封装了返回机制与状态管理
  const {
    data = [],
    error,
    isLoading,
  } = useSWR<CommentType[]>(`/api/comment?slug=${page}`, fetcher)

  return (
    <div className="flex w-[45rem] max-w-4/5 flex-col max-md:max-w-9/10 ">
      {!isLoading &&
        (data.length === 0 ? (
          <div>
            <p>没有评论</p>
          </div>
        ) : (
          data.map((item, index) => {
            return (
              <div key={index}>
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
    </div>
  )
}
