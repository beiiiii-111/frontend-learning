<template>
  <view class="card" @tap="emit('open', post.id)">
    <view class="card__idx">
      <text class="card__idx-text">{{ String(index + 1).padStart(2, '0') }}</text>
    </view>

    <view class="card__main">
      <text class="card__title">{{ post.title }}</text>
      <text class="card__body">{{ post.body }}</text>
    </view>

    <text
      class="card__star"
      :class="{ 'card__star--on': favorite }"
      @tap.stop="emit('toggle-favorite', post)"
    >
      {{ favorite ? '★' : '☆' }}
    </text>
  </view>
</template>

<script setup lang="ts">
import type { Post } from '@/types/blog'

interface Props {
  post: Post
  index?: number
  favorite?: boolean
}

withDefaults(defineProps<Props>(), {
  index: 0,
  favorite: false
})

const emit = defineEmits<{
  (event: 'open', id: number): void
  (event: 'toggle-favorite', post: Post): void
}>()
</script>

<style lang="scss" scoped>
.card {
  display: flex;
  align-items: flex-start;
  padding: 28rpx 24rpx;
  margin-bottom: 16rpx;
  background: $mb-card;
  border-radius: $mb-radius-card;

  &__idx {
    width: 64rpx;
    flex-shrink: 0;
  }

  &__idx-text {
    font-size: 26rpx;
    color: $mb-text-faint;
    font-family: 'SF Mono', Menlo, monospace;
  }

  &__main {
    flex: 1;
    min-width: 0;
  }

  &__title {
    display: block;
    font-size: 30rpx;
    font-weight: 600;
    color: $mb-text;
    line-height: 1.45;
    margin-bottom: 8rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  &__body {
    display: block;
    font-size: 26rpx;
    color: $mb-text-sub;
    line-height: 1.6;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  &__star {
    width: 60rpx;
    flex-shrink: 0;
    text-align: right;
    font-size: 36rpx;
    color: $mb-text-faint;

    &--on {
      color: $mb-star;
    }
  }
}
</style>
