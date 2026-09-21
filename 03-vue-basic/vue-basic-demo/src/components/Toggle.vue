<script setup>
import { ref } from 'vue'

const isSignedUp = ref(false)
const count =ref(0)
const handleClick = () =>{
  isSignedUp.value = !isSignedUp.value
  count.value ++;
}
</script>

<template>
  <button class="btn" @click="handleClick">
    {{ isSignedUp ? '退订' : '报名' }}
  </button>

  <p :class="isSignedUp ? 'status--done' : 'status--idle'" class="show">
    {{ isSignedUp ? '已报名' : '未报名' }}
  </p>

  <p>你已经点击了 {{ count }} 次</p>
</template>


<style>
.btn,
.status--done,
.status--idle {
  padding: 10px 30px;
  border: none;
  border-radius: 8px;
  display: inline-block;
  font-size: 18px;
  margin-right: 10px;
  vertical-align: middle;
}

.btn {
  background-color: #5CA678;
  color: #FFFFFF;
  cursor: pointer;
}

.status--done {
  background-color: #5CA678;
  color: #FFFFFF;
}

.status--idle {
  background-color: #CCCCCC;
  color: #FFFFFF;
}

p {
  padding: 10px 30px;
  border: none;
  border-radius: 8px;
  display: inline-block;
  font-size: 18px;
  margin-right: 10px;
  vertical-align: middle;
  background-color: #5CA678;
}

.count {
  background-color: #5CA678;
  color: #CCCCCC;
}
</style>
