<script setup>
import { ref } from 'vue'

const todos =ref([
{ id: 1, text:'整理活动报名名单', done: false},
{ id: 2, text:'联系场地负责人', done: false},
{ id: 3, text:'准备审核说明材料', done: false},
])

const doneCount = () => todos.value.filter((item) =>item.done === true).length

const newText = ref('')
let nextId = 4

function addTodo() {
  const text = newText.value.trim()
  if (text === '') return
  todos.value.push({ id: nextId++, text: text, done: false })
  newText.value = ''
}

function removeTodo(id) {
  todos.value = todos.value.filter((item) => item.id !== id)
}


</script>

<template>

    <div class="todo-app">
    <h2>记事录</h2>

    <div class="add-row">
      <input v-model="newText" type="text" placeholder="输入待办事项，按回车添加" @keyup.enter="addTodo" />
      <button class="add" @click="addTodo">添加</button>
    </div>

    <ul>
      <li v-for="item in todos" :key="item.id" :class="{ done: item.done }">
        <input type="checkbox" v-model="item.done" />
        <span class="text">{{ item.text }}</span>
        <button class="del" @click="removeTodo(item.id)">删除</button>
      </li>
    </ul>

    <p class="summary">共 {{ todos.length }} 项 · 已完成 {{ doneCount() }} 项</p>
  </div>
</template>

<style scoped>
.todo-app {
  width: 380px;
  margin: 40px auto;
  padding: 22px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.12);
}

h2 { margin: 0 0 18px; font-size: 19px; text-align: center; color: #0f172a; }

.add-row { display: flex; gap: 8px; margin-bottom: 14px; }
.add-row input {
  flex: 1; padding: 9px 12px; border: 1px solid #e2e8f0; border-radius: 9px;
  font-size: 13px; color: #0f172a; outline: none; transition: border-color .2s;
}
.add-row input:focus { border-color: #4f46e5; }
.add {
  padding: 9px 18px; border: 0; border-radius: 9px;
  font-size: 13px; color: #fff; background: #6366f1; cursor: pointer;
}
.add:hover { background: #4f46e5; }

ul { margin: 0; padding: 0; list-style: none; }
li { display: flex; align-items: center; gap: 10px; padding: 11px 4px; border-bottom: 1px solid #f1f5f9; }
.text { flex: 1; font-size: 14px; color: #0f172a; }

/* 完成态：加删除线并变灰 */
.done .text { text-decoration: line-through; color: #94a3b8; }

.del {
  padding: 4px 8px; border: 0; border-radius: 6px;
  font-size: 12px; color: #ef4444; background: #fef2f2; cursor: pointer;
}
.del:hover { background: #ef4444; color: #fff; }

.summary { margin: 14px 0 0; font-size: 12.5px; color: #64748b; text-align: right; }
</style>
