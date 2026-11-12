<template>
  <view class="page">
    <nav-bar :title="post ? post.title : '文章详情'" back />

    <view v-if="!post" class="state">
      <text class="state__emoji">🔍</text>
      <text class="state__text">文章不存在或已被删除</text>
      <button class="state__btn" size="mini" @tap="goMyPosts">回到我的发布</button>
    </view>

    <view v-else class="content">
      <!-- 文章主体 -->
      <view class="article">
        <view class="article__top">
          <view class="article__emoji">
            <text>{{ post.emoji }}</text>
          </view>
          <view class="article__head">
            <text class="article__title">{{ post.title }}</text>
            <text class="article__meta">
              {{ post.author || '我' }} · {{ formatTime(post.createdAt) }}
            </text>
          </view>
        </view>

        <text class="article__body">{{ post.body }}</text>

        <view v-if="post.images.length" class="article__grid">
          <image
            v-for="(img, index) in post.images"
            :key="img"
            class="article__img"
            :src="img"
            mode="aspectFill"
            @tap="preview(post.images, index)"
          />
        </view>
      </view>

      <!-- 评论 -->
      <view class="comments">
        <view class="comments__head">
          <text class="comments__title">评论</text>
          <text class="comments__count">{{ comments.length }} 条</text>
        </view>

        <view v-for="comment in comments" :key="comment.id" class="comment">
          <view class="comment__avatar">
            <text class="comment__avatar-text">{{ avatarOf(comment.name) }}</text>
          </view>
          <view class="comment__main">
            <view class="comment__row">
              <text class="comment__name">{{ comment.name }}</text>
              <text class="comment__time">{{ formatTime(comment.createdAt) }}</text>
              <text class="comment__del" @tap="onRemove(comment.id)">删除</text>
            </view>
            <text class="comment__body">{{ comment.body }}</text>
          </view>
        </view>

        <text v-if="!comments.length" class="comments__empty">
          还没有人评论，来说两句吧～
        </text>

        <!-- 发表评论 -->
        <view class="composer">
          <textarea
            v-model="commentText"
            class="composer__input"
            :placeholder="composerPlaceholder"
            :maxlength="200"
          />
          <view class="composer__foot">
            <text class="composer__count">{{ commentText.length }}/200</text>
            <button
              class="composer__btn"
              size="mini"
              :disabled="!commentText.trim()"
              @tap="submitComment"
            >
              发表评论
            </button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useCommentStore } from '@/store/comments'
import { usePublishStore } from '@/store/publish'
import { useUserStore } from '@/store/user'
import { checkSensitive, sensitiveTip } from '@/utils/sensitive'
import type { LocalPost } from '@/types/blog'

const publishStore = usePublishStore()
const commentStore = useCommentStore()
const userStore = useUserStore()

const postId = ref(0)
const post = ref<LocalPost | null>(null)
const commentText = ref('')

const comments = computed(() =>
  post.value ? commentStore.listFor(post.value.id) : []
)

const composerPlaceholder = computed(() => `以 ${userStore.profile.nickname} 的身份评论…`)

function avatarOf(name: string): string {
  return name.trim().slice(0, 1) || '我'
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  const pad = (value: number): string => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function preview(urls: string[], index: number): void {
  uni.previewImage({ urls, current: index })
}

function submitComment(): void {
  const body = commentText.value.trim()
  if (!body || !post.value) return

  // 评论也过一遍违禁词
  const hits = checkSensitive(body)
  if (hits.length) {
    uni.showModal({
      title: '无法发表',
      content: sensitiveTip(hits),
      showCancel: false
    })
    return
  }

  commentStore.add({
    postId: post.value.id,
    name: userStore.profile.nickname,
    body
  })
  commentText.value = ''
  uni.showToast({ title: '评论已发表', icon: 'success' })
}

function onRemove(id: number): void {
  uni.showModal({
    title: '删除评论',
    content: '确定删除这条评论吗？',
    success: (res) => {
      if (res.confirm) commentStore.remove(id)
    }
  })
}

function goMyPosts(): void {
  uni.navigateTo({ url: '/pages/myposts/myposts' })
}

onLoad((options) => {
  postId.value = Number(options?.id ?? 0)
  post.value = publishStore.items.find((item) => item.id === postId.value) ?? null
})
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  padding-bottom: 40rpx;
  background: $mb-bg;
}

