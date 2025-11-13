import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

//S3 API登录，可以参考Cloud Flare S3的js文档
const client = new S3Client({
  region: 'auto',
  endpoint: process.env.AWS_ENDPOINT_URL,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

//上传图片到S2
export async function uploadImageToR2(fileBuffer: Buffer, fileName: string) {
  const command = new PutObjectCommand({
    Bucket: 'image-list',
    Key: `user_img/${fileName}`,
    Body: fileBuffer,
    ContentType: 'image/png',
  })

  await client.send(command)

  const storpath = `https://img.startrails.site/user_img/${fileName}`
  return storpath
}
