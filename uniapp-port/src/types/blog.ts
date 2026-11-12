/** 文章（jsonplaceholder 的 posts 资源） */
export interface Post {
  userId: number
  id: number
  title: string
  body: string
}

/** 评论（posts/{id}/comments） */
export interface Comment {
  postId: number
  id: number
  name: string
  email: string
  body: string
}

/** 收藏项：存快照而不是只存 id，收藏页不用再请求一次 */
export interface FavoriteItem {
  id: number
  title: string
  savedAt: number
}

/** 新建文章的入参 */
export interface CreatePostInput {
  title: string
  body: string
  userId: number
}

/** 发表评论的入参（jsonplaceholder 只回显 id，其余字段前端自己组装） */
export interface CreateCommentInput {
  postId: number
  name: string
  email: string
  body: string
}

/** 本地发布的文章：存在 storage 里，退出小程序也不会丢 */
export interface LocalPost {
  /** 用时间戳当 id，天然和网络文章的 1-100 区分开 */
  id: number
  title: string
  body: string
  /** 图片本地路径（小程序端已 saveFile 持久化） */
  images: string[]
  emoji: string
  author: string
  createdAt: number
}

/** 本地发布文章的评论：存在 storage 里，按 postId 归属 */
export interface LocalComment {
  /** 时间戳 id */
  id: number
  postId: number
  name: string
  body: string
  createdAt: number
}

/** 发布时可以选的心情表情 */
export const POST_EMOJIS = [
  '😀',
  '😍',
  '🤩',
  '🥳',
  '😎',
  '🤔',
  '😴',
  '🔥',
  '🎉',
  '💡',
  '📝',
  '☕'
]
