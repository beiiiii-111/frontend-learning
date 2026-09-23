<script setup>
import { ref } from "vue";

function now() {
  const d = new Date();
  return (
    String(d.getHours()).padStart(2, "0") +
    ":" +
    String(d.getMinutes()).padStart(2, "0") +
    ":" +
    String(d.getSeconds()).padStart(2, "0")
  );
}

// 一个会变的响应式数据：点按钮就刷新成最新时间
const clock = ref(now());

function refresh() {
  clock.value = now();
}

// 页脚里的备案号、客服电话这类内容永远不变
const footer = {
  company: "南京某某科技有限公司",
  service: "400-000-0000",
  since: "2019",
};
</script>

<template>
  <div class="practice">
    <h3 class="practice__title">v-once：只渲染一次的内容</h3>
    <p class="practice__desc">
      点下面的按钮让数据变化，对比一下两个区域：加了 v-once
      的那块永远停在第一次渲染的结果上。
    </p>

    <el-button type="primary" @click="refresh">刷新时间</el-button>

    <div class="once-box">
      <div class="once-box__col">
        <div class="once-box__head">普通插值</div>
        <div class="once-box__body">{{ clock }}</div>
        <div class="once-box__foot">每次数据变化都重新渲染</div>
      </div>

      <div class="once-box__col">
        <div class="once-box__head">加了 v-once</div>
        <div class="once-box__body" v-once>{{ clock }}</div>
        <div class="once-box__foot">只渲染这一次，之后不再更新</div>
      </div>
    </div>

    <h4 class="practice__subtitle">适用场合</h4>
    <div class="once-box">
      <div class="once-box__col">
        <div class="once-box__head">页脚信息（静态）</div>
        <div class="once-box__body once-box__body--left" v-once>
          <div>{{ footer.company }}</div>
          <div>客服电话 {{ footer.service }}</div>
          <div>成立于 {{ footer.since }} 年</div>
        </div>
      </div>

      <div class="once-box__col">
        <div class="once-box__head">说明</div>
        <div class="once-box__body once-box__body--left">
          <p>
            v-once
            加在元素上，元素本身和它内部的所有内容都只参加第一次渲染，后续更新直接跳过。
          </p>
          <p>
            它换来的是极小的性能收益，只适合从头到尾都不会变的内容，比如备案号、公司简介、协议正文。
            判断错把会变的数据放进去，页面就会停在旧数据上再也不更新。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.once-box {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
  margin: 16px 0;
}

.once-box__col {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.once-box__head {
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 600;
  color: #409eff;
  background: #ecf5ff;
}

.once-box__body {
  min-height: 56px;
  padding: 14px 12px;
  font-size: 18px;
  color: #303133;
  text-align: center;
  font-family: Menlo, Consolas, monospace;
}

.once-box__body--left {
  font-size: 13px;
  line-height: 1.8;
  text-align: left;
  font-family: inherit;
  color: #606266;
}

.once-box__body--left p {
  margin: 0 0 8px;
}

.once-box__foot {
  padding: 8px 12px;
  font-size: 12px;
  color: #909399;
  border-top: 1px dashed #ebeef5;
}

.practice__subtitle {
  margin: 20px 0 0;
  font-size: 14px;
  color: #303133;
}
</style>
