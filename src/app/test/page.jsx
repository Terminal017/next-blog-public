import { auth } from '../../../auth'

export default async function UserAvatar() {
  const session = await auth()

  if (!session?.user) return null

  console.log('User session:', session)

  return (
    <div>
      <img src={session.user.image} alt="User Avatar" />
    </div>
  )
}
