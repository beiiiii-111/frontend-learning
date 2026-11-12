<template>
  <view class="page">
    <!-- 沉浸式渐变头部 -->
    <view class="hero">
      <view class="hero__glow hero__glow--1" />
      <view class="hero__glow hero__glow--2" />

      <view class="hero__top" @tap="goProfile">
        <view class="hero__avatar">
          <image
            v-if="userStore.profile.avatarUrl"
            class="hero__avatar-img"
            :src="userStore.profile.avatarUrl"
            mode="aspectFill"
          />
          <text v-else class="hero__avatar-emoji">{{ userStore.profile.avatarEmoji }}</text>
        </view>
        <view class="hero__intro">
          <text class="hero__greet">{{ greeting }}，{{ userStore.profile.nickname }}</text>
          <text class="hero__sub">{{ userStore.profile.bio }}</text>
        </view>
        <text class="hero__arrow">›</text>
      </view>

      <view class="hero__stats">
        <view class="stat">
          <text class="stat__num">{{ postCount }}</text>
          <text class="stat__label">已加载文章</text>
        </view>
        <view class="stat__divider" />
        <view class="stat">
          <text class="stat__num stat__num--star">{{ favoriteStore.count }}</text>
          <text class="stat__label">收藏</text>
        </view>
      </view>
    </view>

    <!-- 搜索框 -->
    <view class="search">
      <text class="search__icon">🔍</text>
      <input
        v-model="searchText"
        class="search__input"
        placeholder="搜标题，如 vue / est / quo"
        confirm-type="search"
        @confirm="onSearch"
      />
      <text v-if="searchText || isSearching" class="search__clear" @tap="onClearSearch">✕</text>
      <button v-else class="search__btn" size="mini" @tap="onSearch">搜索</button>
    </view>

    <view v-if="isSearching" class="search-bar">
      <text class="search-bar__text">
        “{{ keyword }}” 的结果：{{ list.length }} 篇
      </text>
      <text class="search-bar__exit" @tap="onClearSearch">退出搜索</text>
    </view>

    <!-- 我的发布：本地存储的文章，横向滑动 -->
    <view v-if="publishStore.count" class="mine">
      <view class="mine__head">
        <text class="mine__title">我的发布</text>
        <text class="mine__more" @tap="goMyPosts">全部 {{ publishStore.count }} 篇 ›</text>
      </view>
      <scroll-view class="mine__scroll" scroll-x :show-scrollbar="false">
        <view class="mine__track">
          <view
            v-for="item in publishStore.latest"
            :key="item.id"
            class="mcard"
            hover-class="mcard--hover"
            @tap="goLocalDetail(item.id)"
          >
            <image v-if="item.images.length" class="mcard__img" :src="item.images[0]" mode="aspectFill" />
            <view v-else class="mcard__img mcard__img--emoji">
              <text class="mcard__emoji">{{ item.emoji }}</text>
            </view>
            <text class="mcard__title">{{ item.title }}</text>
            <text class="mcard__count">💬 {{ commentStore.countFor(item.id) }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <view v-if="loading && !list.length" class="list">
      <skeleton-card v-for="n in 4" :key="n" />
    </view>

    <view v-else-if="errorMessage && !list.length" class="state">
      <text class="state__text">{{ errorMessage }}</text>
      <button class="state__btn" size="mini" @tap="retry">重新加载</button>
    </view>

    <view v-else-if="isEmpty" class="state">
      <text class="state__text">{{ isSearching ? '没有匹配的文章' : '还没有内容' }}</text>
    </view>

    <view v-else class="list">
      <post-card
        v-for="(post, index) in list"
        :key="post.id"
        class="anim"
        :style="{ animationDelay: `${Math.min(index, 8) * 70}ms` }"
        :post="post"
        :index="index"
        :favorite="favoriteStore.isFavorite(post.id)"
        @open="openDetail"
        @toggle-favorite="onToggleFavorite"
      />
    </view>

    <view class="footer">
      <text v-if="loading" class="footer__text">加载中…</text>
      <text v-else-if="isSearching" class="footer__text">搜索结果已全部展示</text>
      <text v-else-if="finished" class="footer__text">已经到底了</text>
      <text v-else class="footer__text" @tap="loadNext">点击加载更多</text>
    </view>

    <!-- 右下角悬浮按钮：下翻出现回顶 -->
    <view class="fabs">
      <view
        class="fab fab--top"
        :class="{ 'fab--hidden': !showTop }"
        hover-class="fab--hover"
        @tap="scrollToTop"
      >
        <text class="fab__icon">↑</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad, onPageScroll, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import { usePostList } from '@/composables/usePostList'
import { useFavoriteStore } from '@/store/favorite'
import { useCommentStore } from '@/store/comments'
import { usePublishStore } from '@/store/publish'
import { useUserStore } from '@/store/user'
import type { Post } from '@/types/blog'

const {
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
} = usePostList(10)
const favoriteStore = useFavoriteStore()
const publishStore = usePublishStore()
const commentStore = useCommentStore()
const userStore = useUserStore()

const searchText = ref('')
/** 下滚超过一屏就显示回顶按钮 */
const showTop = ref(false)

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了'
  if (hour < 12) return '早上好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  return '晚上好'
})

