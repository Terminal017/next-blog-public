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
  own_check: boolean //表示是否为作者
  parentID: string
  rootID: string
  like: number
  liked: boolean
  parent_user?: string
}

interface CommentData {
  slug: string
  comment: string
  parentID: string
  rootID: string
}

interface LikeData {
  comment_id: string
  liked: boolean
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
      root_com?.children.push(processedItem)
    }
  })

  //翻转数组，此时时间新的在前
  return result.reverse()
}
//处理请求评论
export async function GET(request: NextRequest) {
  const session = await auth()
  const userId = session?.user?.id || null

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
        //获取like和liked
        { $addFields: { id_str: { $toString: '$_id' } } },
        {
          $lookup: {
            from: 'likes',
            localField: 'id_str', // 评论的 id
            foreignField: 'comment_id', // like 表对应字段
            as: 'likes',
          },
        },
        {
          //如果无法匹配到则设为空数组
          $addFields: {
            likesArray: {
              $ifNull: [{ $first: '$likes.likes' }, []],
            },
          },
        },
        {
          $addFields: {
            like: { $size: '$likesArray' },
            liked: { $in: [userId, '$likesArray'] },
          },
        },
        //检查是否为拥有者
        {
          $addFields: {
            own_check: { $eq: ['$user_id', userId] },
          },
        },
        {
          $project: {
            _id: 1,
            comment: 1,
            datetime: 1,
            'user.name': 1,
            'user.image': 1,
            own_check: 1,
            parentID: 1,
            rootID: 1,
            like: 1,
            liked: 1,
          },
        },
        { $sort: { datetime: 1 } }, //旧时间在前
      ])
      .toArray()) as CommentType[]

    return Response.json(buildResponse(data))
  } catch {
    //错误处理，发生错误时返回500
    return Response.json([], { status: 500 })
  }
}

//处理发布评论请求
export async function POST(request: NextRequest) {
  try {
    //获取用户信息并判断登录
    const session = await auth()

    if (!session || !session.user) {
      return Response.json({ message: '未登录', success: false })
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
        return Response.json({ message: '数据格式错误', success: false })
      } else {
        const value = formdata.get(key) as string
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
        return Response.json({ message: '回复评论不存在(>_<)', success: false })
      }
    }

    const result = await collection.insertOne(insert_doc)

    //返回成功上传到的评论数据，用于乐观更新
    return Response.json({
      success: true,
      message: '评论已发布(＾▽＾)',
      comment_id: result.insertedId,
    })
  } catch {
    return Response.json({ message: '评论上传失败', success: false })
  }
}

//处理删除评论请求
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()

    //验证用户登录
    if (!session || !session.user) {
      return Response.json({ message: '无权限删除', success: false })
    }

    //验证数据结构
    const request_data = await request.json()
    if (!request_data._id) {
      return Response.json({ message: '评论删除失败', success: false })
    }
    const database = await getDB()
    const collection = database.collection('comments')

    const comment_check = await collection.findOne({
      _id: new ObjectId(request_data._id as string),
    })

    if (!comment_check || !comment_check.user_id) {
      return Response.json({
        message: '评论不存在',
        success: false,
      })
    }

    if (comment_check.user_id !== session.user.id) {
      return Response.json({ message: '无权限删除', success: false })
    }

    //逻辑删除：修改state
    await collection.updateMany(
      {
        $or: [
          { _id: new ObjectId(request_data._id as string) },
          { rootID: request_data._id },
        ],
      },
      { $set: { state: 0 } },
    )

    return Response.json({ message: '评论已删除', success: true })
  } catch {
    return Response.json({ message: '评论删除失败', success: false })
  }
}

//控制评论点赞
export async function PATCH(request: NextRequest) {
  try {
    const like_data: LikeData = await request.json()

    //检验数据
    if (!like_data.comment_id || like_data.liked === undefined) {
      return Response.json({ message: '数据错误', success: false })
    }

    //检验用户登录状态
    const session = await auth()
    if (!session || !session.user) {
      return Response.json(
        { message: '未登录', success: false },
        { status: 401 },
      )
    }

    const database = await getDB()
    const collection = database.collection('likes')
    //更新点赞数据
    await collection.updateOne(
      { comment_id: like_data.comment_id },
      like_data.liked
        ? { $addToSet: { likes: session.user.id } }
        : { $pull: { likes: session.user.id } as any },
      { upsert: like_data.liked },
    )

    return Response.json({ message: '操作成功', success: true })
  } catch {
    return Response.json({ message: '操作失败', success: false })
  }
}
