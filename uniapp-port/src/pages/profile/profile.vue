<template>
  <view class="page">
    <nav-bar title="我的" />

    <!-- 头像 -->
    <view class="avatar-card">
      <view class="avatar" @tap="chooseAvatar">
        <image
          v-if="profile.avatarUrl"
          class="avatar__img"
          :src="profile.avatarUrl"
          mode="aspectFill"
        />
        <text v-else class="avatar__emoji">{{ profile.avatarEmoji }}</text>
        <text class="avatar__edit">换头像</text>
      </view>
    </view>

    <!-- emoji 头像备选 -->
    <view class="emoji-row">
      <text
        v-for="emoji in AVATAR_EMOJIS"
        :key="emoji"
        class="emoji-row__item"
        :class="{ 'emoji-row__item--on': profile.avatarEmoji === emoji && !profile.avatarUrl }"
        @tap="pickEmoji(emoji)"
      >
        {{ emoji }}
      </text>
    </view>

    <!-- 我的发布入口 -->
    <view class="entry" hover-class="entry--hover" @tap="goMyPosts">
      <text class="entry__emoji">📝</text>
      <text class="entry__text">我的发布</text>
      <text class="entry__count">{{ publishStore.count }} 篇 ›</text>
    </view>

    <!-- 基础信息表单 -->
    <view class="form">
      <view class="form__row">
        <text class="form__label">昵称</text>
        <input class="form__input" :value="profile.nickname" :maxlength="20" @input="onInput('nickname', $event)" />
      </view>
      <view class="form__row">
        <text class="form__label">邮箱</text>
        <input class="form__input" :value="profile.email" placeholder="发表评论时展示" :maxlength="50" @input="onInput('email', $event)" />
      </view>
      <view class="form__row form__row--area">
        <text class="form__label">简介</text>
        <textarea
          class="form__area"
          :value="profile.bio"
          :maxlength="60"
          placeholder="一句话介绍自己"
          @input="onInput('bio', $event)"
        />
      </view>
    </view>

    <button class="save" @tap="onSave">保存</button>
    <text class="reset" @tap="onReset">恢复默认</text>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePublishStore } from '@/store/publish'
import { useUserStore } from '@/store/user'
import { AVATAR_EMOJIS, type UserProfile } from '@/types/user'

const userStore = useUserStore()
const publishStore = usePublishStore()
const profile = computed(() => userStore.profile)

function goMyPosts(): void {
  uni.navigateTo({ url: '/pages/myposts/myposts' })
}

// uni-app 对 input/textarea 原生事件的 TS 类型标注不稳定，这里取 detail.value 即可
function onInput(key: keyof UserProfile, event: { detail: { value: string } } | Event): void {
  const value = (event as { detail: { value: string } }).detail.value
  userStore.update({ [key]: value })
}

function chooseAvatar(): void {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    success: (res) => {
      const path = res.tempFilePaths?.[0]
      if (path) userStore.update({ avatarUrl: path })
    }
  })
}

function pickEmoji(emoji: string): void {
  // 选了 emoji 就清掉图片头像
  userStore.update({ avatarEmoji: emoji, avatarUrl: '' })
}

function onSave(): void {
  if (!profile.value.nickname.trim()) {
    uni.showToast({ title: '昵称不能为空', icon: 'none' })
    return
  }
  // 数据已通过 store 的 watch 实时落盘，这里只做确认反馈
  uni.showToast({ title: '已保存', icon: 'success' })
}

function onReset(): void {
  uni.showModal({
    title: '恢复默认',
    content: '将清空填写的所有个人信息',
    success: (res) => {
      if (res.confirm) userStore.reset()
    }
  })
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  padding: 32rpx $mb-page 60rpx;
  background: $mb-bg;
}

.avatar-card {
  display: flex;
  justify-content: center;
  padding: 40rpx 0 24rpx;
}

.avatar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 160rpx;
  height: 160rpx;
  overflow: hidden;
  font-size: 84rpx;
  background: $mb-primary-soft;
  border: 4rpx solid #ffffff;
  border-radius: 50%;
  box-shadow: 0 8rpx 24rpx rgba(37, 99, 235, 0.18);

  &__img {
    width: 100%;
    height: 100%;
  }

  &__edit {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 6rpx 0;
    font-size: 20rpx;
    text-align: center;
    color: #ffffff;
    background: $mb-mask;
  }
}

.entry {
  display: flex;
  align-items: center;
  padding: 26rpx 28rpx;
  margin-bottom: 28rpx;
  background: $mb-card;
  border-radius: 20rpx;
  transition: transform 0.15s ease;

  &--hover {
    transform: scale(0.98);
  }

  &__emoji {
    margin-right: 18rpx;
    font-size: 40rpx;
  }

  &__text {
    flex: 1;
    font-size: 29rpx;
    font-weight: 600;
    color: $mb-text;
  }

  &__count {
    font-size: 25rpx;
    color: $mb-text-hint;
  }
}

.emoji-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12rpx;
  margin-bottom: 32rpx;

  &__item {
    padding: 10rpx 18rpx;
    font-size: 40rpx;
    background: $mb-card;
    border: 3rpx solid transparent;
    border-radius: 14rpx;

    &--on {
      border-color: $mb-primary;
      background: $mb-primary-soft;
    }
  }
}

.form {
  background: $mb-card;
  border-radius: 20rpx;
  overflow: hidden;

  &__row {
    display: flex;
    align-items: center;
    padding: 26rpx 28rpx;
    border-bottom: 1rpx solid $mb-border;

    &--area {
      align-items: flex-start;
      border-bottom: none;
    }
  }

  &__label {
    width: 110rpx;
    flex-shrink: 0;
    font-size: 28rpx;
    color: $mb-text;
  }

  &__input {
    flex: 1;
    font-size: 28rpx;
  }

  &__area {
    flex: 1;
    height: 120rpx;
    font-size: 27rpx;
  }
}

.save {
  margin-top: 40rpx;
  font-size: 30rpx;
  color: #ffffff;
  background: $mb-primary;
  border-radius: 12rpx;
}

.reset {
  display: block;
  margin-top: 24rpx;
  text-align: center;
  font-size: 26rpx;
  color: $mb-text-mute;
}
</style>
