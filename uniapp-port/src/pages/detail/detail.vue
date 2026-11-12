<template>
  <view class="page">
    <nav-bar :title="post ? post.title : '文章详情'" back />

    <view v-if="loading" class="state">
      <text class="state__text">加载中…</text>
    </view>

    <view v-else-if="errorMessage" class="state">
      <text class="state__text">{{ errorMessage }}</text>
      <button class="state__btn" size="mini" @tap="loadAll">重新加载</button>
    </view>

    <view v-else-if="post" class="content">
      <view class="cover">
        <image
          v-if="coverUrl"
          class="cover__img"
          :src="coverUrl"
          mode="aspectFill"
          @error="onCoverError"
        />
        <view v-else class="cover__placeholder">
          <text class="cover__tip">封面加载失败</text>
        </view>
        <text class="cover__refresh" @tap="loadCover">换一张</text>
      </view>

      <view class="article">
        <text class="article__title">{{ post.title }}</text>
        <view class="article__meta">
          <text class="article__meta-item">#{{ post.id }}</text>
          <text class="article__meta-item">作者 {{ post.userId }}</text>
        </view>
        <text class="article__body">{{ post.body }}</text>
      </view>

      <view class="comments">
        <view class="comments__head">
          <text class="comments__title">评论</text>
          <text class="comments__count">{{ displayComments.length }} 条</text>
        </view>

        <view v-for="comment in displayComments" :key="comment.key" class="comment">
          <view class="comment__head">
            <text class="comment__name">{{ comment.name }}</text>
            <text v-if="comment.own" class="comment__mine">我</text>
            <text v-if="comment.own" class="comment__del" @tap="onRemoveComment(comment)">删除</text>
          </view>
          <text v-if="comment.email" class="comment__email">{{ comment.email }}</text>
          <text class="comment__body">{{ comment.body }}</text>
        </view>

        <text v-if="!displayComments.length" class="comments__empty">暂无评论</text>

        <!-- 发表评论 -->
        <view class="composer">
          <textarea
            v-model="commentText"
            class="composer__input"
            :placeholder="composerPlaceholder"
            :maxlength="200"
            :disabled="submitting"
          />
          <view class="composer__foot">
            <text class="composer__count">{{ commentText.length }}/200</text>
            <button
              class="composer__btn"
              size="mini"
              :disabled="submitting || !commentText.trim()"
              @tap="submitComment"
            >
              {{ submitting ? '提交中…' : '提交评论' }}
            </button>
          </view>
        </view>
      </view>

      <view class="bar">
        <button class="bar__btn" @tap="onToggleFavorite">
          {{ favoriteStore.isFavorite(post.id) ? '取消收藏' : '收藏这篇文章' }}
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import { createComment, fetchPostComments, fetchPostDetail, fetchRandomCover } from '@/api/blog'
import { useCommentStore } from '@/store/comments'
import { useFavoriteStore } from '@/store/favorite'
import { useUserStore } from '@/store/user'
import { checkSensitive, sensitiveTip } from '@/utils/sensitive'
import type { Comment, Post } from '@/types/blog'

/** 列表里展示的评论：自己的（本地存）和网络的可能没有 email，统一成一种结构 */
interface DisplayComment {
  key: string
  name: string
  email: string
  body: string
  /** 是否是自己发的（可删除） */
  own: boolean
  localId?: number
}

const postId = ref(0)
const post = ref<Post | null>(null)
const comments = ref<Comment[]>([])
const coverUrl = ref('')
const loading = ref(true)
const errorMessage = ref('')
const favoriteStore = useFavoriteStore()
const userStore = useUserStore()
const commentStore = useCommentStore()

const commentText = ref('')
const submitting = ref(false)

/** 自己发的评论（本地存）在前，网络的在后 */
const displayComments = computed<DisplayComment[]>(() => {
  const own = commentStore.listFor(postId.value).map((item) => ({
    key: `local-${item.id}`,
    name: item.name,
    email: '',
    body: item.body,
    own: true,
    localId: item.id
  }))
  const remote = comments.value.map((item, index) => ({
    key: `remote-${item.id}-${index}`,
    name: item.name,
    email: item.email,
    body: item.body,
    own: false
  }))
  return [...own, ...remote]
})

const composerPlaceholder = computed(() =>
  userStore.profile.email
    ? `以 ${userStore.profile.nickname}（${userStore.profile.email}）的身份评论…`
    : `以 ${userStore.profile.nickname} 的身份评论…（可在「我的」里填邮箱）`
)

