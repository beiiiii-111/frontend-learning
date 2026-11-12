<template>
  <view class="sk">
    <view class="sk__idx sk__block" />
    <view class="sk__main">
      <view class="sk__line sk__line--title sk__block" />
      <view class="sk__line sk__block" />
      <view class="sk__line sk__line--short sk__block" />
    </view>
  </view>
</template>

<script setup lang="ts">
// 纯展示组件，没有逻辑。父级用 v-if 控制显示个数
</script>

<style lang="scss" scoped>
.sk {
  display: flex;
  padding: 28rpx 24rpx;
  margin-bottom: 16rpx;
  background: $mb-card;
  border-radius: $mb-radius-card;

  &__idx {
    width: 64rpx;
    height: 30rpx;
    flex-shrink: 0;
    border-radius: 6rpx;
  }

  &__main {
    flex: 1;
  }

  &__line {
    height: 24rpx;
    margin-bottom: 16rpx;
    border-radius: 6rpx;

    &--title {
      height: 30rpx;
      width: 70%;
    }

    &--short {
      width: 45%;
      margin-bottom: 0;
    }
  }
}

.sk__block {
  background: linear-gradient(90deg, $mb-border 25%, $mb-skeleton 37%, $mb-border 63%);
  background-size: 400% 100%;
  animation: sk-loading 1.4s ease infinite;
}

@keyframes sk-loading {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}
</style>
