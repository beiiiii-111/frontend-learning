<script setup>
import { ref, computed, watch } from 'vue'

// ===== 响应式数据 ref =====
const name = ref('张三')
const imgUrl = ref('https://picsum.photos/100')
const isShow = ref(true)
const count = ref(0)
const list = ref([
  { id: 1, title: 'Vue 学习 1' },
  { id: 2, title: 'Vue 学习 2' },
  { id: 3, title: 'Vue 学习 3' },
])

// 7. 计算属性 computed：根据已有数据"算"出来的值，会自动更新
const doubled = computed(() => count.value * 2)

// 8. 侦听器 watch：监听数据变化，一旦变了就执行回调
watch(count, (newVal, oldVal) => {
  console.log(`count 从 ${oldVal} 变成了 ${newVal}`)
})

// 事件方法
const changeName = () => { name.value = '李四' }
const add = () => { count.value++ }
</script>

<template>
  <div class="wrap">
    <!-- 1. 插值 {{ }}：把数据渲染到页面 -->
    <p>1. 插值 —— 姓名：{{ name }}</p>

    <!-- 2. v-bind 属性绑定（简写 :）：动态绑定 src -->
    <p>2. v-bind —— 图片：</p>
    <img :src="imgUrl" alt="随机图" class="pic" />

    <!-- 3. v-on 事件绑定（简写 @）：点击触发方法 -->
    <p>3. v-on —— <button @click="changeName">点我改名字</button></p>

    <!-- 4. v-model 双向绑定：输入框 ↔ 数据 相互同步 -->
    <p>4. v-model —— <input v-model="name" placeholder="输入试试" /></p>

    <!-- 5. v-if / v-else 条件渲染 -->
    <p>5. v-if —— <span v-if="isShow">显示内容</span><span v-else>隐藏</span>
      <button @click="isShow = !isShow">切换</button></p>

    <!-- 6. v-for 列表循环渲染（记得加 :key） -->
    <p>6. v-for 列表：</p>
    <ul><li v-for="item in list" :key="item.id">{{ item.title }}</li></ul>

    <!-- 7. computed 计算属性 -->
    <p>7. computed —— 计数：{{ count }}，翻倍：{{ doubled }}</p>

    <!-- 8. watch 侦听器（打开浏览器控制台 F12 看打印） -->
    <p>8. watch —— <button @click="add">count +1</button>（按 F12 看 Console）</p>
  </div>
</template>

<style scoped>
.wrap { font-family: "Microsoft YaHei", sans-serif; line-height: 1.8; }
.pic { width: 100px; border-radius: 6px; display: block; }
button { padding: 4px 10px; cursor: pointer; margin-left: 6px; }
input { padding: 4px 8px; }
</style>
