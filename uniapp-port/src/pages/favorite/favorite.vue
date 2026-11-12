<template>
  <view class="page">
    <nav-bar title="我的收藏" />

    <view v-if="!favoriteStore.count" class="state">
      <text class="state__text">还没有收藏，去首页看看吧</text>
      <button class="state__btn" size="mini" @tap="goHome">回首页</button>
    </view>

    <view v-else class="list">
      <view v-for="item in favoriteStore.items" :key="item.id" class="item">
        <view class="item__main" @tap="openDetail(item.id)">
          <text class="item__title">{{ item.title }}</text>
          <text class="item__time">收藏于 {{ formatTime(item.savedAt) }}</text>
        </view>
        <text class="item__remove" @tap="favoriteStore.remove(item.id)">移除</text>
      </view>

      <button class="clear" @tap="onClear">清空收藏</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useFavoriteStore } from '@/store/favorite'

const favoriteStore = useFavoriteStore()

function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  const pad = (value: number): string => String(value).padStart(2, '0')
  return `${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function openDetail(id: number): void {
  uni.navigateTo({ url: `/pages/detail/detail?id=${id}` })
}

function goHome(): void {
  uni.switchTab({ url: '/pages/index/index' })
}

function onClear(): void {
  uni.showModal({
    title: '清空收藏',
    content: '确定要清空全部收藏吗？',
    success: (res) => {
      if (res.confirm) favoriteStore.clear()
    }
  })
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  padding: 24rpx;
  background: $mb-bg;
}

.state {
  padding: 200rpx 0;
  text-align: center;

  &__text {
    display: block;
    font-size: 28rpx;
    color: $mb-text-mute;
  }

  &__btn {
    margin-top: 28rpx;
  }
}

.item {
  display: flex;
  align-items: center;
  padding: 28rpx 24rpx;
  margin-bottom: 16rpx;
  background: $mb-card;
  border-radius: 20rpx;

  &__main {
    flex: 1;
    min-width: 0;
  }

  &__title {
    display: block;
    font-size: 29rpx;
    font-weight: 600;
    color: $mb-text;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__time {
    display: block;
    margin-top: 8rpx;
    font-size: 23rpx;
    color: $mb-text-hint;
  }

  &__remove {
    flex-shrink: 0;
    margin-left: 20rpx;
    font-size: 25rpx;
    color: $mb-danger;
  }
}

.clear {
  margin-top: 32rpx;
  font-size: 28rpx;
  color: $mb-text-sub;
  background: $mb-card;
  border-radius: 12rpx;
}
</style>
