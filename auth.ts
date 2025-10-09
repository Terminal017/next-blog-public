import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  events: {
    async signIn(message) {
      console.log('用户开始登录:', message)
    },
    async createUser(message) {
      console.log('创建新用户:', message)
    },
    async updateUser(message) {
      console.log('更新用户信息:', message)
    },
    async linkAccount(message) {
      console.log('关联账户:', message)
    },
    async session(message) {
      console.log('会话创建/更新:', message)
    },
  },
})
