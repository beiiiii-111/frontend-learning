<script setup>
import { ref } from 'vue'
import Toggle from './components/Toggle.vue'
import Todo from './components/Todo.vue'
import ActivityCard from './components/ActivityCard.vue'
import ProfileCard from './components/ProfileCard.vue'

const tab = ref('toggle')
</script>

<template>
  <div class="page">
    <h1 class="title">Vue3 基础练习合集</h1>

    <el-tabs v-model="tab" class="tabs">
      <el-tab-pane label="事件与状态" name="toggle">
        <Toggle />
      </el-tab-pane>

      <el-tab-pane label="列表渲染 Todo" name="todo">
        <Todo />
      </el-tab-pane>

      <el-tab-pane label="活动卡片" name="activity">
        <div class="center"><ActivityCard /></div>
      </el-tab-pane>

      <el-tab-pane label="个人名片" name="profile">
        <ProfileCard />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style>
body {
  margin: 0;
  background: #f1f5f9;
  font-family: "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
}

.page {
  max-width: 640px;
  margin: 0 auto;
  padding: 28px 16px 40px;
}

.title {
  font-size: 22px;
  color: #0f172a;
  text-align: center;
  margin: 0 0 8px;
}

.center {
  display: flex;
  justify-content: center;
  padding: 16px 0;
}
</style>
