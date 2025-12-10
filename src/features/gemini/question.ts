import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({})

//让Gemini正常生成内容
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

//让Gemini流式生成内容
export async function get_gemini_stream(instruction: string, content: string) {
  //获取流式输出内容，失败会直接报错
  const response = await ai.models.generateContentStream({
    model: 'gemini-2.5-flash',
    contents: content,
    config: {
      systemInstruction: instruction,
      thinkingConfig: {
        thinkingBudget: 0, // 默认不思考
      },
    },
  })

  return response
}
