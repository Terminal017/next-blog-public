'use server'
import getDB from '@/lib/mongodb'

export async function add_new_friend(_: any, newfriend_data: FormData) {
  const check_data = ['name', 'site', 'avatar', 'description', 'email']
  const data = Object.fromEntries(newfriend_data.entries())

  for (let i of Object.keys(data)) {
    if (!check_data.includes(i)) {
      return { ok: true, message: '数据被修改' }
    }
  }

  try {
    const database = await getDB()
    const collection = database.collection('friendlinks_check')
    const result = await collection.insertOne({ ...data, datetime: new Date() })
    console.log('结果：', result)
    return { ok: true, message: '友链信息已发送！' }
  } catch {
    return { ok: true, message: '友链信息发送失败，请重试' }
  }
}
