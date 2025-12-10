import Link from 'next/link'
import { auth } from '../../../auth'
import { CoreIcon } from '@/components/icons'

// 中控台主页面
export default async function ControlPage() {
  // const session = await auth()
  //测试session
  const session = {
    user: {
      id: 'user-001',
      role: 'admin',
      email: 'test001@gmail.com',
      name: 'Test User',
      image:
        'https://lh3.googleusercontent.com/a/ACg8ocLG8Jk5Btg0SHI-NABEJwdhhfRKj2wRzaZTXODhMEQdlYa-smg=s96-c',
    },
    expires: '2026-012-12T10:15:30.123Z',
  }

  if (!session || !session.user || session.user.role !== 'admin') {
    return (
      <div className="flex w-full justify-center">
        <h2 className="mt-32 text-2xl font-medium">无权限访问此页面</h2>
      </div>
    )
  }

  return (
    <main className="container-main">
      <h1 className="mt-22 text-3xl font-bold tracking-widest">中控台</h1>
      <div
        className="mt-12 grid w-[45rem] max-w-4/5 grid-cols-2
      justify-items-center gap-8 max-md:max-w-9/10 max-md:grid-cols-1"
      >
        <ControlItem />
      </div>
    </main>
  )
}

// 控制台项目组件
function ControlItem() {
  return (
    <Link
      href="/control/articles"
      className="border-border-solid group border-on-surface relative flex
    w-50 items-center justify-center overflow-hidden rounded-xs border-2 
    p-6 transition-all duration-300 hover:shadow-xl"
    >
      <p className="text-[22px] font-semibold">文章操作</p>
      <div
        className="absolute inset-1/2 h-36 w-36 -translate-1/2 opacity-0
      transition-all duration-300 group-hover:opacity-20"
      >
        <CoreIcon />
      </div>
    </Link>
  )
}
