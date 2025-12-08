import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({})

//让Gemini生成文章摘要，默认启用思考模式
export async function get_gemini_ans(instruction: string, content: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: content,
    config: {
      systemInstruction: instruction,
      thinkingConfig: {
        thinkingBudget: 0, // 默认不思考
      },
    },
  })

  return response.text || ''
}
