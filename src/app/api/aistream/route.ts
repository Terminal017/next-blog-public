import { NextRequest } from 'next/server'
import getDB from '@/features/mongodb'
import { GoogleGenAI } from '@google/genai'
import { get_gemini_stream } from '@/features/gemini/question'

//处理用户问答请求
export async function POST(request: NextRequest) {
  try {
    const { question, slug } = await request.json()
    if (!question || !slug) {
      return Response.json(
        { error: true, message: '客户端请求错误' },
        { status: 400 },
      )
    }

    const ai = new GoogleGenAI({})

    //获取问题向量
    const response = await ai.models.embedContent({
      model: 'gemini-embedding-001',
      contents: question,
      config: {
        outputDimensionality: 768, //限制向量维度为768
      },
    })

    const questionVector = response.embeddings?.[0].values
    if (!questionVector) {
      return Response.json(
        { error: true, message: '暂时无法响应' },
        { status: 500 },
      )
    }

    //在数据库中进行向量搜索，
    const database = await getDB()
    const isAtlas = !!process.env.MONGODB_URI?.includes('mongodb.net')
    let reuslt_chunks = []

    if (!isAtlas) {
      //本地环境回退
      reuslt_chunks = await database
        .collection('article_chunks')
        .find({ slug })
        .limit(3)
        .project({ chunkContent: 1, _id: 0 })
        .toArray()
    } else {
      reuslt_chunks = await database
        .collection('article_chunks')
        .aggregate([
          {
            //向量搜索，仅在Altas上可用
            $vectorSearch: {
              index: 'article_chunks_vector_idx',
              path: 'embedding',
              queryVector: questionVector,
              numCandidates: 100,
              limit: 3, // 最终返回数量
              filter: { slug }, // 过滤条件：只搜索当前文章
            },
          },
          {
            $project: {
              chunkContent: 1,
              score: { $meta: 'vectorSearchScore' }, // 返回相似度分数
            },
          },
        ])
        .toArray()
    }

    if (reuslt_chunks.length === 0) {
      return Response.json(
        { error: true, message: '文章信息检索失败' },
        { status: 500 },
      )
    }
    // 构建提示词
    const prompt_instruction = `
    你是专业文章助手。请根据提供的参考内容回答问题：
    1. 回答必须基于参考内容，不得编造。
    2. 若参考内容无相关信息，回答“未找到相关信息”。
    3. 使用中文，输出纯文本，不使用 Markdown 、列表或代码块。
  `
    const prompt_content = `参考内容：
      [Chunk 1]
      ${reuslt_chunks[0].chunkContent || ''}

      [Chunk 2]
      ${reuslt_chunks[1].chunkContent || ''}

      [Chunk 3]
      ${reuslt_chunks[2].chunkContent || ''}

      用户问题：
      ${question}
`
    //获取Gemini流式回答
    const ans_stream = await get_gemini_stream(
      prompt_instruction,
      prompt_content,
    )

    // 内容获取检查
    if (!ans_stream) {
      return Response.json(
        { error: true, message: '暂时无法响应' },
        { status: 500 },
      )
    }

    // 创建服务器返回给前端的流
    const stream = new ReadableStream({
      //start回调在流开始时被调用，参数controller是流的写入控制器
      //controller用来推送数据（enqueue）、报告错误（error）或结束流（close）
      async start(controller) {
        try {
          for await (const chunk of ans_stream) {
            const text = chunk.text
            //把JS 字符串编码成 UTF-8 字节流并推入流中
            controller.enqueue(new TextEncoder().encode(text))
          }
        } catch (e) {
          controller.error(e)
        } finally {
          controller.close()
        }
      },
    })

    //把ReadableStream包装成HTTP请求
    return new Response(stream, {
      headers: {
        //标识这是纯文本流
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    })
  } catch {
    return Response.json(
      { error: true, message: '服务端发生错误' },
      { status: 500 },
    )
  }
}
