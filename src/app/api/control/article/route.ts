// 这个路由用于控制中心查询修改文章

import { NextRequest } from 'next/server'
// import { auth } from '../../../../../auth'
import getDB from '@/features/mongodb'
import type { ArticleFormType } from '@/types'
import { revalidateTag, unstable_expireTag } from 'next/cache'
import { get_abstract } from '@/features/gemini/abstract'
import getChunkDoc from '@/features/gemini/chunks'

// 伪造的 Session，用于本地或测试
async function auth() {
  return {
    user: {
      role: 'admin',
      email: 'test001@gmail.com',
      name: 'Admin',
      image:
        'https://lh3.googleusercontent.com/a/ACg8ocLG8Jk5Btg0SHI-NABEJwdhhfRKj2wRzaZTXODhMEQdlYa-smg=s96-c',
      expires: '2026-012-12T10:15:30.123Z',
      id: 'user-001',
    },
  } as any
}

interface ArticleReqType extends ArticleFormType {
  createAt: string
  updateAt: string
  changeChunk: boolean //是否需要更新切片
}

interface UpdateArticleData {
  title: string
  img: string
  desc: string
  tags: string[]
  content: string
  updateAt: Date
  abstract?: string
}

// 获取文章列表或单个文章数据
export async function GET(request: NextRequest) {
  //验证管理员身份
  const session = await auth()
  if (!session || session.user?.role !== 'admin') {
    return Response.json('无权限访问', { status: 401 })
  }

  try {
    //连接数据库
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
    const articles_get_list = await collection
      .find({})
      .sort(sortObj)
      .project({ slug: 1, title: 1, createAt: 1, updateAt: 1 })
      .limit(10)
      .skip((page - 1) * 10)
      .toArray()

    //格式化日期显示
    const articles_list = articles_get_list.map((item) => ({
      ...item,
      createAt: item.createAt?.toISOString().split('T')[0],
      updateAt: item.updateAt?.toISOString().split('T')[0],
    }))

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

    let article_abstract = ''
    if (process.env.GEMINI_API_KEY) {
      article_abstract = await get_abstract(formdata.content)
    } else {
      console.warn('GEMINI_API_KEY 未配置，摘要生成已跳过')
    }

    const insert_data = {
      slug: formdata.slug,
      title: formdata.title,
      img: formdata.img,
      desc: formdata.desc,
      tags: formdata.tags,
      content: formdata.content,
      createAt: new Date(formdata.createAt),
      updateAt: new Date(formdata.updateAt),
      abstract: article_abstract, //AI摘要
    }
    const database = await getDB()
    const collection = database.collection('articles')
    //检查slug是否已存在
    const exists = await collection.findOne(
      { slug: insert_data.slug },
      { projection: { _id: 1 } },
    )
    if (exists) {
      return new Response('slug 已存在', { status: 409 })
    }

    const result = await collection.insertOne(insert_data)

    if (result.acknowledged) {
      revalidateTag('articles')
      //文章切片异步生成
      if (process.env.GEMINI_API_KEY) {
        generateChunksAsync(formdata.content, formdata.slug, database).catch(
          (error) => {
            console.error('文章切片生成失败：', error)
          },
        )
      }

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

    const update_data: UpdateArticleData = {
      title: formdata.title,
      img: formdata.img,
      desc: formdata.desc,
      tags: formdata.tags,
      content: formdata.content,
      updateAt: new Date(formdata.updateAt),
    }

    //仅在内容更改时更新AI摘要
    if (formdata.changeChunk) {
      let article_abstract = ''
      if (process.env.GEMINI_API_KEY) {
        article_abstract = await get_abstract(formdata.content)
      } else {
        console.warn('GEMINI_API_KEY 未配置，摘要修改已跳过')
      }
      update_data.abstract = article_abstract
      console.log('AI摘要已更新')
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
      revalidateTag(`article-meta-${slug}`)
      revalidateTag('articles')
      //文章切片异步更新
      if (formdata.changeChunk) {
        const chunkCollection = database.collection('article_chunks')
        //删除旧切片
        await chunkCollection.deleteMany({ slug: slug }).catch((error) => {
          console.error('删除旧文章切片失败：', error)
        })
        //生成新切片
        if (process.env.GEMINI_API_KEY) {
          generateChunksAsync(formdata.content, slug, database).catch(
            (error) => {
              console.error('文章切片生成失败：', error)
            },
          )
        }

        console.log('文章切片更新已触发')
      }
      return new Response('修改成功')
    } else {
      return new Response('文章不存在', { status: 404 })
    }
  } catch (error) {
    console.error('修改文章错误：', error)
    return new Response('服务端发生错误', { status: 500 })
  }
}

//删除文章
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
      unstable_expireTag(`article-meta-${articleSlug}`)
      revalidateTag('articles')

      //异步删除
      const chunkCollection = database.collection('article_chunks')
      await chunkCollection.deleteMany({ slug: articleSlug }).catch((error) => {
        console.error('删除文章切片错误：', error)
      })
      return new Response('删除成功')
    } else {
      return new Response('文章不存在或已被删除', { status: 404 })
    }
  } catch (error) {
    console.error('删除文章错误：', error)
    return new Response('服务端发生错误', { status: 500 })
  }
}

//异步生成文章切片并创建向量索引
async function generateChunksAsync(
  content: string,
  slug: string,
  database: any,
) {
  try {
    const chunkDoc = await getChunkDoc(content, slug)
    const collection = database.collection('article_chunks')
    await collection.insertMany(chunkDoc)
    //创建向量索引，这是Altas的功能，本地数据库不存在该功能
    const isAtlas = process.env.MONGODB_URI?.includes('mongodb.net')
    if (isAtlas) {
      try {
        //检查索引是否已存在
        const indexes = await collection.listSearchIndexes().toArray()
        const indexExists = indexes.some(
          (idx: any) => idx.name === 'article_chunks_vector_idx',
        )

        //只在索引不存在时创建
        if (!indexExists) {
          await collection.createSearchIndex({
            name: 'article_chunks_vector_idx',
            definition: {
              mappings: {
                dynamic: false,
                fields: {
                  embedding: {
                    type: 'knnVector',
                    dimensions: 768,
                    similarity: 'cosine',
                  },
                  slug: { type: 'string' },
                },
              },
            },
          })
          console.log('向量索引创建成功')
        }
      } catch (indexError) {
        //警告索引创建存在问题
        console.warn('索引操作失败:', indexError)
      }
    }

    console.log(`文章 ${slug} 切片生成完成`)
  } catch (error) {
    console.error(`文章 ${slug} 切片生成失败:`, error)
    throw error
  }
}
