<template>
  <view class="page">
    <nav-bar title="草稿箱" back />

    <view v-if="drafts.length === 0" class="empty">
      <text class="empty__icon">🗂️</text>
      <text class="empty__text">草稿箱是空的</text>
      <text class="empty__hint">编辑到一半的内容可以暂存在这里</text>
    </view>

    <view v-else class="list">
      <view v-for="draft in drafts" :key="draft.id" class="card">
        <view class="card__head">
          <text class="card__mood">{{ draft.mood }}</text>
          <text class="card__title">{{ draft.title || '（无标题）' }}</text>
          <text class="card__time">{{ formatTime(draft.savedAt) }}</text>
        </view>
        <text class="card__body">{{ draft.body || '（无正文）' }}</text>
        <view v-if="draft.images.length" class="card__imgs">
          <image
            v-for="img in draft.images.slice(0, 3)"
            :key="img"
            class="card__img"
            :src="img"
            mode="aspectFill"
          />
          <text v-if="draft.images.length > 3" class="card__more">+{{ draft.images.length - 3 }}</text>
        </view>
        <view class="card__actions">
          <text class="card__btn card__btn--primary" hover-class="card__btn--hover" @tap="onEdit(draft.id)">继续编辑</text>
          <text class="card__btn card__btn--publish" hover-class="card__btn--hover" @tap="onPublish(draft.id)">发布</text>
          <text class="card__btn card__btn--danger" hover-class="card__btn--hover" @tap="onDelete(draft.id)">删除</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePublishStore } from '@/store/publish'
import { useUserStore } from '@/store/user'
import { checkSensitive, sensitiveTip } from '@/utils/sensitive'

const publishStore = usePublishStore()
const userStore = useUserStore()
const drafts = computed(() => publishStore.drafts)

function formatTime(ts: number): string {
  const d = new Date(ts)
  const pad = (n: number): string => String(n).padStart(2, '0')
  return `${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** 取出草稿继续编辑 */
function onEdit(id: number): void {
  const draft = publishStore.draftToEditing(id)
  if (!draft) return
  uni.navigateBack()
}

/** 直接发布草稿 */
function onPublish(id: number): void {
  const draft = publishStore.drafts.find((d) => d.id === id)
  if (!draft) return
  if (!draft.title.trim() || !draft.body.trim()) {
    uni.showToast({ title: '标题和正文不能为空，请继续编辑', icon: 'none' })
    return
  }
  // 草稿发布同样要过违禁词检测
  const hits = checkSensitive(`${draft.title} ${draft.body}`)
  if (hits.length > 0) {
    uni.showModal({
      title: '无法发布',
      content: sensitiveTip(hits),
      confirmText: '继续编辑',
      cancelText: '知道了',
      success: (res) => {
        if (res.confirm) onEdit(draft.id)
      }
    })
    return
  }
  publishStore.add({
    title: draft.title.trim(),
    body: draft.body.trim(),
    images: [...draft.images],
    emoji: draft.mood,
    author: userStore.profile.nickname
  })
  publishStore.removeDraft(id)
  // 编辑器里还挂着同一条草稿的话一并清掉
  if (publishStore.editing?.id === id) publishStore.clearEditing()
  uni.$emit('draft-published', id)
  uni.showToast({ title: '发布成功', icon: 'success' })
  setTimeout(() => {
    uni.navigateBack()
  }, 600)
}

function onDelete(id: number): void {
  uni.showModal({
    title: '删除草稿',
    content: '删除后无法恢复，确定删除吗？',
    confirmText: '删除',
    confirmColor: '#ef4444',
    success: (res) => {
      if (res.confirm) publishStore.removeDraft(id)
    }
  })
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  padding-bottom: 60rpx;
  background: $mb-bg;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 200rpx;

  &__icon {
    font-size: 100rpx;
  }

  &__text {
    margin-top: 24rpx;
    font-size: 30rpx;
    font-weight: 600;
    color: $mb-text;
  }

  &__hint {
    margin-top: 12rpx;
    font-size: 24rpx;
    color: $mb-text-hint;
  }
}

.list {
  padding: 24rpx;
}

.card {
  margin-bottom: 24rpx;
  padding: 24rpx 28rpx;
  background: $mb-card;
  border-radius: 20rpx;
  box-shadow: 0 6rpx 20rpx rgba(17, 24, 39, 0.05);

  &__head {
    display: flex;
    align-items: center;
    gap: 12rpx;
  }

  &__mood {
    font-size: 34rpx;
  }

  &__title {
    flex: 1;
    font-size: 29rpx;
    font-weight: 600;
    color: $mb-text;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__time {
    flex-shrink: 0;
    font-size: 22rpx;
    color: $mb-text-hint;
  }

  &__body {
    display: -webkit-box;
    margin-top: 12rpx;
    font-size: 25rpx;
    line-height: 1.6;
    color: $mb-text-sub;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  &__imgs {
    display: flex;
    align-items: center;
    gap: 10rpx;
    margin-top: 14rpx;
  }

  &__img {
    width: 120rpx;
    height: 120rpx;
    border-radius: 10rpx;
  }

  &__more {
    font-size: 24rpx;
    color: $mb-text-hint;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 16rpx;
    margin-top: 20rpx;
  }

  &__btn {
    padding: 8rpx 28rpx;
    font-size: 24rpx;
    border-radius: 999rpx;
    transition: transform 0.15s ease;

    &--hover {
      transform: scale(0.94);
    }

    &--primary {
      color: $mb-primary;
      background: $mb-primary-soft;
    }

    &--publish {
      color: #ffffff;
      background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
    }

    &--danger {
      color: $mb-danger;
      background: rgba(239, 68, 68, 0.1);
    }
  }
}
</style>
