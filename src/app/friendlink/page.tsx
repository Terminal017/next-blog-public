import FriendLinkList from '@/ui/friendlink_list'
import getDB from '@/lib/mongodb'

interface friendlinkType {
  title: string
  site: string
  avatar: string
  description: string
  email: string
  datetime: Date
}

export default async function Friendlink() {
  const database = await getDB()
  const friendlink_find = database
    .collection('friendlinks')
    .find()
    .sort({ datetime: 1 })
    .project({ _id: 0 })

  const friendlink_data = (await friendlink_find.toArray().catch(() => {
    return []
  })) as friendlinkType[]

  return (
    <>
      <FriendLinkList friendlink_data={friendlink_data} />
    </>
  )
}