.state {
  padding: 200rpx 0;
  text-align: center;

  &__emoji {
    display: block;
    font-size: 96rpx;
    margin-bottom: 20rpx;
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

.article {
  padding: 32rpx;
  background: $mb-card;

  &__top {
    display: flex;
    align-items: flex-start;
  }

  &__emoji {
    flex-shrink: 0;
    width: 84rpx;
    height: 84rpx;
    margin-right: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 44rpx;
    background: $mb-bg;
    border-radius: 20rpx;
  }

  &__head {
    flex: 1;
    min-width: 0;
  }

  &__title {
    display: block;
    font-size: 38rpx;
    font-weight: 700;
    line-height: 1.45;
    color: $mb-text;
  }

  &__meta {
    display: block;
    margin-top: 10rpx;
    font-size: 23rpx;
    color: $mb-text-mute;
  }

  &__body {
    display: block;
    margin-top: 24rpx;
    font-size: 30rpx;
    line-height: 1.8;
    color: $mb-text-strong;
    white-space: pre-wrap;
  }

  &__grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10rpx;
    margin-top: 24rpx;
  }

  &__img {
    width: 200rpx;
    height: 200rpx;
    border-radius: 12rpx;
  }
}

.comments {
  margin-top: 20rpx;
  padding: 32rpx;
  background: $mb-card;

  &__head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 8rpx;
  }

  &__title {
    font-size: 32rpx;
    font-weight: 600;
    color: $mb-text;
  }

  &__count {
    font-size: 24rpx;
    color: $mb-text-mute;
  }

  &__empty {
    display: block;
    padding: 40rpx 0;
    text-align: center;
    font-size: 26rpx;
    color: $mb-text-hint;
  }
}

.comment {
  display: flex;
  padding: 24rpx 0;
  border-bottom: 1rpx solid $mb-border;

  &__avatar {
    flex-shrink: 0;
    width: 64rpx;
    height: 64rpx;
    margin-right: 18rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #2563eb, #7c3aed);
    border-radius: 50%;
  }

  &__avatar-text {
    font-size: 28rpx;
    font-weight: 600;
    color: #ffffff;
  }

  &__main {
    flex: 1;
    min-width: 0;
  }

  &__row {
    display: flex;
    align-items: baseline;
  }

  &__name {
    font-size: 27rpx;
    font-weight: 600;
    color: $mb-text-strong;
  }

  &__time {
    flex: 1;
    margin-left: 14rpx;
    font-size: 22rpx;
    color: $mb-text-hint;
  }

  &__del {
    font-size: 22rpx;
    color: $mb-danger;
  }

  &__body {
    display: block;
    margin-top: 8rpx;
    font-size: 27rpx;
    line-height: 1.7;
    color: $mb-text-sub;
    white-space: pre-wrap;
  }
}

.composer {
  margin-top: 24rpx;
  padding: 24rpx;
  background: $mb-bg;
  border-radius: 16rpx;

  &__input {
    box-sizing: border-box;
    width: 100%;
    height: 140rpx;
    padding: 20rpx;
    font-size: 27rpx;
    background: $mb-card;
    border-radius: 12rpx;
  }

  &__foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 16rpx;
  }

  &__count {
    font-size: 22rpx;
    color: $mb-text-hint;
  }

  &__btn {
    font-size: 26rpx;
    color: #ffffff;
    background: $mb-primary;
    border-radius: 999rpx;

    &[disabled] {
      color: rgba(255, 255, 255, 0.6);
      background: rgba(37, 99, 235, 0.4);
    }
  }
}
</style>
