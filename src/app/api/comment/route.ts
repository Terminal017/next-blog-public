import type { NextRequest } from 'next/server'
import { auth } from '../../../../auth'

import getDB from '@/lib/mongodb'

interface CommentType {
  _id?: string
  comment: string
  datetime: Date
  user: { name: string; image: string }
}

export async function GET(request: NextRequest) {
  try {
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
            from: 'user_profile', // 连接的下一个集合
            localField: 'user_id', // comments 中的字段
            foreignField: 'user_id', // user_profile 中的字段
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

    return Response.json(data)
  } catch {
    //错误处理，发生错误时返回500
    return Response.json([], { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    //获取表单数据
    const formdata = await request.formData()
    const slug = formdata.get('slug')
    const comment = formdata.get('comment')

    //获取用户信息
    const session = await auth()

    if (
      typeof slug !== 'string' ||
      typeof comment !== 'string' ||
      !session?.user?.id ||
      !session?.user?.id
    ) {
      //ok仅表示发布过程完成，不表示请求是否成功
      return Response.json({ ok: true, message: '数据格式错误' })
    }

    const client = await getDB()
    const collection = client.collection('comments')
    const insert_doc = {
      slug: slug,
      user_id: session.user.id,
      comment: comment,
      datetime: new Date(),
    }
    await collection.insertOne(insert_doc)

    return Response.json({ ok: true, message: '评论已发布(＾▽＾)' })
  } catch {
    console.error('评论发布发生错误')
    return Response.json({ ok: true, message: '评论上传失败' })
  }
}
