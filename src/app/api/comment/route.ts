import type { NextRequest } from 'next/server'

import getDB from '@/lib/mongodb'

interface CommentType {
  _id?: string
  comment: string
  datetime: Date
  user: { name: string; image: string }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  const database = await getDB()
  const data = (await database
    .collection('comments')
    .aggregate([
      //聚合操作：根据id查找users中的名称与头像
      { $match: { slug: slug } },
      {
        $lookup: {
          from: 'users', // 连接的下一个集合
          localField: 'user_id', // comments 中的字段
          foreignField: '_id', // users 中的字段
          as: 'user', // 合并为user数组
        },
      },
      {
        $unwind: '$user', // 打平数组为对象
      },
      {
        $project: {
          _id: 0,
          comment: 1,
          datetime: 1,
          'user.name': 1,
          'user.image': 1,
        },
      },
    ])
    .toArray()) as CommentType[]

  // console.log(data)
  return Response.json(data)
}
