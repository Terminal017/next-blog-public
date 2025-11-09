import type { NextRequest } from 'next/server'
import { auth } from '../../../../auth'

import getDB from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

interface CommentType {
  _id: ObjectId
  comment: string
  datetime: Date
  user: { name: string; image: string }
  //state语言：1表示active, 0表示deleted
  state: number
  parentID: string
  rootID: string
  parent_user?: string
}

interface CommentData {
  slug: string
  comment: string
  parentID: string
  rootID: string
}

//构造评论嵌套结构
function buildResponse(data: CommentType[]) {
  const commentMap = new Map()

  const result: any[] = []

  data.forEach((item) => {
    const processedItem = {
      ...item,
      _id: item._id.toString(),
      datetime: item.datetime.toISOString().split('T')[0],
      children: [] as any[],
      parent_user: '',
    }

    commentMap.set(processedItem._id, processedItem)

    if (item.parentID) {
      const parentComment = commentMap.get(item.parentID)
      if (parentComment) {
        processedItem.parent_user = parentComment.user.name
      }
    }

    if (item.rootID === '') {
      result.push(processedItem)
    } else {
      const root_com = commentMap.get(item.rootID)
      if (!root_com) {
        console.log('数据异常，无法找到根节点，请检查可能的bug')
      }
      root_com?.children.push(processedItem)
    }
  })

  return result
}
//处理请求评论
export async function GET(request: NextRequest) {
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
            parentID: 1,
            rootID: 1,
          },
        },
      ])
      .toArray()) as CommentType[]

    return Response.json(buildResponse(data))
  } catch (error) {
    //错误处理，发生错误时返回500
    console.log(error)
    return Response.json([], { status: 500 })
  }
}

//处理发布评论请求
export async function POST(request: NextRequest) {
  try {
    //获取用户信息并判断登陆
    const session = await auth()

    if (!session || !session.user) {
      return Response.json({ message: '未登录', data: {} }, { status: 401 })
    }

    //获取表单数据
    const formdata = await request.formData()
    const datalist = {} as CommentData

    //验证字段
    const requireKeys: (keyof CommentData)[] = [
      'slug',
      'comment',
      'parentID',
      'rootID',
    ]

    for (const key of requireKeys) {
      if (!formdata.has(key)) {
        return Response.json({ message: '数据格式错误', data: {} })
      } else {
        let value = formdata.get(key) as string
        datalist[key] = value
      }
    }

    const client = await getDB()
    const collection = client.collection('comments')
    const insert_date = new Date()
    const insert_doc = {
      slug: datalist.slug,
      user_id: session.user.id,
      comment: datalist.comment,
      datetime: insert_date,
      state: 1,
      parentID: datalist.parentID,
      rootID: datalist.rootID,
    }

    //检查插入的数据上级是否已被删除
    if (datalist.parentID !== '') {
      const parent_comment = await collection.findOne({
        _id: new ObjectId(datalist.parentID),
        state: 1,
      })

      if (!parent_comment) {
        return Response.json({ message: '回复评论不存在(>_<)', data: {} })
      }
    }
    const result = await collection.insertOne(insert_doc)

    //返回成功上传到的评论数据，用于乐观更新
    return Response.json({
      message: '评论已发布(＾▽＾)',
      data: {
        _id: result.insertedId,
        comment: datalist.comment,
        datetime: insert_date.toISOString().split('T')[0],
        user: {
          name: session.user.name,
          image: session.user.image,
        },
        parentID: datalist.parentID,
        rootID: datalist.rootID,
      },
    })
  } catch {
    return Response.json({ message: '评论上传失败', data: {} })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()

    //验证用户登陆
    if (!session || !session.user) {
      return Response.json({ message: '未登录', success: false })
    }

    //验证数据结构
    const request_data = await request.json()
    if (!request_data._id) {
      return Response.json({ message: '评论删除失败', success: false })
    }

    const database = await getDB()
    const collection = database.collection('comments')

    //逻辑删除：修改state
    const result = await collection.updateMany(
      {
        $or: [
          { _id: new ObjectId(request_data._id as string) },
          { rootID: request_data._id },
        ],
      },
      { $set: { state: 0 } },
    )

    if (result.modifiedCount === 0) {
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