const postCount = computed(() => list.value.length)

function openDetail(id: number): void {
  uni.navigateTo({ url: `/pages/detail/detail?id=${id}` })
}

function onToggleFavorite(post: Post): void {
  const added = favoriteStore.toggle(post)
  uni.showToast({ title: added ? '已收藏' : '已取消收藏', icon: 'none' })
}

function goProfile(): void {
  uni.switchTab({ url: '/pages/profile/profile' })
}

function goMyPosts(): void {
  uni.navigateTo({ url: '/pages/myposts/myposts' })
}

function goLocalDetail(id: number): void {
  uni.navigateTo({ url: `/pages/localdetail/localdetail?id=${id}` })
}

function scrollToTop(): void {
  uni.pageScrollTo({ scrollTop: 0, duration: 300 })
}

function onSearch(): void {
  search(searchText.value)
}

function onClearSearch(): void {
  searchText.value = ''
  search('')
}

function retry(): void {
  refresh()
}

onLoad(() => {
  loadNext()
})

onReachBottom(() => {
  loadNext()
})

onPageScroll((event) => {
  showTop.value = event.scrollTop > 400
})

onPullDownRefresh(async () => {
  await refresh()
  uni.stopPullDownRefresh()
})
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  padding-bottom: 40rpx;
  background: $mb-bg;
}

/* ---------- 头部 ---------- */
.hero {
  position: relative;
  padding: calc(var(--status-bar-height) + 40rpx) 32rpx 36rpx;
  overflow: hidden;
  color: #ffffff;
  background: linear-gradient(135deg, #2563eb 0%, #4f46e5 60%, #7c3aed 100%);
  border-radius: 0 0 40rpx 40rpx;

  &__glow {
    position: absolute;
    width: 320rpx;
    height: 320rpx;
    background: rgba(255, 255, 255, 0.12);
    border-radius: 50%;
    animation: float 6s ease-in-out infinite;

    &--1 {
      top: -100rpx;
      right: -60rpx;
    }

    &--2 {
      bottom: -140rpx;
      left: -80rpx;
      animation-delay: -3s;
    }
  }

  &__top {
    position: relative;
    display: flex;
    align-items: center;
  }

  &__avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 96rpx;
    height: 96rpx;
    margin-right: 24rpx;
    overflow: hidden;
    font-size: 52rpx;
    background: rgba(255, 255, 255, 0.25);
    border: 3rpx solid rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    flex-shrink: 0;
  }

  &__avatar-img {
    width: 100%;
    height: 100%;
  }

  &__intro {
    flex: 1;
    min-width: 0;
  }

  &__greet {
    display: block;
    font-size: 34rpx;
    font-weight: 700;
  }

  &__sub {
    display: block;
    margin-top: 6rpx;
    font-size: 23rpx;
    color: rgba(255, 255, 255, 0.75);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__arrow {
    font-size: 44rpx;
    color: rgba(255, 255, 255, 0.6);
  }

  &__stats {
    position: relative;
    display: flex;
    align-items: center;
    margin-top: 36rpx;
    padding: 24rpx 0;
    background: rgba(255, 255, 255, 0.14);
    border-radius: 20rpx;
  }
}

.stat {
  flex: 1;
  text-align: center;

  &__num {
    display: block;
    font-size: 40rpx;
    font-weight: 700;
    font-family: 'SF Mono', Menlo, monospace;
    animation: pop 0.4s ease;

    &--star {
      color: #fde68a;
    }
  }

  &__label {
    display: block;
    margin-top: 4rpx;
    font-size: 22rpx;
    color: rgba(255, 255, 255, 0.7);
  }

  &__divider {
    width: 1rpx;
    height: 56rpx;
    background: rgba(255, 255, 255, 0.25);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-24rpx);
  }
}

