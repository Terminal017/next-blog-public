//这里存放所有/app路由里面用到的类型，重复类型来源基本都在app路由中

// 文章列表类型
export interface ArticleListType {
  slug: string
  title: string
  img: string
  createAt: string
  updateAt: string
  desc: string
  tags: string[]
}

//浏览器端的评论数据类型
export interface CommentType {
  _id: string
  tem_id?: string //临时ID用于乐观更新
  comment: string
  datetime: string
  user: { name: string; image: string }
  own_check: boolean
  parentID: string
  rootID: string
  like: number
  liked: boolean
  children?: CommentType[]
}

//提交评论返回数据类型
export interface PostResType {
  message: string
  success: boolean
  comment_id?: string
}

// 文章目录类型（用于处理标题）
export interface HeadingType {
  text: string
  id: string
}

// 友链数据类型
export interface friendlinkType {
  title: string
  site: string
  avatar: string
  description: string
  email: string
  datetime: Date
}

// 管理页面文章信息类型
export interface ArticleInfType {
  slug: string
  title: string
  createAt: string
  updateAt: string
}

export interface ArticleFormType {
  slug: string
  title: string
  img: string
  desc: string
  tags: string[]
  content: string
}
