import FriendLinkList from '@/app/friendlink/friendlink_list'
import getDB from '@/features/mongodb'

import type { friendlinkType } from '@/types/index'

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
