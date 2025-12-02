import FriendLinkList from '@/app/friendlink/friendlink_list'
import getDB from '@/features/mongodb'
import { unstable_cacheLife } from 'next/cache'

import type { friendlinkType } from '@/types/index'

export default async function Friendlink() {
  //缓存整个组件，它只会在缓存过期后更新
  'use cache'
  unstable_cacheLife({
    stale: 600, // 标记过期：10分钟
    revalidate: 3600, // 重新验证：1小时
    expire: 86400, // 已过期：1天
  })

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
