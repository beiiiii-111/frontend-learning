<script setup>
import { ref } from "vue";

const keyword = ref("");
const phone = ref("");

const students = ref([
  { id: 1, name: "李明", className: "软件 2301" },
  { id: 2, name: "王小雨", className: "软件 2301" },
  { id: 3, name: "陈超", className: "软件 2302" },
  { id: 4, name: "张梦琪", className: "软件 2302" },
  { id: 5, name: "李思远", className: "网络 2301" },
  { id: 6, name: "赵倩", className: "网络 2301" },
]);

// 指令挂在 el-input 上时，拿到的是组件根元素（一个 div），
// 真正能聚焦、能读写 value 的是它内部的原生 input，所以先找出来
function findInput(el) {
  return el.tagName === "INPUT" ? el : el.querySelector("input");
}

// 自定义指令一：挂载完成后自动聚焦
const vFocus = {
  mounted(el) {
    const input = findInput(el);
    if (input) {
      input.focus();
    }
  },
};

// 自定义指令二：输入时过滤掉非数字字符
const vDigits = {
  mounted(el) {
    const input = findInput(el);
    if (!input) {
      return;
    }
    input.addEventListener("input", function () {
      const filtered = input.value.replace(/\D/g, "");
      if (filtered !== input.value) {
        input.value = filtered;
        // 手动派发一次 input 事件，v-model 才能拿到过滤后的值
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });
  },
};

// 自定义指令三：内容里包含关键词时给整行加底色
function paint(el, keyword) {
  if (keyword === "") {
    el.style.backgroundColor = "";
    return;
  }
  el.style.backgroundColor =
    el.textContent.indexOf(keyword) !== -1 ? "#fdf6ec" : "";
}

const vHighlight = {
  mounted(el, binding) {
    paint(el, binding.value);
  },
  // 数据变化后指令默认不会重跑，需要自己接上 updated
  updated(el, binding) {
    paint(el, binding.value);
  },
};
</script>

<template>
  <div class="practice">
    <h3 class="practice__title">自定义指令：把重复的 DOM 操作封装起来</h3>
    <p class="practice__desc">
      在 script setup 里用 v 开头的变量名声明指令对象，模板里就能直接当
      v-focus、v-digits、v-highlight 来用。
    </p>

    <h4 class="practice__subtitle">v-focus：页面打开就聚焦到输入框</h4>
    <div class="practice__row">
      <el-input
        v-focus
        v-model="keyword"
        placeholder="这个输入框会自动获得焦点"
        style="max-width: 320px"
      />
      <span class="practice__hint">光标已经在框里了，可以直接打字</span>
    </div>

    <h4 class="practice__subtitle">v-digits：只允许输入数字</h4>
    <div class="practice__row">
      <el-input
        v-digits
        v-model="phone"
        placeholder="试着输入字母和汉字"
        style="max-width: 320px"
      />
      <span class="practice__hint"
        >数据里收到的值：{{ JSON.stringify(phone) }}</span
      >
    </div>

    <h4 class="practice__subtitle">v-highlight：命中关键词的行加底色</h4>
    <el-input
      v-model="keyword"
      placeholder="输入姓名里的一两个字，比如 李"
      style="max-width: 320px"
    />
    <ul class="list">
      <li
        v-for="item in students"
        :key="item.id"
        v-highlight="keyword"
        class="list__item"
      >
        <span class="list__name">{{ item.name }}</span>
        <span class="list__class">{{ item.className }}</span>
      </li>
    </ul>

    <h4 class="practice__subtitle">指令对象里能拿到什么</h4>
    <table class="api">
      <thead>
        <tr>
          <th>钩子</th>
          <th>什么时候执行</th>
          <th>常见用途</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>mounted</code></td>
          <td>元素挂载到页面之后</td>
          <td>聚焦、绑定原生事件、初始化第三方插件</td>
        </tr>
        <tr>
          <td><code>updated</code></td>
          <td>包含它的组件更新之后</td>
          <td>数据变化后重新调整 DOM，比如重新上色</td>
        </tr>
        <tr>
          <td><code>beforeUnmount</code></td>
          <td>元素被移除之前</td>
          <td>清掉自己绑的原生事件监听</td>
        </tr>
      </tbody>
    </table>

    <div class="signature">
      两个参数：<code>el</code> 是元素本身（挂在组件上时是组件根元素），<code
        >binding.value</code
      >
      是等号后面传进来的值。
    </div>

    <el-alert type="info" :closable="false" show-icon class="practice__note">
      <template #title>需要全局复用就注册到 app 上</template>
      在 main.js 里写
      <code>app.directive("focus", { mounted(el) { el.focus() } })</code
      >，任何组件都能直接用 v-focus。只在当前组件用的话，像本页这样在 script
      setup 里声明就够了。
    </el-alert>
  </div>
</template>

<style scoped>
.practice__row {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.practice__hint {
  font-size: 13px;
  color: #909399;
}

.list {
  margin: 12px 0 20px;
  padding: 0;
  list-style: none;
  max-width: 420px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
}

.list__item {
  display: flex;
  justify-content: space-between;
  padding: 10px 14px;
  font-size: 14px;
  border-bottom: 1px solid #f2f3f5;
  transition: background-color 0.2s;
}

.list__item:last-child {
  border-bottom: none;
}

.list__name {
  color: #303133;
}

.list__class {
  color: #909399;
  font-size: 13px;
}

.api {
  width: 100%;
  max-width: 700px;
  border-collapse: collapse;
  font-size: 13px;
}

.api th,
.api td {
  padding: 8px 10px;
  border: 1px solid #e4e7ed;
  text-align: left;
}

.api th {
  background: #fafafa;
  color: #303133;
}

.api td {
  color: #606266;
}

.signature {
  margin-top: 12px;
  font-size: 13px;
  color: #606266;
  line-height: 1.9;
}

code {
  padding: 1px 5px;
  border-radius: 4px;
  background: #f5f7fa;
  color: #c7254e;
  font-size: 12px;
}

.practice__subtitle {
  margin: 20px 0 10px;
  font-size: 14px;
  color: #303133;
}
</style>
