<script setup>
import { ref } from "vue";

// 换一次 key，两个 iframe 就会被重新创建，重新走一遍加载与挂载过程
const reloadKey = ref(0);

function reload() {
  reloadKey.value++;
}
</script>

<template>
  <div class="practice">
    <h3 class="practice__title">v-cloak：挂载完成前先把模板藏起来</h3>
    <p class="practice__desc">
      这个指令只在用 CDN 引入 Vue
      的项目里有意义。下面两个小窗口在演示同一件事，都模拟了「1.2
      秒后才拿到数据」，点按钮可以让它们重新加载。
    </p>

    <el-button type="primary" @click="reload">重新加载两个窗口</el-button>

    <div class="compare">
      <div class="compare__item">
        <div class="compare__head">加了 v-cloak</div>
        <iframe
          :key="'cloak-' + reloadKey"
          class="frame"
          src="/v-cloak-demo.html?mode=cloak"
          title="带 v-cloak 的演示"
        ></iframe>
        <div class="compare__foot">
          挂载前整个区域隐藏，等渲染完成才出现，过程中看不到原始模板
        </div>
      </div>

      <div class="compare__item">
        <div class="compare__head compare__head--warn">不加 v-cloak</div>
        <iframe
          :key="'raw-' + reloadKey"
          class="frame"
          src="/v-cloak-demo.html?mode=raw"
          title="没有 v-cloak 的演示"
        ></iframe>
        <div class="compare__foot">
          挂载前会先闪出一段没被替换的双大括号原始模板，随后才变成真实内容
        </div>
      </div>
    </div>

    <h4 class="practice__subtitle">用起来只写两处</h4>
    <div class="code-pair">
      <div class="code-pair__item">
        <div class="code-pair__head">页面里的挂载点</div>
        <pre class="code">
&lt;div id="app" v-cloak&gt;
  &lt;p&gt;你好&lt;/p&gt;
&lt;/div&gt;</pre
        >
      </div>
      <div class="code-pair__item">
        <div class="code-pair__head">样式表里的配套规则</div>
        <pre class="code">
[v-cloak] {
  display: none;
}</pre
        >
      </div>
    </div>

    <p class="practice__desc">
      原理很朴素：v-cloak 只是往挂载点上挂了一个同名属性，Vue
      挂载完成后会把这个属性删掉。真正让元素隐身的是样式表里那条属性选择器，所以样式千万不能漏写
      —— 漏了就等于没加指令。
    </p>

    <el-alert type="info" :closable="false" show-icon class="practice__note">
      <template #title>用打包工具的项目不需要它</template>
      本练习册所在的工程用 Vite
      构建，模板在打包阶段就编译成了渲染函数，页面加载时根本不存在「没被替换的双大括号」这个中间状态，所以
      index.html 里不需要加 v-cloak。用 CDN 直接引入 vue.global.js
      的老项目才会遇到闪烁问题。
    </el-alert>
  </div>
</template>

<style scoped>
.compare {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
  margin: 16px 0 20px;
}

.compare__item {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.compare__head {
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 600;
  color: #409eff;
  background: #ecf5ff;
}

.compare__head--warn {
  color: #e6a23c;
  background: #fdf6ec;
}

.frame {
  display: block;
  width: 100%;
  height: 170px;
  border: none;
  border-bottom: 1px dashed #ebeef5;
}

.compare__foot {
  padding: 8px 12px;
  font-size: 12px;
  line-height: 1.7;
  color: #303133;
}

.code-pair {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 14px;
}

.code-pair__head {
  font-size: 13px;
  color: #303133;
  margin-bottom: 6px;
}

.code {
  margin: 0;
  padding: 10px 12px;
  border-radius: 8px;
  background: #f5f7fa;
  color: #303133;
  font-size: 12px;
  line-height: 1.8;
  overflow-x: auto;
}

.practice__subtitle {
  margin: 20px 0 10px;
  font-size: 14px;
  color: #303133;
}
</style>
