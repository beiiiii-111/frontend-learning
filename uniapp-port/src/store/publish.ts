import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { LocalPost } from '@/types/blog'

const STORAGE_KEY = 'mini-blog:published'
const EDITING_KEY = 'mini-blog:editing'
const DRAFTS_KEY = 'mini-blog:drafts'

/** 草稿 / 编辑中内容共用的结构 */
export interface DraftItem {
  id: number
  mood: string
  title: string
  body: string
  images: string[]
  savedAt: number
}

export const usePublishStore = defineStore('publish', () => {
  const items = ref<LocalPost[]>(readCache())
  const count = computed(() => items.value.length)
  /** 首页只展示最新 3 条 */
  const latest = computed(() => items.value.slice(0, 3))

  /** 编辑中内容（中途退出选"保存"后停留在这里，重进发布页自动恢复） */
  const editing = ref<DraftItem | null>(readJson(EDITING_KEY))
  /** 草稿箱（注意：没缓存时 getStorageSync 返回 ''，必须兜底成空数组） */
  const drafts = ref<DraftItem[]>(readJson(DRAFTS_KEY) ?? [])

  function readJson<T>(key: string): T {
    return (uni.getStorageSync(key) || null) as T
  }

  function readCache(): LocalPost[] {
    const cache = uni.getStorageSync(STORAGE_KEY) as LocalPost[] | ''
    if (!Array.isArray(cache)) return []
    // 老缓存可能缺 images / emoji 字段，补默认值避免渲染报错
    return cache.map((item) => ({
      ...item,
      images: Array.isArray(item.images) ? item.images : [],
      emoji: item.emoji || '📝'
    }))
  }

  /** 新增一条，返回存下来的完整对象 */
  function add(input: {
    title: string
    body: string
    images: string[]
    emoji: string
    author: string
  }): LocalPost {
    const post: LocalPost = {
      id: Date.now(),
      title: input.title,
      body: input.body,
      images: input.images,
      emoji: input.emoji,
      author: input.author,
      createdAt: Date.now()
    }
    items.value.unshift(post)
    return post
  }

  function remove(id: number): void {
    const index = items.value.findIndex((item) => item.id === id)
    if (index >= 0) items.value.splice(index, 1)
  }

  function clear(): void {
    items.value = []
  }

  /** 保存 / 更新编辑中内容 */
  function saveEditing(input: Omit<DraftItem, 'id' | 'savedAt'>): void {
    if (editing.value) {
      editing.value = { ...editing.value, ...input, savedAt: Date.now() }
    } else {
      editing.value = { ...input, id: Date.now(), savedAt: Date.now() }
    }
  }

  function clearEditing(): void {
    editing.value = null
  }

  /** 当前编辑存入草稿箱（同一条编辑重复入箱只更新） */
  function saveDraft(input: Omit<DraftItem, 'id' | 'savedAt'>): DraftItem {
    let draft: DraftItem
    if (editing.value) {
      draft = { ...editing.value, ...input, savedAt: Date.now() }
      const index = drafts.value.findIndex((d) => d.id === draft.id)
      if (index >= 0) drafts.value.splice(index, 1)
    } else {
      draft = { ...input, id: Date.now(), savedAt: Date.now() }
    }
    drafts.value.unshift(draft)
    return draft
  }

  function removeDraft(id: number): void {
    const index = drafts.value.findIndex((d) => d.id === id)
    if (index >= 0) drafts.value.splice(index, 1)
  }

  /** 草稿取出继续编辑：进入 editing，并从草稿箱移除 */
  function draftToEditing(id: number): DraftItem | null {
    const index = drafts.value.findIndex((d) => d.id === id)
    if (index < 0) return null
    const [draft] = drafts.value.splice(index, 1)
    editing.value = draft
    return draft
  }

  // 每次改动都写一次 storage，小程序被回收也不会丢
  watch(
    items,
    (value) => {
      uni.setStorageSync(STORAGE_KEY, value)
    },
    { deep: true }
  )
  watch(
    editing,
    (value) => {
      if (value === null) uni.removeStorageSync(EDITING_KEY)
      else uni.setStorageSync(EDITING_KEY, value)
    },
    { deep: true }
  )
  watch(
    drafts,
    (value) => {
      uni.setStorageSync(DRAFTS_KEY, value)
    },
    { deep: true }
  )

  return {
    items,
    count,
    latest,
    editing,
    drafts,
    add,
    remove,
    clear,
    saveEditing,
    clearEditing,
    saveDraft,
    removeDraft,
    draftToEditing
  }
})
