import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({})

//让Gemini生成文章摘要，默认启用思考模式
export async function get_abstract(article: string) {
  //设置提示词
  const prompt_instruction = `
    你是一位资深博客主编。你的任务是阅读给定文章，并生成一段精炼的中文摘要。
    请遵守以下规则：
    1. 核心聚焦：直接提炼文章的主要观点、关键事件、核心论点或主要结论；技术文保留必要术语。
    2. 长度限制：严格控制在 80 字以内（包含标点）。
    3. 拒绝废话：不要使用“本文介绍了”“作者认为”等套话，直接陈述内容。
    4. 输出要求：只输出纯文本，不允许使用 Markdown、代码块、列表或多段格式。
    5. 思考模式：在生成摘要前，先进行简短的思考，理清文章结构和重点，再输出摘要内容。
    6. 语言风格：保持正式、客观和中立的语气，避免使用第一人称或情感化语言。
    7. 审核检查：生成摘要后，进行自我审核，确保符合上述所有要求。
`
  const prompt_content = `
    请为以下文章生成摘要：
    ---
    ${article}
    ---
  `

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt_content,
    config: {
      systemInstruction: prompt_instruction,
    },
  })

  return response.text || ''
}
