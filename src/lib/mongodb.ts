import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI as string
if (!uri) throw new Error('MONGODB_URI错误')

const options = {}
let client: MongoClient
let clientPromise: Promise<MongoClient>

// 为了防止开发环境热重载时多次连接数据库，使用全局缓存 client
if (process.env.NODE_ENV === 'development') {
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options)
    ;(global as any)._mongoClientPromise = client.connect()
  }
  clientPromise = (global as any)._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export async function getDB(dbName = 'star_database') {
  const client = await clientPromise
  return client.db(dbName)
}
