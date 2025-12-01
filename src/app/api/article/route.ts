import { NextRequest } from 'next/server'
import { auth } from '../../../../auth'
import getDB from '@/features/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest) {
  //验证管理员身份
  const session = await auth()
  if (!session || session.user?.role !== 'admin') {
    return Response.json('无权限访问', { status: 401 })
  }

  try {
    //获取查询参数，查询参数应为page=数字&sort=字段:排序方式(1或-1)
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page')) || 1
    const asort = searchParams.get('sort') || ''
    const [field, order] = asort.split(':')

    //根据sort排序结果构造排序对象
    const sortObj: Record<string, 1 | -1> = {}

    if (field && (order === '1' || order === '-1')) {
      sortObj[field] = order === '1' ? 1 : -1
    } else {
      sortObj['createAt'] = -1
    }

    //连接数据库，查询结果
    const database = await getDB()
    const collection = database.collection('articles')
    const articles_list = await collection
      .find({})
      .sort(sortObj)
      .project({ slug: 1, title: 1, createAt: 1, updateAt: 1 })
      .limit(10)
      .skip((page - 1) * 10)
      .toArray()

    return Response.json(articles_list)
  } catch (error) {
    console.error('服务端错误：', error)
    return Response.json('服务端发生错误', { status: 500 })
  }
}

//处理添加新文章/修改文章请求
export async function POST(request: NextRequest) {
  //验证管理员身份
  const session = await auth()
  if (!session || session.user?.role !== 'admin') {
    return Response.json('无权限访问', { status: 401 })
  }

  try {
    const formdata = await request.formData()
    const insert_data = {
      slug: formdata.get('slug') as string,
      title: formdata.get('title') as string,
      img: formdata.get('img') as string,
      desc: formdata.get('desc') as string,
      tags: JSON.parse(formdata.get('tags') as string) as string[],
      content: formdata.get('content') as string,
      createAt: formdata.get('createAt') as string,
      updateAt: formdata.get('updateAt') as string,
    }

    const database = await getDB()
    const collection = database.collection('articles')
    const result = await collection.insertOne(insert_data)

    return Response.json({ message: '添加成功', articleID: result.insertedId })
  } catch (error) {
    console.error('添加新文章错误：', error)
    return Response.json('服务端发生错误', { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  //验证管理员身份
  const session = await auth()
  if (!session || session.user?.role !== 'admin') {
    return Response.json('无权限访问', { status: 401 })
  }

  try {
    const request_data = await request.json()
    const articleSlug = request_data.slug as string
    const database = await getDB()
    const collection = database.collection('articles')
    const result = await collection.deleteOne({ slug: articleSlug })
    if (result.deletedCount === 1) {
      return Response.json('删除成功')
    } else {
      return Response.json('文章不存在或已被删除', { status: 404 })
    }
  } catch (error) {
    console.error('删除文章错误：', error)
    return Response.json('服务端发生错误', { status: 500 })
  }
}
