import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import client from '@/features/db'
import getDB from '@/features/mongodb'
import { uploadImageToR2 } from '@/features/server/r2'
import crypto from 'crypto'

import type { User } from '@auth/core/types'
import { ObjectId } from 'mongodb'

//将数据写入user_profile集合
async function add_user_image(user: User) {
  //如果它是空的说明SignIn被取消了，让它报错停止登录
  if (!user) {
    return false
  }

  try {
    const res = await fetch(user.image as string)
    const arrayBuffer = await res.arrayBuffer()

    const buffer = Buffer.from(arrayBuffer)

    // 用哈希简单加密图片路径（加密不可逆）
    const fileName = crypto
      .createHash('sha256')
      .update(user.id as string)
      .digest('hex')
      .slice(0, 16)

    // 上传至R2
    const storpath = await uploadImageToR2(buffer, fileName)

    //上传用户信息到数据库
    const client = await getDB()
    const collection = client.collection('user_profile')
    const updateDoc = {
      $set: {
        user_id: user.id,
        name: user.name,
        email: user.email,
        image: storpath, //R2存储地址
      },
    }
    //更新用户信息，如果不存在则插入新文档
    await collection.updateOne({ _id: new ObjectId(user.id) }, updateDoc, {
      upsert: true,
    })

    return true
  } catch (err) {
    //发生错误阻止登录
    return false
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(client),
  providers: [Google],
  //回调函数，定义在登录后调用的内容
  callbacks: {
    //登录后将用户基本信息拷贝进新的数据库，上传图片到存储桶
    async signIn({ user }) {
      return await add_user_image(user)
    },
  },
})
