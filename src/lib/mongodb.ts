import { MongoClient, Db } from 'mongodb'

const uri = process.env.MONGODB_URI as string

if (!uri) {
  throw new Error('MONGODB_URI错误')
}

// 使用 Symbol.for 在全局符号表中注册键，减少与其他库命名冲突
const MONGO_GLOBAL_KEY = Symbol.for('next.mongo.client')

type Cache = {
  client: MongoClient | null
  promise: Promise<{ client: MongoClient; db: Db }> | null
}

const globalRef = globalThis as any

function getCache(): Cache {
  // 优先使用 Symbol.for 存储
  if (!globalRef[MONGO_GLOBAL_KEY]) {
    globalRef[MONGO_GLOBAL_KEY] = { client: null, promise: null } as Cache
  }

  return globalRef[MONGO_GLOBAL_KEY] as Cache
}

export async function connectToDatabase(
  dbName: string = 'star_database',
): Promise<{ client: MongoClient; db: Db }> {
  const cache = getCache()

  if (cache.client) {
    console.log('使用缓存的MongoDB客户端')
    return { client: cache.client, db: cache.client.db(dbName) }
  }

  if (!cache.promise) {
    console.log('创建新的MongoDB客户端连接')
    const options = {}
    const client = new MongoClient(uri, options)
    cache.promise = client.connect().then((connectedClient) => {
      cache.client = connectedClient
      return { client: connectedClient, db: connectedClient.db(dbName) }
    })
  }

  return cache.promise
}

//连接数据库
export default async function getDB(dbName?: string): Promise<Db> {
  const { db } = await connectToDatabase(dbName)
  return db
}
