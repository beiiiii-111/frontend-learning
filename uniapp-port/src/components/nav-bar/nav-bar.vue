<template>
  <view class="nav">
    <!-- 状态栏占位，小程序真机 / 模拟器会自动撑开，H5 下高度为 0 -->
    <view class="nav__status" />
    <view class="nav__bar">
      <view class="nav__side">
        <text v-if="back" class="nav__back" hover-class="nav__back--hover" @tap="onBack">‹</text>
      </view>
      <text class="nav__title">{{ title }}</text>
      <view class="nav__side">
        <slot name="right" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
interface Props {
  title: string
  /** 是否显示返回箭头。tabBar 页面不要开，否则返回无处可去 */
  back?: boolean
  /** 拦截返回：改为触发 back 事件，由页面自己决定是否真的返回 */
  interceptBack?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  back: false,
  interceptBack: false
})

const emit = defineEmits<{ (e: 'back'): void }>()

function onBack(): void {
  if (props.interceptBack) {
    emit('back')
    return
  }
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack()
  } else {
    uni.switchTab({ url: '/pages/index/index' })
  }
}
</script>

<style lang="scss" scoped>
.nav {
  background: linear-gradient(135deg, #2563eb 0%, #4f46e5 60%, #7c3aed 100%);

  &__status {
    height: var(--status-bar-height);
  }

  &__bar {
    display: flex;
    align-items: center;
    height: 88rpx;
    padding: 0 24rpx;
  }

  &__side {
    display: flex;
    align-items: center;
    min-width: 120rpx;
    min-height: 88rpx;
    flex-shrink: 0;

    &:last-child {
      justify-content: flex-end;
    }
  }

  &__back {
    padding: 0 16rpx;
    font-size: 56rpx;
    line-height: 1;
    color: #ffffff;
    transition: transform 0.15s ease;

    &--hover {
      transform: scale(0.85);
    }
  }

  &__title {
    flex: 1;
    font-size: 32rpx;
    font-weight: 600;
    color: #ffffff;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
