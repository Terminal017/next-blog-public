import { NextRequest } from 'next/server'
import getDB from '@/features/mongodb'
import { GoogleGenAI } from '@google/genai'
import { get_gemini_ans } from '@/features/gemini/question'

//处理用户问答请求
export async function POST(request: NextRequest) {
  try {
    const { question, slug } = await request.json()
    if (!question || !slug) {
      return Response.json({ ans: '客户端请求错误' }, { status: 400 })
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
      return Response.json({ ans: '暂时无法响应' }, { status: 500 })
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
      return Response.json({ ans: '文章信息检索失败' }, { status: 500 })
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

    console.log('用户问题提示词：', prompt_instruction, prompt_content)
    const answer = await get_gemini_ans(prompt_instruction, prompt_content)
    console.log('用户问题Embedding结果：', answer)

    return Response.json({ ans: answer })
  } catch (error) {
    return Response.json({ ans: '服务端发生错误' }, { status: 500 })
  }
}
