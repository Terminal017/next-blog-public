import { GoogleGenAI } from '@google/genai'

// 简单句子分割（这里还需要优化，代码不应该拆分）
function splitToSentences(text: string) {
  // 用正则按句号、问号、感叹号、换行切分，保留标点
  return text
    .split(/(?<=[。！？\?!\n])/)
    .map((s) => s.trim())
    .filter(Boolean) // 移除空字符串
}

// 处理切片函数：按句子累积成 chunk，并保留重叠（滑窗）
export function chunkTextBySentences(
  text: string, // 文章文本
  targetChars = 150, // 每个 chunk 目标字符数
  overlapChars = 30, // 重叠字符数
) {
  const sentences = splitToSentences(text)
  const chunks: string[] = []
  let current = ''

  for (let i = 0; i < sentences.length; i++) {
    const s = sentences[i]
    // 判断是否可以继续添加到当前 chunk
    // 加上新句子不超长或当前chunk为空
    if ((current + ' ' + s).length <= targetChars || current.length === 0) {
      current = current ? current + ' ' + s : s
    } else {
      // 当前 chunk 已满,保存 chunk
      chunks.push(current.trim())

      // 创建重叠部分
      let overlap = ''
      if (overlapChars > 0) {
        // 取当前 chunk 的最后 40 个字符作为重叠
        overlap = current.slice(Math.max(0, current.length - overlapChars))
      }
      // 新 chunk = 重叠部分 + 当前句子
      current = overlap + ' ' + s
    }
  }
  // 处理最后一个 chunk
  if (current.trim()) chunks.push(current.trim())
  return chunks
}

//获取embedding切片函数：调用Gemini API批量生成
export async function getEmbeddings(chunks: string[]) {
  const ai = new GoogleGenAI({})

  const response = await ai.models.embedContent({
    model: 'gemini-embedding-001',
    contents: chunks,
    config: {
      outputDimensionality: 768, //限制向量维度为768
    },
  })

  //格式为 { chunkIndex: 0, chunkContent: "切片内容", embedding: [0.12, -0.04, ...] }[]
  return response.embeddings
}

// 获取文章切片并生成embedding，整理为插入文档格式
export default async function getChunkDoc(content: string, slug: string) {
  const chunks = chunkTextBySentences(content)
  const embeddings = (await getEmbeddings(chunks)) || []

  //整理为插入文档格式
  const docs = embeddings.map((item, index) => ({
    slug: slug,
    chunkIndex: index,
    chunkContent: chunks[index],
    embedding: item.values,
  }))

  return docs
}
