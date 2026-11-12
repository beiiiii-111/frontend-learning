import { http } from '@/utils/request'
import type { Comment, CreateCommentInput, CreatePostInput, Post } from '@/types/blog'

/**
 * 分页取文章。jsonplaceholder 用 _page / _limit。
 * 传 keyword 时走 title_like 模糊过滤，此时忽略分页参数，一次拿全部匹配项。
 */
export function fetchPosts(
  page: number,
  size: number,
  keyword = ''
): Promise<Post[]> {
  if (keyword) {
    return http.get<Post[]>('/posts', { title_like: keyword })
  }
  return http.get<Post[]>('/posts', { _page: page, _limit: size })
}

export function fetchPostDetail(id: number): Promise<Post> {
  return http.get<Post>(`/posts/${id}`)
}

export function fetchPostComments(id: number): Promise<Comment[]> {
  return http.get<Comment[]>(`/posts/${id}/comments`)
}

/** 演示写请求：jsonplaceholder 返回 201 和带 id 的对象，不会真的落库 */
export function createPost(input: CreatePostInput): Promise<Post> {
  return http.post<Post>('/posts', input)
}

/**
 * 发表评论：POST /posts/{id}/comments，返回 201 + { id }。
 * jsonplaceholder 不落库，新评论由前端拼完整对象插到列表最前面。
 */
export function createComment(input: CreateCommentInput): Promise<{ id: number }> {
  return http.post<{ id: number }>(`/posts/${input.postId}/comments`, input)
}

interface DogImageResponse {
  message: string
  status: string
}

/** 第三方接口，走绝对地址。失败不弹 toast，由调用方兜底 */
export function fetchRandomCover(): Promise<string> {
  return http
    .get<DogImageResponse>('https://dog.ceo/api/breeds/image/random', undefined, {
      showError: false
    })
    .then((res) => res.message)
}
