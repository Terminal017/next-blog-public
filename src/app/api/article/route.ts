import { NextRequest } from 'next/server'
import getDB from '@/features/mongodb'
import { serialize } from 'next-mdx-remote-client/serialize'
import type { SerializeResult } from 'next-mdx-remote-client/serialize'
import { get_mdx_options } from '@/app/article/[slug]/mdx-process'
import type { HeadingType } from '@/types/index'

//这个请求用于客户端回调
export async function GET(request: NextRequest) {
  try {
    // 连接数据库
    const database = await getDB()
    const collection = database.collection('articles')

    //获取查询参数，查询参数应为详情查询：slug查询具体文章内容
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    if (slug) {
      //如果为slug参数，说明是获取单个文章数据
      const doc_content = await collection.findOne({ slug: slug })
      if (!doc_content?.content) {
        return Response.json({ content: '' }, { status: 504 })
      } else {
        const headings: HeadingType[] = []
        const options: any = get_mdx_options(headings)

        // 在服务端解析/编译 MDX 为 mdxSource
        const mdxSource: SerializeResult = await serialize({
          source: doc_content.content,
          options,
        })
        return Response.json({
          title: doc_content.title,
          date: doc_content.date,
          content: mdxSource,
          headings: headings,
        })
      }
    } else {
      return Response.json('缺少必要的查询参数', { status: 400 })
    }
  } catch {
    return Response.json('客户端请求数据失败', { status: 500 })
  }
}
