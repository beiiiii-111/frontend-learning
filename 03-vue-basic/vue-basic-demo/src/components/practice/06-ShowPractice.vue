<script setup>
import { ref } from "vue";

// 两块面板各自记录当前显示的是哪一个，左右两侧互不影响
const showTab = ref("info");
const ifTab = ref("info");
</script>

<template>
  <div class="practice">
    <h3 class="practice__title">v-show：切来切去也不丢内容的选项卡</h3>
    <p class="practice__desc">
      左右两边做同一件事，左边用 v-show，右边用
      v-if。在输入框里随手打几个字，切到另一页再切回来，看两边的差别。
    </p>

    <div class="compare">
      <div class="compare__item">
        <div class="compare__head">v-show：只切换 display</div>
        <el-radio-group v-model="showTab" size="small" class="compare__tabs">
          <el-radio-button value="info">基本信息</el-radio-button>
          <el-radio-button value="contact">联系方式</el-radio-button>
        </el-radio-group>

        <div v-show="showTab === 'info'" class="panel">
          <p class="panel__label">昵称（这里故意没加 v-model）</p>
          <el-input placeholder="输入几个字，然后切到另一页" />
          <p class="panel__hint">
            切回来时文字还在，因为元素从头到尾没被销毁过。
          </p>
        </div>

        <div v-show="showTab === 'contact'" class="panel">
          <p class="panel__label">手机号（这里故意没加 v-model）</p>
          <el-input placeholder="输入几个字，然后切回上一页" />
          <p class="panel__hint">
            两个面板同时存在于页面里，只是有一个被隐藏了。
          </p>
        </div>
      </div>

      <div class="compare__item">
        <div class="compare__head compare__head--warn">v-if：创建与销毁</div>
        <el-radio-group v-model="ifTab" size="small" class="compare__tabs">
          <el-radio-button value="info">基本信息</el-radio-button>
          <el-radio-button value="contact">联系方式</el-radio-button>
        </el-radio-group>

        <div v-if="ifTab === 'info'" class="panel">
          <p class="panel__label">昵称（这里故意没加 v-model）</p>
          <el-input placeholder="输入几个字，然后切到另一页" />
          <p class="panel__hint">
            切回来时文字没了，因为元素被销毁又重新创建。
          </p>
        </div>

        <div v-else class="panel">
          <p class="panel__label">手机号（这里故意没加 v-model）</p>
          <el-input placeholder="输入几个字，然后切回上一页" />
          <p class="panel__hint">
            切走的那一刻，原来的表单整个从页面里消失了。
          </p>
        </div>
      </div>
    </div>

    <h4 class="practice__subtitle">怎么选</h4>
    <table class="choice">
      <thead>
        <tr>
          <th>对比项</th>
          <th>v-if</th>
          <th>v-show</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>做了什么</td>
          <td>真的创建或销毁元素</td>
          <td>只是加上 <code>display: none</code></td>
        </tr>
        <tr>
          <td>切换开销</td>
          <td>高，元素要多经历一次创建流程</td>
          <td>低，改一个样式就够了</td>
        </tr>
        <tr>
          <td>初始开销</td>
          <td>低，条件不成立就不渲染</td>
          <td>高，一开始就全部渲染出来</td>
        </tr>
        <tr>
          <td>元素状态</td>
          <td>会丢失</td>
          <td>保留</td>
        </tr>
        <tr>
          <td>典型场景</td>
          <td>切换不频繁：弹窗、权限区域、错误提示</td>
          <td>切换很频繁：选项卡、折叠面板</td>
        </tr>
      </tbody>
    </table>

    <el-alert type="info" :closable="false" show-icon class="practice__note">
      <template #title>可以在浏览器里直接验证</template>
      右键选择「检查」，把两个区域都展开看：v-show 那一侧被隐藏的面板还在 DOM
      里，v-if 那一侧被切走的已经查不到了。
    </el-alert>
  </div>
</template>

<style scoped>
.compare {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.compare__item {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 14px;
  background: #fff;
}

.compare__head {
  font-size: 13px;
  font-weight: 600;
  color: #409eff;
  margin-bottom: 10px;
}

.compare__head--warn {
  color: #e6a23c;
}

.compare__tabs {
  margin-bottom: 12px;
}

.panel__label {
  margin: 0 0 8px;
  font-size: 13px;
  color: #606266;
}

.panel__hint {
  margin: 8px 0 0;
  font-size: 12px;
  color: #909399;
}

.choice {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.choice th,
.choice td {
  padding: 8px 10px;
  border: 1px solid #e4e7ed;
  text-align: left;
}

.choice th {
  background: #fafafa;
  color: #303133;
}

.choice td {
  color: #606266;
}

.choice code {
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
