import { MongoClient } from 'mongodb'

const uri = 'mongodb://127.0.0.1:27017'
const dbName = 'star_database'
const collectionName = 'users'

const doc = {
  _id: 'user-001',
  name: 'Admin',
  email: 'test001@gmail.com',
  image:
    'https://lh3.googleusercontent.com/a/ACg8ocLG8Jk5Btg0SHI-NABEJwdhhfRKj2wRzaZTXODhMEQdlYa-smg=s96-',
  emailVerified: null,
  role: 'admin',
}

async function main() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    const db = client.db(dbName)
    const collection = db.collection(collectionName)

    const result = await collection.insertOne(doc)
    console.log('插入成功:', result.insertedId)
  } catch (err) {
    console.error('插入失败:', err)
  } finally {
    await client.close()
  }
}

main()
