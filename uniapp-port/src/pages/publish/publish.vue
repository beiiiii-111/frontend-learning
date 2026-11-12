<template>
  <view class="page">
    <nav-bar title="发布文章">
      <template #right>
        <view class="nav-actions">
          <text class="draft-btn draft-btn--ghost" hover-class="draft-btn--hover" @tap="onClear">清空</text>
          <text class="draft-btn" hover-class="draft-btn--hover" @tap="onGoDrafts">
            草稿箱{{ drafts.length ? `(${drafts.length})` : '' }}
          </text>
        </view>
      </template>
    </nav-bar>

    <view class="form">
      <!-- 心情 -->
      <view class="block">
        <text class="block__label">今天的心情</text>
        <view class="mood">
          <text
            v-for="emoji in POST_EMOJIS"
            :key="emoji"
            class="mood__item"
            :class="{ 'mood__item--on': mood === emoji }"
            @tap="mood = emoji"
          >
            {{ emoji }}
          </text>
        </view>
      </view>

      <!-- 标题 -->
      <view class="block">
        <text class="block__label">标题</text>
        <input
          v-model="title"
          class="title"
          placeholder="给这篇文章起个标题"
          :maxlength="40"
        />
      </view>

      <!-- 正文 -->
      <view class="block">
        <view class="block__head">
          <text class="block__label">正文</text>
          <text class="counter">{{ body.length }}/500</text>
        </view>
        <textarea
          v-model="body"
          class="body"
          placeholder="写点什么…下面可以插入表情"
          :maxlength="500"
        />

        <!-- 表情面板：点击追加到正文末尾 -->
        <view class="emoji-panel">
          <text
            v-for="emoji in POST_EMOJIS"
            :key="emoji"
            class="emoji-panel__item"
            hover-class="emoji-panel__item--hover"
            @tap="appendEmoji(emoji)"
          >
            {{ emoji }}
          </text>
        </view>
      </view>

      <!-- 配图 -->
      <view class="block">
        <view class="block__head">
          <text class="block__label">配图</text>
          <text class="counter">{{ images.length }}/9</text>
        </view>
        <view class="grid">
          <view v-for="(img, index) in images" :key="img" class="grid__cell">
            <image class="grid__img" :src="img" mode="aspectFill" @tap="preview(index)" />
            <text class="grid__del" @tap="removeImage(index)">✕</text>
          </view>
          <view v-if="images.length < 9" class="grid__add" hover-class="grid__add--hover" @tap="chooseImage">
            <text class="grid__add-plus">＋</text>
            <text class="grid__add-text">添加图片</text>
          </view>
        </view>
      </view>
    </view>

    <button class="submit" hover-class="submit--hover" @tap="onSubmit">发布</button>
  </view>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { usePublishStore } from '@/store/publish'
import { useUserStore } from '@/store/user'
import { POST_EMOJIS } from '@/types/blog'
import { persistFile } from '@/utils/file'
import { checkSensitive, sensitiveTip } from '@/utils/sensitive'

const publishStore = usePublishStore()
const userStore = useUserStore()

const mood = ref('📝')
const title = ref('')
const body = ref('')
const images = ref<string[]>([])
const submitting = ref(false)
const drafts = computed(() => publishStore.drafts)

/** 内容是否为空（空内容退出不弹询问） */
function isEmpty(): boolean {
  return !title.value.trim() && !body.value.trim() && images.value.length === 0
}

/** 当前表单快照 */
function snapshot(): string {
  return JSON.stringify([mood.value, title.value, body.value, images.value])
}

function editingSnapshot(): string {
  const e = publishStore.editing
  if (!e) return ''
  return JSON.stringify([e.mood, e.title, e.body, e.images])
}

// tabBar 页面不会重新挂载，用 onShow 恢复编辑内容（比如从草稿箱"继续编辑"回来）
onShow(() => {
  const editing = publishStore.editing
  if (editing && snapshot() !== editingSnapshot()) {
    mood.value = editing.mood
    title.value = editing.title
    body.value = editing.body
    images.value = [...editing.images]
  } else if (!editing && !isEmpty()) {
    // 草稿箱里直接发布过 / 内容已失效，回来时清掉残留
    resetFields()
  }
})

/** 清空表单 */
function resetFields(): void {
  mood.value = '📝'
  title.value = ''
  body.value = ''
  images.value = []
}

// 编辑内容自动记忆：写一点存一点，切到别的 tab / 小程序被回收都不丢
watch(
  [mood, title, body, images],
  () => {
    if (isEmpty()) {
      publishStore.clearEditing()
    } else {
      publishStore.saveEditing(currentDraft())
    }
  },
  { deep: true }
)

// 草稿箱里直接发布后，把编辑器里残留的同一条内容清掉
function onDraftPublished(): void {
  resetFields()
}
uni.$on('draft-published', onDraftPublished)
onUnmounted(() => {
  uni.$off('draft-published', onDraftPublished)
})

function appendEmoji(emoji: string): void {
  body.value = `${body.value}${emoji}`
}

function chooseImage(): void {
  uni.chooseImage({
    count: 9 - images.value.length,
    sizeType: ['compressed'],
    success: async (res) => {
      const paths = res.tempFilePaths ?? []
      for (const path of paths) {
        images.value.push(await persistFile(path))
      }
    }
  })
}

function removeImage(index: number): void {
  images.value.splice(index, 1)
}

function preview(index: number): void {
  uni.previewImage({ urls: images.value, current: index })
}

