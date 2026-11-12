/** 用户基础信息，落本地缓存，供首页问候语、评论署名、个人页共用 */
export interface UserProfile {
  /** 昵称 */
  nickname: string
  /** 邮箱，发表评论时用 */
  email: string
  /** 一句话简介 */
  bio: string
  /** 头像图片本地路径（uni.chooseImage 的临时路径，可为空） */
  avatarUrl: string
  /** 备用 emoji 头像，没有图片时显示 */
  avatarEmoji: string
}

export const DEFAULT_PROFILE: UserProfile = {
  nickname: '旅人',
  email: '',
  bio: '这个人很懒，什么都没写',
  avatarUrl: '',
  avatarEmoji: '🐱'
}

/** 个人页可选的 emoji 头像 */
export const AVATAR_EMOJIS = ['🐱', '🦊', '🐼', '🐨', '🦁', '🐸', '🐵', '🦉']
