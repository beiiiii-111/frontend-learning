import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { DEFAULT_PROFILE, type UserProfile } from '@/types/user'

const STORAGE_KEY = 'mini-blog:profile'

export const useUserStore = defineStore('user', () => {
  const profile = ref<UserProfile>(readCache())

  function readCache(): UserProfile {
    const cache = uni.getStorageSync(STORAGE_KEY) as UserProfile | ''
    if (!cache || typeof cache !== 'object') return { ...DEFAULT_PROFILE }
    // 兜底合并，防止老缓存缺新字段
    return { ...DEFAULT_PROFILE, ...cache }
  }

  function update(patch: Partial<UserProfile>): void {
    profile.value = { ...profile.value, ...patch }
  }

  function reset(): void {
    profile.value = { ...DEFAULT_PROFILE }
  }

  watch(
    profile,
    (value) => {
      uni.setStorageSync(STORAGE_KEY, value)
    },
    { deep: true }
  )

  return { profile, update, reset }
})