function currentDraft() {
  return { mood: mood.value, title: title.value, body: body.value, images: [...images.value] }
}

/** 清空重写：确认后丢弃当前编辑 */
function onClear(): void {
  if (isEmpty()) return
  uni.showModal({
    title: '清空编辑',
    content: '当前编辑的内容将被丢弃，确定清空吗？',
    confirmText: '清空',
    confirmColor: '#ef4444',
    success: (res) => {
      if (res.confirm) {
        publishStore.clearEditing()
        resetFields()
      }
    }
  })
}

/** 右上角草稿箱：当前内容入箱，进入草稿箱页面 */
function onGoDrafts(): void {
  if (!isEmpty()) {
    // 先按 editing 的 id 入箱，再清掉编辑内容，回到发布页是干净的
    publishStore.saveDraft(currentDraft())
    publishStore.clearEditing()
    resetFields()
  }
  uni.navigateTo({ url: '/pages/drafts/drafts' })
}

async function onSubmit(): Promise<void> {
  if (submitting.value) return

  const trimmedTitle = title.value.trim()
  const trimmedBody = body.value.trim()
  if (!trimmedTitle) {
    uni.showToast({ title: '标题不能为空', icon: 'none' })
    return
  }
  if (!trimmedBody) {
    uni.showToast({ title: '正文不能为空', icon: 'none' })
    return
  }

  // 违禁词检测：标题 + 正文都要过
  const hits = checkSensitive(`${trimmedTitle} ${trimmedBody}`)
  if (hits.length > 0) {
    uni.showModal({
      title: '无法发布',
      content: sensitiveTip(hits),
      confirmText: '去修改',
      showCancel: false
    })
    return
  }

  submitting.value = true
  try {
    publishStore.add({
      title: trimmedTitle,
      body: trimmedBody,
      images: [...images.value],
      emoji: mood.value,
      author: userStore.profile.nickname
    })
    publishStore.clearEditing()
    // 发布完清空表单：再回到发布 tab 是干净的编辑页
    resetFields()
    uni.showToast({ title: '发布成功', icon: 'success' })
    setTimeout(() => {
      // 发布页现在是 tabBar 页，发布完跳回首页
      uni.switchTab({ url: '/pages/index/index' })
    }, 600)
  } finally {
    submitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  padding-bottom: 60rpx;
  background: $mb-bg;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.draft-btn {
  padding: 8rpx 20rpx;
  font-size: 24rpx;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.22);
  border-radius: 999rpx;
  transition: transform 0.15s ease;

  &--ghost {
    background: transparent;
    opacity: 0.85;
  }

  &--hover {
    transform: scale(0.92);
  }
}

.form {
  margin: -20rpx 24rpx 0;
  padding: 32rpx 28rpx;
  background: $mb-card;
  border-radius: 24rpx;
  box-shadow: 0 6rpx 20rpx rgba(17, 24, 39, 0.05);
}

.block {
  margin-bottom: 32rpx;

  &__head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
  }

  &__label {
    display: block;
    margin-bottom: 16rpx;
    font-size: 27rpx;
    font-weight: 600;
    color: $mb-text;
  }
}

.counter {
  font-size: 22rpx;
  color: $mb-text-hint;
}

.mood {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;

  &__item {
    padding: 8rpx 16rpx;
    font-size: 38rpx;
    background: $mb-bg;
    border: 3rpx solid transparent;
    border-radius: 14rpx;
    transition: transform 0.2s ease;

    &--on {
      background: $mb-primary-soft;
      border-color: $mb-primary;
      transform: scale(1.12);
    }
  }
}

.title {
  height: 80rpx;
  padding: 0 20rpx;
  font-size: 30rpx;
  background: $mb-bg;
  border-radius: 12rpx;
}

.body {
  box-sizing: border-box;
  width: 100%;
  height: 260rpx;
  padding: 20rpx;
  font-size: 28rpx;
  line-height: 1.7;
  background: $mb-bg;
  border-radius: 12rpx;
}

.emoji-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  margin-top: 16rpx;

  &__item {
    padding: 6rpx 14rpx;
    font-size: 34rpx;
    background: $mb-bg;
    border-radius: 12rpx;
    transition: transform 0.15s ease;

    &--hover {
      transform: scale(0.86);
    }
  }
}

.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;

  &__cell {
    position: relative;
    width: 200rpx;
    height: 200rpx;
  }

  &__img {
    width: 100%;
    height: 100%;
    border-radius: 14rpx;
  }

  &__del {
    position: absolute;
    top: -8rpx;
    right: -8rpx;
    width: 44rpx;
    height: 44rpx;
    font-size: 24rpx;
    line-height: 44rpx;
    text-align: center;
    color: #ffffff;
    background: $mb-danger;
    border-radius: 50%;
  }

  &__add {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 200rpx;
    height: 200rpx;
    background: $mb-bg;
    border: 2rpx dashed $mb-border;
    border-radius: 14rpx;
    transition: transform 0.15s ease;

    &--hover {
      transform: scale(0.96);
    }
  }

  &__add-plus {
    font-size: 48rpx;
    color: $mb-text-hint;
  }

  &__add-text {
    margin-top: 4rpx;
    font-size: 22rpx;
    color: $mb-text-hint;
  }
}

.submit {
  margin: 0 24rpx;
  font-size: 32rpx;
  color: #ffffff;
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  border-radius: 999rpx;
  transition: transform 0.15s ease;

  &--hover {
    transform: scale(0.98);
  }
}
</style>
