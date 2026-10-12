<script setup>
import { ref } from 'vue'

// 单元 04 · 模板语法与响应式基础
import ProfileCard from './views/unit-04/ProfileCard.vue'
import Toggle from './views/unit-04/Toggle.vue'
import DirectiveBook from './views/unit-04/DirectiveBook.vue'

// 单元 05 · 计算属性、侦听器与渲染控制
import Student from './views/unit-05/Student.vue'
import Todo from './views/unit-05/Todo.vue'
import ActivityCard from './views/unit-05/ActivityCard.vue'

// 单元 06 · 用户交互与表单绑定
import ModelPractice from './views/unit-06/practice/08-ModelPractice.vue'
import ModelModifierPractice from './views/unit-06/practice/09-ModelModifierPractice.vue'
import CustomPractice from './views/unit-06/practice/10-CustomPractice.vue'

// 外层切单元，内层切该单元下的练习
const unit = ref('u04')
const tab04 = ref('profile')
const tab05 = ref('student')
const tab06 = ref('model')
</script>

<template>
  <div class="page">
    <h1 class="title">模块二 · Vue 3 核心基础练习</h1>

    <el-tabs v-model="unit" class="tabs">
      <el-tab-pane label="单元 4 · 模板语法与响应式基础" name="u04">
        <el-tabs v-model="tab04" class="inner-tabs">
          <el-tab-pane label="个人名片页" name="profile"><ProfileCard /></el-tab-pane>
          <el-tab-pane label="事件与状态" name="toggle"><Toggle /></el-tab-pane>
          <el-tab-pane label="指令练习册" name="book"><DirectiveBook /></el-tab-pane>
        </el-tabs>
      </el-tab-pane>

      <el-tab-pane label="单元 5 · 计算属性、侦听器与渲染控制" name="u05">
        <el-tabs v-model="tab05" class="inner-tabs">
          <el-tab-pane label="数据表格" name="student"><Student /></el-tab-pane>
          <el-tab-pane label="待办清单" name="todo"><Todo /></el-tab-pane>
          <el-tab-pane label="活动卡片（computed）" name="activity">
            <div class="center"><ActivityCard /></div>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>

      <el-tab-pane label="单元 6 · 用户交互与表单绑定" name="u06">
        <el-tabs v-model="tab06" class="inner-tabs">
          <el-tab-pane label="v-model 报名表" name="model"><ModelPractice /></el-tab-pane>
          <el-tab-pane label="v-model 修饰符" name="modifier"><ModelModifierPractice /></el-tab-pane>
          <el-tab-pane label="自定义指令" name="custom"><CustomPractice /></el-tab-pane>
        </el-tabs>
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
  max-width: 1040px;
  margin: 0 auto;
  padding: 28px 16px 40px;
}

.title {
  font-size: 22px;
  color: #0f172a;
  text-align: center;
  margin: 0 0 8px;
}

.tabs {
  background: #fff;
  padding: 8px 16px 16px;
  border-radius: 10px;
}

.inner-tabs {
  margin-top: 4px;
}

.center {
  display: flex;
  justify-content: center;
  padding: 16px 0;
}
</style>
