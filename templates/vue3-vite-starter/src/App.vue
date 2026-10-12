<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <h1>Vue 3 + Vite 工程模板</h1>
  <button type="button" @click="count++">点了 {{ count }} 次</button>
</template>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
