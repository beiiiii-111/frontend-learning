<script setup>
// <script setup>：组合式 API 写法，逻辑都写在这里
import { ref } from 'vue'

// ref 声明一个"响应式"数据，模板里放 .value 读取，改 .value 页面自动更新
const message = ref('学习 Vue 基础语法')
const count = ref(0)

function add() {
  count.value++
}
</script>

<template>
  <!-- template：模板/视图，直接写类 HTML，可用 {{ }} 和指令 -->
  <h2>Vite 创建的 Vue3 项目</h2>
  <p>{{ message }}</p>
  <button @click="add">计数 +1：{{ count }}</button>
</template>

<style>
/* style：当前组件样式（默认 scoped，只作用于本组件） */
h2 { color: #42b983; }
button { padding: 6px 14px; cursor: pointer; }
</style>