@keyframes pop {
  0% {
    transform: scale(0.6);
    opacity: 0.4;
  }
  70% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* ---------- 搜索 ---------- */
.search {
  display: flex;
  align-items: center;
  margin: 24rpx;
  padding: 0 24rpx;
  background: $mb-card;
  border-radius: 999rpx;
  box-shadow: 0 4rpx 16rpx rgba(17, 24, 39, 0.06);

  &__icon {
    margin-right: 14rpx;
    font-size: 28rpx;
  }

  &__input {
    flex: 1;
    height: 76rpx;
    font-size: 28rpx;
  }

  &__clear {
    padding: 16rpx;
    font-size: 28rpx;
    color: $mb-text-mute;
  }

  &__btn {
    margin: 8rpx 0;
    font-size: 24rpx;
    line-height: 2.2;
    color: #ffffff;
    background: $mb-primary;
    border-radius: 999rpx;
  }
}

.search-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 24rpx 16rpx;
  padding: 16rpx 24rpx;
  background: $mb-primary-soft;
  border-radius: 14rpx;

  &__text {
    font-size: 25rpx;
    color: $mb-primary;
  }

  &__exit {
    font-size: 25rpx;
    color: $mb-text-sub;
  }
}

/* ---------- 列表 ---------- */
.list {
  margin-top: 8rpx;
  padding: 0 $mb-page;
}

.anim {
  animation: fade-up 0.45s ease both;
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(28rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.state {
  padding: 160rpx 0;
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

.footer {
  padding: 32rpx 0 16rpx;
  text-align: center;

  &__text {
    font-size: 24rpx;
    color: $mb-text-hint;
  }
}

/* ---------- 我的发布 ---------- */
.mine {
  margin: 8rpx 0 24rpx;

  &__head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    padding: 0 $mb-page 16rpx;
  }

  &__title {
    font-size: 30rpx;
    font-weight: 700;
    color: $mb-text;
  }

  &__more {
    font-size: 24rpx;
    color: $mb-text-hint;
  }

  &__scroll {
    white-space: nowrap;
  }

  &__track {
    display: inline-flex;
    padding: 0 $mb-page;
  }
}

.mcard {
  width: 240rpx;
  margin-right: 16rpx;
  overflow: hidden;
  background: $mb-card;
  border-radius: 18rpx;
  transition: transform 0.18s ease;

  &--hover {
    transform: scale(0.96);
  }

  &__img {
    width: 240rpx;
    height: 160rpx;

    &--emoji {
      display: flex;
      align-items: center;
      justify-content: center;
      background: $mb-primary-soft;
    }
  }

  &__emoji {
    font-size: 64rpx;
  }

  &__title {
    display: block;
    padding: 14rpx 16rpx 4rpx;
    font-size: 25rpx;
    color: $mb-text-strong;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__count {
    display: block;
    padding: 0 16rpx 16rpx;
    font-size: 21rpx;
    color: $mb-text-hint;
  }
}

/* ---------- 悬浮按钮 ---------- */
.fabs {
  position: fixed;
  right: 32rpx;
  bottom: 180rpx;
  z-index: 99;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.fab {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  transition: transform 0.25s ease, opacity 0.25s ease;

  &__icon {
    font-size: 42rpx;
    line-height: 1;
  }


  &--top {
    color: $mb-primary;
    background: #ffffff;
    box-shadow: 0 6rpx 18rpx rgba(17, 24, 39, 0.16);
  }

  /* 隐藏时缩到透明而不是直接消失，滑出更顺 */
  &--hidden {
    opacity: 0;
    transform: scale(0.4) translateY(20rpx);
    pointer-events: none;
  }

  &--hover {
    transform: scale(0.88);
  }
}

</style>
