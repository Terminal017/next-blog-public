import { ObjectId } from 'mongodb'

//数据库中评论数据类型
export interface CommentType {
  _id: ObjectId
  comment: string
  datetime: Date
  user: { name: string; image: string }
  //state语言：1表示active, 0表示deleted
  state: number
  own_check: boolean //表示是否为作者
  parentID: string
  rootID: string
  like: number
  liked: boolean
}

//用户传入评论数据类型
export interface CommentData {
  slug: string
  comment: string
  parentID: string
  rootID: string
}

//用户传入点赞数据类型
export interface LikeData {
  comment_id: string
  liked: boolean
}
