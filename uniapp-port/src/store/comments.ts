import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { LocalComment } from '@/types/blog'

const STORAGE_KEY = 'mini-blog:comments'

/**
 * 本地发布文章的评论仓库。
 * 网络文章（jsonplaceholder）的评论走接口，这里只管「我的发布」那部分。
 */
export const useCommentStore = defineStore('comment', () => {
  const items = ref<LocalComment[]>(readCache())

  function readCache(): LocalComment[] {
    const cache = uni.getStorageSync(STORAGE_KEY) as LocalComment[] | ''
    if (!Array.isArray(cache)) return []
    return cache
  }

  /** 某篇文章的评论，按时间倒序（最新的在前） */
  function listFor(postId: number): LocalComment[] {
    return items.value.filter((item) => item.postId === postId).reverse()
  }

  function countFor(postId: number): number {
    return items.value.filter((item) => item.postId === postId).length
  }

  function add(input: { postId: number; name: string; body: string }): LocalComment {
    const comment: LocalComment = {
      id: Date.now(),
      postId: input.postId,
      name: input.name,
      body: input.body,
      createdAt: Date.now()
    }
    items.value.push(comment)
    return comment
  }

  function remove(id: number): void {
    const index = items.value.findIndex((item) => item.id === id)
    if (index >= 0) items.value.splice(index, 1)
  }

  /** 删除文章时连带清掉它的评论 */
  function clearFor(postId: number): void {
    items.value = items.value.filter((item) => item.postId !== postId)
  }

  watch(
    items,
    (value) => {
      uni.setStorageSync(STORAGE_KEY, value)
    },
    { deep: true }
  )

  return { items, listFor, countFor, add, remove, clearFor }
})
