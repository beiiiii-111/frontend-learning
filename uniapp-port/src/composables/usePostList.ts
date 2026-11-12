import { computed, ref } from 'vue'
import { fetchPosts } from '@/api/blog'
import type { Post } from '@/types/blog'

/**
 * 列表分页逻辑。页面里只留渲染，加载、翻页、搜索、空态判断都在这里。
 * @param size 每页条数
 */
export function usePostList(size = 10) {
  const list = ref<Post[]>([])
  const loadedPage = ref(0)
  const loading = ref(false)
  const finished = ref(false)
  const errorMessage = ref('')
  /** 非空表示处于关键词过滤模式（一次拿全部匹配项，不分页） */
  const keyword = ref('')

  const isSearching = computed(() => keyword.value !== '')

  const isEmpty = computed(
    () => !loading.value && !errorMessage.value && list.value.length === 0
  )

  async function loadNext(): Promise<void> {
    if (loading.value || finished.value) return

    loading.value = true
    errorMessage.value = ''

    try {
      const next = loadedPage.value + 1
      const result = await fetchPosts(next, size, keyword.value)
      list.value = next === 1 ? result : list.value.concat(result)
      loadedPage.value = next
      if (isSearching.value) {
        // 搜索模式没有"下一页"
        finished.value = true
      } else {
        // jsonplaceholder 一共 100 条，返回不满一页就说明到底了
        finished.value = result.length < size
      }
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : '加载失败'
    } finally {
      loading.value = false
    }
  }

  async function refresh(): Promise<void> {
    loadedPage.value = 0
    finished.value = false
    list.value = []
    await loadNext()
  }

  /** 按关键词过滤（title_like），空串表示退出搜索、恢复分页列表 */
  async function search(text: string): Promise<void> {
    const trimmed = text.trim()
    if (trimmed === keyword.value) return
    keyword.value = trimmed
    await refresh()
  }

  return {
    list,
    loading,
    finished,
    errorMessage,
    isEmpty,
    keyword,
    isSearching,
    loadNext,
    refresh,
    search
  }
}
