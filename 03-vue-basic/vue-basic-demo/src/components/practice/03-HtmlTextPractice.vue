<script setup>
import { ref } from "vue";

// 一段带标签的富文本，模拟从后台拿回来的公告内容
const notice = ref(
  "<b>实训动员通知</b>：本周五 14:00 在 A301 教室集合，请携带<b>笔记本电脑</b>与校园卡。",
);

// 自定义内容：用来观察三种插值方式对标签的处理差别
const custom = ref(
  '<img src="https://x.invalid/a.png" alt="我是被 v-html 插入的图片" width="120">',
);
</script>

<template>
  <div class="practice">
    <h3 class="practice__title">v-html 与 v-text：公告栏里的富文本</h3>
    <p class="practice__desc">
      同样一段带标签的字符串，三种插入方式的结果完全不同。
    </p>

    <div class="compare">
      <div class="compare__item">
        <div class="compare__head">双大括号插值</div>
        <div class="compare__body">{{ notice }}</div>
        <div class="compare__foot">标签被当成普通文字显示</div>
      </div>

      <div class="compare__item">
        <div class="compare__head">v-text</div>
        <div class="compare__body" v-text="notice"></div>
        <div class="compare__foot">
          和插值一样不解析标签，但会覆盖元素原有内容
        </div>
      </div>

      <div class="compare__item">
        <div class="compare__head">v-html</div>
        <div class="compare__body" v-html="notice"></div>
        <div class="compare__foot">标签被真正解析，文字加粗了</div>
      </div>
    </div>

    <h4 class="practice__subtitle">自己改改看</h4>
    <el-input
      v-model="custom"
      type="textarea"
      :rows="2"
      placeholder="在这里输入一段带标签的内容"
    />

    <div class="compare">
      <div class="compare__item">
        <div class="compare__head">v-text 的结果</div>
        <div class="compare__body" v-text="custom"></div>
      </div>

      <div class="compare__item">
        <div class="compare__head">v-html 的结果</div>
        <div class="compare__body" v-html="custom"></div>
      </div>
    </div>

    <el-alert type="warning" :closable="false" show-icon class="practice__note">
      <template #title>v-html 只能用在信得过的内容上</template>
      它会把字符串当成真正的 HTML
      插进页面，里面的标签和事件属性都会生效。如果这段内容来自用户输入或第三方接口，攻击者可以塞进一段脚本偷走登录状态，这就是
      XSS 攻击。用户提交的内容一律用插值或 v-text 输出。
    </el-alert>
  </div>
</template>

<style scoped>
.compare {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
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
  min-height: 64px;
  padding: 12px;
  font-size: 14px;
  line-height: 1.7;
  color: #303133;
  word-break: break-all;
}

.compare__foot {
  padding: 8px 12px;
  font-size: 12px;
  color: #909399;
  border-top: 1px dashed #ebeef5;
}

.practice__subtitle {
  margin: 20px 0 10px;
  font-size: 14px;
  color: #303133;
}
</style>
