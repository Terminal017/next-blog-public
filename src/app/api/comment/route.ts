import type { NextRequest } from 'next/server'
import { auth } from '../../../../auth'

import getDB from '@/lib/mongodb'
import { MongoClient, ObjectId } from 'mongodb'

interface CommentType {
  _id?: ObjectId
  comment: string
  datetime: Date
  user: { name: string; image: string }
  //state语言：1表示active, 0表示deleted
  state: number
}

//处理请求评论
export async function GET(request: NextRequest) {
  console.log('发生GET请求')
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    const database = await getDB()
    const data = (await database
      .collection('comments')
      .aggregate([
        //聚合操作：根据id查找users中的名称与头像
        { $match: { slug: slug, state: 1 } },
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
            _id: 1,
            comment: 1,
            datetime: 1,
            'user.name': 1,
            'user.image': 1,
          },
        },
      ])
      .toArray()) as CommentType[]

    const response_data = data.map((item) => {
      return {
        ...item,
        _id: item._id?.toString(),
        datetime: item.datetime.toISOString().split('T')[0],
      }
    })
    return Response.json(response_data)
  } catch (error) {
    //错误处理，发生错误时返回500
    console.log(error)
    return Response.json([], { status: 500 })
  }
}

//处理发布评论请求
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
      return Response.json({ message: '数据格式错误', data: {} })
    }

    const client = await getDB()
    const collection = client.collection('comments')
    const insert_date = new Date()
    const insert_doc = {
      slug: slug,
      user_id: session.user.id,
      comment: comment,
      datetime: insert_date,
      state: 1,
    }
    const result = await collection.insertOne(insert_doc)

    //返回成功上传到的评论数据，用于乐观更新
    return Response.json({
      message: '评论已发布(＾▽＾)',
      data: {
        _id: result.insertedId,
        comment: comment,
        datetime: insert_date.toISOString().split('T')[0],
        user: {
          name: session.user.name,
          image: session.user.image,
        },
      },
    })
  } catch {
    return Response.json({ message: '评论上传失败', data: {} })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const request_data = await request.json()
    if (!request_data._id) {
      return Response.json({ message: '', success: false })
    }

    const database = await getDB()
    const collection = database.collection('comments')

    const result = await collection.deleteOne({
      _id: new ObjectId(request_data._id as string),
    })

    if (result.deletedCount === 0) {
      return Response.json({
        message: '评论不存在',
        success: false,
      })
    } else {
      return Response.json({ message: '评论已删除', success: true })
    }
  } catch {
    return Response.json({ message: '评论删除失败', success: false })
  }
}
