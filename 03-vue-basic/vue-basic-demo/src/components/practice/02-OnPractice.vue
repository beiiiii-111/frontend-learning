<script setup>
import { ref } from "vue";

const likes = ref(128);
const collected = ref(false);
const keyword = ref("");
const log = ref("还没有产生事件");

const outerCount = ref(0);
const innerCount = ref(0);

// 方法引用：写成 @click="addLike" 时，Vue 会把事件对象自动传进来
function addLike() {
  likes.value++;
  log.value = "addLike() 被调用，点赞数 +1";
}

// 内联语句：@click="likes++" 这种直接写在标签上的写法
function countInline() {
  log.value = "内联语句执行完毕，当前点赞数 " + likes.value;
}

function toggleCollect() {
  collected.value = !collected.value;
  log.value = collected.value ? "已收藏" : "已取消收藏";
}

function handleEnter() {
  log.value =
    keyword.value.trim() === ""
      ? "回车了，但输入框是空的"
      : "回车提交：" + keyword.value;
}

function clearKeyword() {
  keyword.value = "";
  log.value = "按 Esc 清空了输入框";
}

// 事件对象：显式传 $event 才能拿到鼠标位置等信息
function showEvent(event) {
  log.value =
    "点击的是 " +
    event.target.tagName +
    "，坐标 " +
    event.clientX +
    ", " +
    event.clientY;
}

function outerClick() {
  outerCount.value++;
  log.value = "冒泡到了外层容器";
}

function innerClick() {
  innerCount.value++;
  log.value = "内层被点击（.stop 拦住了，不会继续冒泡）";
}

function onceTip() {
  log.value = "这个按钮只会响应一次点击，再点没反应了";
}
</script>

<template>
  <div class="practice">
    <h3 class="practice__title">v-on：点赞、快捷键与阻止默认行为</h3>
    <p class="practice__desc">
      @ 是 v-on 的简写，用来绑定事件，事件触发时执行等号后面的代码。
    </p>

    <div class="practice__toolbar">
      <el-button type="primary" @click="addLike">点赞 {{ likes }}</el-button>
      <el-button
        @click="
          likes++;
          countInline();
        "
        >内联语句 +1</el-button
      >
      <el-button
        :type="collected ? 'warning' : 'default'"
        @click="toggleCollect"
      >
        {{ collected ? "已收藏" : "收藏" }}
      </el-button>
      <el-button @click.once="onceTip">只能点一次</el-button>
    </div>

    <div class="practice__toolbar">
      <el-input
        v-model="keyword"
        placeholder="输入关键词后按回车"
        style="max-width: 260px"
        clearable
        @keyup.enter="handleEnter"
        @keyup.esc="clearKeyword"
      />
      <el-button @click="showEvent($event)">打印事件对象</el-button>
    </div>

    <!-- 表单提交会刷新页面，.prevent 阻止这个默认行为 -->
    <form class="practice__form" @submit.prevent="handleEnter">
      <span class="practice__hint">表单提交（.prevent 阻止刷新）</span>
      <el-button type="success" native-type="submit">提交搜索</el-button>
    </form>

    <div class="event-box" @click="outerClick">
      <span>外层容器被点了 {{ outerCount }} 次</span>
      <div class="event-box__inner" @click.stop="innerClick">
        内层被点了 {{ innerCount }} 次（.stop）
      </div>
    </div>

    <div class="practice__log">{{ log }}</div>

    <el-alert type="info" :closable="false" show-icon class="practice__note">
      <template #title>方法引用与内联语句</template>
      <code>@click="addLike"</code> 只写函数名，事件对象自动传入；<code
        >@click="addLike()"</code
      >
      加了括号就是普通调用，想要事件对象必须自己写
      <code>@click="addLike($event)"</code>。
    </el-alert>
  </div>
</template>

<style scoped>
.practice__toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.practice__form {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.practice__hint {
  font-size: 13px;
  color: #909399;
}

.event-box {
  padding: 16px;
  border: 1px dashed #dcdfe6;
  border-radius: 8px;
  font-size: 13px;
  color: #606266;
  cursor: pointer;
  max-width: 420px;
}

.event-box__inner {
  margin-top: 12px;
  padding: 12px;
  border-radius: 6px;
  background: #f5f7fa;
  border: 1px solid #e4e7ed;
}

.practice__log {
  margin-top: 12px;
  padding: 10px 14px;
  border-radius: 8px;
  background: #f5f7fa;
  font-size: 13px;
  color: #303133;
  font-family: Menlo, Consolas, monospace;
  max-width: 620px;
}
</style>
