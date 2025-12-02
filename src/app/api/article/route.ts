import { NextRequest } from 'next/server'
import { auth } from '../../../../auth'
import getDB from '@/features/mongodb'
import type { ArticleFormType } from '@/types'
import { revalidateTag, unstable_expireTag } from 'next/cache'

interface ArticleReqType extends ArticleFormType {
  createAt: string
  updateAt: string
}

export async function GET(request: NextRequest) {
  //验证管理员身份
  const session = await auth()
  if (!session || session.user?.role !== 'admin') {
    return Response.json('无权限访问', { status: 401 })
  }

  try {
    // 连接数据库
    const database = await getDB()
    const collection = database.collection('articles')

    //获取查询参数，查询参数应为详情查询：slug和列表查询：page=数字&sort=字段:排序方式(1或-1)
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    if (slug) {
      //如果为slug参数，说明是获取单个文章数据
      const article = await collection.findOne(
        { slug: slug },
        {
          projection: {
            slug: 1,
            title: 1,
            img: 1,
            desc: 1,
            tags: 1,
            content: 1,
            _id: 0,
          },
        },
      )
      return Response.json(article)
    }

    //获取文章列表请求
    const page = Number(searchParams.get('page')) || 1
    const asort = searchParams.get('sort') || ''
    const [field, order] = asort.split(':')

    //根据sort排序结果构造排序对象
    const sortObj: Record<string, 1 | -1> = {}

    if (field && (order === '1' || order === '-1')) {
      sortObj[field] = order === '1' ? 1 : -1
    } else {
      sortObj.createAt = -1
    }

    //数据库查询结果
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

//处理添加新文章/
export async function POST(request: NextRequest) {
  //验证管理员身份
  const session = await auth()
  if (!session || session.user?.role !== 'admin') {
    return new Response('无权限访问', { status: 401 })
  }

  try {
    const formdata: ArticleReqType = await request.json()

    const insert_data = {
      slug: formdata.slug,
      title: formdata.title,
      img: formdata.img,
      desc: formdata.desc,
      tags: formdata.tags,
      content: formdata.content,
      createAt: formdata.createAt,
      updateAt: formdata.updateAt,
    }
    const database = await getDB()
    const collection = database.collection('articles')
    const result = await collection.insertOne(insert_data)

    if (result.acknowledged) {
      revalidateTag('articles')
      return new Response('添加成功')
    } else {
      return new Response('添加文章失败', { status: 500 })
    }
  } catch (error) {
    console.error('添加新文章错误：', error)
    return new Response('服务端发生错误', { status: 500 })
  }
}

//处理修改文章
export async function PUT(request: NextRequest) {
  //验证管理员身份
  const session = await auth()
  if (!session || session.user?.role !== 'admin') {
    return new Response('无权限访问', { status: 401 })
  }

  try {
    const formdata: ArticleReqType = await request.json()
    const slug = formdata.slug

    const update_data = {
      title: formdata.title,
      img: formdata.img,
      desc: formdata.desc,
      tags: formdata.tags,
      content: formdata.content,
      updateAt: formdata.updateAt,
    }

    //根据slug修改数据库中文章数据
    const database = await getDB()
    const collection = database.collection('articles')
    const result = await collection.updateOne(
      { slug: slug },
      { $set: update_data },
    )

    //检查是否有匹配的文章被修改
    if (result.matchedCount === 1) {
      // 重新验证与文章相关的缓存标签
      revalidateTag(`article-content-${slug}`)
      revalidateTag('articles')
      return new Response('修改成功')
    } else {
      return new Response('文章不存在', { status: 404 })
    }
  } catch (error) {
    console.error('修改文章错误：', error)
    return new Response('服务端发生错误', { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  //验证管理员身份
  const session = await auth()
  if (!session || session.user?.role !== 'admin') {
    return new Response('无权限访问', { status: 401 })
  }

  try {
    const request_data = await request.json()
    const articleSlug = request_data.slug as string
    const database = await getDB()
    const collection = database.collection('articles')
    const result = await collection.deleteOne({ slug: articleSlug })
    if (result.deletedCount === 1) {
      //文章删除后删除文章缓存
      unstable_expireTag(`article-content-${articleSlug}`)
      revalidateTag('articles')
      return new Response('删除成功')
    } else {
      return new Response('文章不存在或已被删除', { status: 404 })
    }
  } catch (error) {
    console.error('删除文章错误：', error)
    return new Response('服务端发生错误', { status: 500 })
  }
}
