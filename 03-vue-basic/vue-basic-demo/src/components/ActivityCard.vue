<script setup>
import { ref, computed } from 'vue'

// 状态 -> 文案
const statusText = {
  draft: '草稿',
  signing: '报名中',
  closed: '报名截止',
  finished: '已结束'
}

// 活动数据（两个海报）
const list = ref([
  {
    title: '2026 春季校园歌手大赛',
    status: 'signing',
    cover:'https://9c711d5c18804a7ca3c393ce367ad3ff.app.workbuddy.host/singer.jpg',
    offline: false
  },
  {
    title: '秋日校园辩论赛',
    status: 'closed',
    cover:  'https://9c711d5c18804a7ca3c393ce367ad3ff.app.workbuddy.host/debate.jpg',
    offline: true
  }
])

// 当前显示第几个
const index = ref(0)
const activity = computed(() => list.value[index.value])

// 上一张 / 下一张
function prev() {
  index.value = (index.value - 1 + list.value.length) % list.value.length
}
function next() {
  index.value = (index.value + 1) % list.value.length
}
</script>

<template>
  <article class="activity-card">
    <!-- 海报 -->
    <div class="poster" :style="{ backgroundImage: 'url(' + activity.cover + ')' }">
      <span class="tag" :class="'tag--' + activity.status">
        {{ statusText[activity.status] }}
      </span>
      <span class="type">{{ activity.offline ? '线下活动' : '线上活动' }}</span>
    </div>

    <h3>{{ activity.title }}</h3>

    <button class="off" :disabled="activity.status !== 'draft'">下架</button>

    <!-- 上一张 / 下一张 -->
    <div class="switch">
      <button @click="prev">上一张</button>
      <span>{{ index + 1 }} / {{ list.length }}</span>
      <button @click="next">下一张</button>
    </div>
  </article>
</template>

<style scoped>
.activity-card {
  width: 300px;
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  text-align: center;
}

.poster {
  position: relative;
  height: 320px;
  background-size: cover;        /* 新增 */
  background-position: center;   /* 新增 */
}

.tag,
.type {
  position: absolute;
  top: 12px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  color: #fff;
}

.tag {
  left: 12px;
}

.type {
  right: 12px;
  background: rgba(0, 0, 0, 0.4);
}

.tag--draft {
  background: #909399;
}

.tag--signing {
  background: #10b981;
}

.tag--closed {
  background: #f59e0b;
}

.tag--finished {
  background: #64748b;
}

h3 {
  margin: 14px 0;
  font-size: 17px;
  color: #0f172a;
}

.off {
  padding: 6px 20px;
  border: 0;
  border-radius: 8px;
  color: #fff;
  background: #ef4444;
  cursor: pointer;
}

.off:disabled {
  background: #e2e8f0;
  color: #94a3b8;
  cursor: not-allowed;
}

.switch {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  padding: 12px 16px;
  border-top: 1px solid #f1f5f9;
  font-size: 13px;
  color: #64748b;
}

.switch button {
  padding: 6px 14px;
  border: 1px solid #d8dee9;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
}

.switch button:hover {
  border-color: #6366f1;
  color: #6366f1;
}
</style>