/** 提交评论：违禁词拦截 → POST /posts/{id}/comments → 存本地（可删除） */
async function submitComment(): Promise<void> {
  const body = commentText.value.trim()
  if (!body || submitting.value) return

  const hits = checkSensitive(body)
  if (hits.length) {
    uni.showModal({
      title: '无法发表',
      content: sensitiveTip(hits),
      showCancel: false
    })
    return
  }

  submitting.value = true
  try {
    await createComment({
      postId: postId.value,
      name: userStore.profile.nickname,
      email: userStore.profile.email || 'anonymous@miniblog.dev',
      body
    })
    // 网络接口只回显，自己发的这份存本地，才能删除
    commentStore.add({
      postId: postId.value,
      name: userStore.profile.nickname,
      body
    })
    commentText.value = ''
    uni.showToast({ title: '评论已发表', icon: 'success' })
  } catch {
    // 错误 toast 已由 request 层统一弹出
  } finally {
    submitting.value = false
  }
}

function onRemoveComment(comment: DisplayComment): void {
  if (!comment.own || comment.localId === undefined) return
  uni.showModal({
    title: '删除评论',
    content: '确定删除这条评论吗？',
    success: (res) => {
      if (res.confirm) commentStore.remove(comment.localId as number)
    }
  })
}

async function loadAll(): Promise<void> {
  loading.value = true
  errorMessage.value = ''
  try {
    const [detail, commentList] = await Promise.all([
      fetchPostDetail(postId.value),
      fetchPostComments(postId.value)
    ])
    post.value = detail
    comments.value = commentList
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '加载失败'
  } finally {
    loading.value = false
  }
}

async function loadCover(): Promise<void> {
  try {
    coverUrl.value = await fetchRandomCover()
  } catch {
    coverUrl.value = ''
  }
}

function onCoverError(): void {
  coverUrl.value = ''
}

function onToggleFavorite(): void {
  if (!post.value) return
  const added = favoriteStore.toggle(post.value)
  uni.showToast({ title: added ? '已收藏' : '已取消收藏', icon: 'none' })
}

onLoad((options) => {
  postId.value = Number(options?.id ?? 0)

  if (!postId.value) {
    errorMessage.value = '缺少文章 id，请从列表页进入'
    loading.value = false
    return
  }

  loadAll()
  loadCover()
})

// #ifdef MP-WEIXIN
onShareAppMessage(() => {
  return {
    title: post.value ? post.value.title.slice(0, 20) : 'MiniBlog',
    path: `/pages/detail/detail?id=${postId.value}`
  }
})
// #endif

// #ifdef H5
function copyShareLink(): void {
  const link = `${window.location.origin}/#/pages/detail/detail?id=${postId.value}`
  uni.setClipboardData({
    data: link,
    success: () => {
      uni.showToast({ title: '链接已复制', icon: 'none' })
    }
  })
}
// #endif
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: $mb-bg;
  padding-bottom: 40rpx;
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

.cover {
  position: relative;
  height: 360rpx;
  background: $mb-placeholder;

  &__img {
    width: 100%;
    height: 100%;
  }

  &__placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  &__tip {
    font-size: 26rpx;
    color: $mb-text-hint;
  }

  &__refresh {
    position: absolute;
    right: 24rpx;
    bottom: 24rpx;
    padding: 8rpx 22rpx;
    font-size: 24rpx;
    color: #ffffff;
    background: $mb-mask;
    border-radius: 999rpx;
  }
}

.article {
  padding: 32rpx 32rpx 8rpx;
  background: $mb-card;

  &__title {
    display: block;
    font-size: 38rpx;
    font-weight: 700;
    line-height: 1.45;
    color: $mb-text;
  }

  &__meta {
    display: flex;
    margin: 18rpx 0 24rpx;
  }

  &__meta-item {
    margin-right: 20rpx;
    font-size: 24rpx;
    color: $mb-text-mute;
  }

  &__body {
    display: block;
    font-size: 30rpx;
    line-height: 1.8;
    color: $mb-text-strong;
    white-space: pre-wrap;
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
  padding: 24rpx 0;
  border-bottom: 1rpx solid $mb-border;

  &:last-child {
    border-bottom: none;
  }

  &__head {
    display: flex;
    align-items: baseline;
  }

  &__name {
    font-size: 27rpx;
    font-weight: 600;
    color: $mb-text-strong;
  }

  &__mine {
    margin-left: 12rpx;
    padding: 2rpx 12rpx;
    font-size: 20rpx;
    color: $mb-primary;
    background: $mb-primary-soft;
    border-radius: 999rpx;
  }

  &__del {
    margin-left: auto;
    font-size: 22rpx;
    color: $mb-danger;
  }

  &__email {
    display: block;
    margin: 4rpx 0 10rpx;
    font-size: 23rpx;
    color: $mb-text-hint;
  }

  &__body {
    display: block;
    font-size: 27rpx;
    line-height: 1.7;
    color: $mb-text-sub;
  }
}

.bar {
  padding: 32rpx;

  &__btn {
    font-size: 30rpx;
    color: #ffffff;
    background: $mb-primary;
    border-radius: 12rpx;
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
