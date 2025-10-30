import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import client from '@/lib/db'
import getDB from '@/lib/mongodb'

import type { User } from '@auth/core/types'
import { ObjectId } from 'mongodb'

//将数据写入user_profile集合
async function add_user_image(user: User) {
  const client = await getDB()
  const collection = client.collection('user_profile')
  const updateDoc = {
    $set: { name: user.name, email: user.email, image_back: user.image },
  }
  const result = await collection.updateOne(
    { _id: new ObjectId(user.id) },
    updateDoc,
    { upsert: true },
  )
  console.log('数据库已写入：', result)
}
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(client),
  providers: [Google],
  //回调函数，定义在登陆后调用的内容
  callbacks: {
    //登陆后将用户基本信息拷贝进新的数据库，上传图片到存储桶
    async signIn({ user }) {
      console.log('登陆信息输入', user)
      add_user_image(user)
      return true
    },
  },
})
