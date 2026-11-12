<template>
  <view class="page">
    <nav-bar title="我的发布" back />

    <view v-if="!publishStore.count" class="state">
      <text class="state__emoji">📝</text>
      <text class="state__text">还没有发布过内容</text>
      <button class="state__btn" size="mini" @tap="goPublish">去发布</button>
    </view>

    <view v-else class="list">
      <view
        v-for="item in publishStore.items"
        :key="item.id"
        class="post"
        :class="'anim'"
        hover-class="post--hover"
        @tap="onOpen(item.id)"
      >
        <view class="post__head">
          <text class="post__emoji">{{ item.emoji }}</text>
          <view class="post__meta">
            <text class="post__title">{{ item.title }}</text>
            <text class="post__time">{{ formatTime(item.createdAt) }} · {{ item.author || '我' }}</text>
          </view>
          <text class="post__del" @tap.stop="onRemove(item)">删除</text>
        </view>

        <text class="post__body">{{ item.body }}</text>

        <view v-if="item.images.length" class="post__grid">
          <image
            v-for="(img, index) in item.images"
            :key="img"
            class="post__img"
            :src="img"
            mode="aspectFill"
            @tap.stop="preview(item.images, index)"
          />
        </view>

        <view class="post__foot">
          <text class="post__comments">💬 {{ commentStore.countFor(item.id) }} 条评论</text>
          <text class="post__more">查看详情 ›</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useCommentStore } from '@/store/comments'
import { usePublishStore } from '@/store/publish'
import type { LocalPost } from '@/types/blog'

const publishStore = usePublishStore()
const commentStore = useCommentStore()

function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  const pad = (value: number): string => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function preview(urls: string[], index: number): void {
  uni.previewImage({ urls, current: index })
}

function onOpen(id: number): void {
  uni.navigateTo({ url: `/pages/localdetail/localdetail?id=${id}` })
}

function onRemove(item: LocalPost): void {
  uni.showModal({
    title: '删除',
    content: `确定删除《${item.title.slice(0, 12)}》吗？`,
    success: (res) => {
      if (res.confirm) {
        publishStore.remove(item.id)
        commentStore.clearFor(item.id)
      }
    }
  })
}

function goPublish(): void {
  uni.switchTab({ url: '/pages/publish/publish' })
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  padding: 24rpx $mb-page 60rpx;
  background: $mb-bg;
}

.state {
  padding: 180rpx 0;
  text-align: center;

  &__emoji {
    display: block;
    font-size: 96rpx;
    margin-bottom: 24rpx;
  }

  &__text {
    display: block;
    font-size: 28rpx;
    color: $mb-text-mute;
  }

  &__btn {
    margin-top: 28rpx;
  }
}

.post {
  padding: 28rpx;
  margin-bottom: 20rpx;
  background: $mb-card;
  border-radius: 20rpx;
  animation: rise 0.4s ease both;

  &--hover {
    transform: scale(0.985);
  }

  &__head {
    display: flex;
    align-items: flex-start;
  }

  &__emoji {
    margin-right: 18rpx;
    font-size: 48rpx;
    line-height: 1.2;
  }

  &__meta {
    flex: 1;
    min-width: 0;
  }

  &__title {
    display: block;
    font-size: 30rpx;
    font-weight: 600;
    color: $mb-text;
    line-height: 1.45;
  }

  &__time {
    display: block;
    margin-top: 6rpx;
    font-size: 22rpx;
    color: $mb-text-hint;
  }

  &__del {
    flex-shrink: 0;
    margin-left: 16rpx;
    font-size: 24rpx;
    color: $mb-danger;
  }

  &__body {
    display: block;
    margin-top: 18rpx;
    font-size: 27rpx;
    line-height: 1.75;
    color: $mb-text-strong;
    white-space: pre-wrap;
  }

  &__grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10rpx;
    margin-top: 18rpx;
  }

  &__img {
    width: 200rpx;
    height: 200rpx;
    border-radius: 12rpx;
  }

  &__foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20rpx;
    padding-top: 16rpx;
    border-top: 1rpx solid $mb-border;
  }

  &__comments {
    font-size: 23rpx;
    color: $mb-text-hint;
  }

  &__more {
    font-size: 24rpx;
    color: $mb-primary;
  }
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(24rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
