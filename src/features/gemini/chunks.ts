import { GoogleGenAI } from '@google/genai'

// 句子分割（中文标点分割，保留代码块）
function splitToSentences(text: string) {
  const sentences: string[] = []

  // 提取并保护代码块
  const codeBlocks: string[] = []
  const textWithPlaceholders = text.replace(/```[\s\S]*?```/g, (match) => {
    codeBlocks.push(match) // 保存原始代码块
    return `__CODE_BLOCK_${codeBlocks.length - 1}__` // 替换为占位符
  })

  // 按中文标点分割
  const parts = textWithPlaceholders
    .split(/(?<=[。！？\n])/) // 在标点后分割（后向断言）
    .map((s) => s.trim()) // 去除空格
    .filter(Boolean) // 移除空字符串

  //还原代码块
  parts.forEach((part) => {
    const restored = part.replace(
      /__CODE_BLOCK_(\d+)__/g, // 匹配占位符
      (_, idx) => codeBlocks[parseInt(idx)], // 还原为原代码块
    )
    sentences.push(restored)
  })

  return sentences
}

// 处理切片函数：按句子累积成 chunk，并保留重叠（滑窗）
export function chunkTextBySentences(
  text: string, // 文章文本
  targetChars = 250, // 每个 chunk 目标字符数
  overlapChars = 50, // 重叠字符数
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
