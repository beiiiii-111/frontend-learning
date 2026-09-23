<script setup>
import { ref } from "vue";

// 用来对照：普通插值会把这里的内容替换成数据里的值
const message = ref("这句话来自数据");
const count = ref(0);
</script>

<template>
  <div class="practice">
    <h3 class="practice__title">v-pre：把模板语法当普通文字显示</h3>
    <p class="practice__desc">
      写教程、写接口文档时经常需要把模板语法原样展示出来，加了 v-pre
      的元素内部不会被编译。
    </p>

    <div class="compare">
      <div class="compare__item">
        <div class="compare__head">没人管：正常编译</div>
        <div class="compare__body">
          <p>{{ message }}</p>
          <p>
            当前计数 {{ count }}，点这里试试：<span
              class="fake-link"
              @click="count++"
              >点我加一</span
            >
          </p>
        </div>
        <div class="compare__foot">插值被替换成数据，点击也能生效</div>
      </div>

      <div class="compare__item">
        <div class="compare__head">加了 v-pre：跳过编译</div>
        <!-- 下面这整块不会进入编译流程，双大括号和事件绑定都原样显示 -->
        <div class="compare__body compare__body--pre" v-pre>
          <p>{{ message }}</p>
          <p>
            当前计数 {{ count }}，点这里试试：<span class="fake-link"
              >点我加一</span
            >
          </p>
        </div>
        <div class="compare__foot">文字原样输出，点击也没有任何反应</div>
      </div>
    </div>

    <h4 class="practice__subtitle">它管不了 HTML 标签</h4>
    <p class="practice__desc">
      v-pre 只跳过 Vue 的编译，浏览器解析 HTML
      的规则不受它影响。所以在预格式化的代码块里，标签还是要写成实体字符。
    </p>

    <pre v-pre class="code">
&lt;div v-for="item in list" :key="item.id"&gt;
  &lt;span&gt;{{ item.name }}&lt;/span&gt;
&lt;/div&gt;</pre
    >

    <p class="practice__desc">
      上面这段原文里，标签部分写的是
      <code>&amp;lt;</code> 转义，而双大括号可以照原样写。
    </p>

    <h4 class="practice__subtitle">和 v-html 的区别</h4>
    <table class="api">
      <thead>
        <tr>
          <th>指令</th>
          <th>做法</th>
          <th>典型用途</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>v-pre</code></td>
          <td>跳过编译，内容原样显示</td>
          <td>展示模板语法、示例代码</td>
        </tr>
        <tr>
          <td><code>v-html</code></td>
          <td>把字符串当 HTML 解析并插入页面</td>
          <td>渲染后台返回的富文本公告</td>
        </tr>
      </tbody>
    </table>

    <el-alert type="info" :closable="false" show-icon class="practice__note">
      <template #title>顺带的性能作用</template>
      加了 v-pre
      的节点在编译阶段会被整块跳过，元素多、内容纯静态的页面可以少生成一些编译产物。收益很小，主要价值还是「让模板语法原样显示」。
    </el-alert>
  </div>
</template>

<style scoped>
.compare {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 14px;
  margin-bottom: 16px;
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

.compare__body {
  padding: 12px;
  font-size: 14px;
  line-height: 1.9;
  color: #303133;
}

.compare__body--pre {
  color: #909399;
  font-family: Menlo, Consolas, monospace;
  font-size: 13px;
}

.compare__body p {
  margin: 0 0 6px;
}

.fake-link {
  color: #409eff;
  cursor: pointer;
}

.compare__foot {
  padding: 8px 12px;
  font-size: 12px;
  color: #909399;
  border-top: 1px dashed #ebeef5;
}

.code {
  margin: 0 0 12px;
  padding: 12px 14px;
  border-radius: 8px;
  background: #f5f7fa;
  color: #303133;
  font-size: 12.5px;
  line-height: 1.9;
  overflow-x: auto;
}

.api {
  width: 100%;
  max-width: 620px;
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
