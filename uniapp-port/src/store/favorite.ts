import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { FavoriteItem, Post } from '@/types/blog'

const STORAGE_KEY = 'mini-blog:favorites'

export const useFavoriteStore = defineStore('favorite', () => {
  const items = ref<FavoriteItem[]>(readCache())
  const count = computed(() => items.value.length)
  const ids = computed(() => items.value.map((item) => item.id))

  function readCache(): FavoriteItem[] {
    const cache = uni.getStorageSync(STORAGE_KEY) as FavoriteItem[] | ''
    return Array.isArray(cache) ? cache : []
  }

  function isFavorite(id: number): boolean {
    return items.value.some((item) => item.id === id)
  }

  /** 切换收藏，返回切换后的状态：true 表示已收藏 */
  function toggle(post: Post): boolean {
    const index = items.value.findIndex((item) => item.id === post.id)
    if (index >= 0) {
      items.value.splice(index, 1)
      return false
    }
    items.value.unshift({ id: post.id, title: post.title, savedAt: Date.now() })
    return true
  }

  function remove(id: number): void {
    const index = items.value.findIndex((item) => item.id === id)
    if (index >= 0) items.value.splice(index, 1)
  }

  function clear(): void {
    items.value = []
  }

  // 任何改动都落一次本地缓存，小程序被回收也不会丢
  watch(
    items,
    (value) => {
      uni.setStorageSync(STORAGE_KEY, value)
    },
    { deep: true }
  )

  return { items, count, ids, isFavorite, toggle, remove, clear }
})
