<script setup>
import { ref } from "vue";

// 当前登录状态：三种取值对应三种提示，切换时互相排斥
const role = ref("guest");

// 后台返回的待办数量，用来决定提示条里显示什么
const todoCount = ref(3);
</script>

<template>
  <div class="practice">
    <h3 class="practice__title">v-if / v-else-if / v-else：三种身份提示条</h3>
    <p class="practice__desc">
      三种身份互斥，正好用一条判断链表达：谁的条件先成立，就只渲染谁。
    </p>

    <el-radio-group v-model="role" class="practice__toolbar">
      <el-radio-button value="guest">未登录</el-radio-button>
      <el-radio-button value="member">会员</el-radio-button>
      <el-radio-button value="admin">管理员</el-radio-button>
    </el-radio-group>

    <!-- 一条完整的判断链：v-if 开头，v-else-if 递进，v-else 兜底 -->
    <div v-if="role === 'guest'" class="tip tip--gray">
      <span class="tip__title">还没有登录</span>
      <span>登录后可以查看课程资料、提交实训作业。</span>
    </div>

    <div v-else-if="role === 'member'" class="tip tip--blue">
      <span class="tip__title">欢迎回来，李明</span>
      <span>你有 {{ todoCount }} 个待办任务，最近一次登录在昨天。</span>
    </div>

    <div v-else class="tip tip--gold">
      <span class="tip__title">管理员权限</span>
      <span>可以审批作业、导出成绩表、管理班级成员。</span>
    </div>

    <h4 class="practice__subtitle">判断链的执行顺序</h4>
    <table class="chain">
      <thead>
        <tr>
          <th>顺序</th>
          <th>写法</th>
          <th>当前条件</th>
          <th>结果</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td><code>v-if</code></td>
          <td><code>role === 'guest'</code></td>
          <td>成立就渲染，后面全部跳过</td>
        </tr>
        <tr>
          <td>2</td>
          <td><code>v-else-if</code></td>
          <td><code>role === 'member'</code></td>
          <td>第一条不成立时才会被检查</td>
        </tr>
        <tr>
          <td>3</td>
          <td><code>v-else</code></td>
          <td>没有条件</td>
          <td>前面都不成立时才轮到它</td>
        </tr>
      </tbody>
    </table>

    <el-alert type="warning" :closable="false" show-icon class="practice__note">
      <template #title>三个独立的 v-if 会同时渲染</template>
      如果把后两块也写成
      <code>v-if</code
      >，当条件同时成立时页面上会出现好几条提示。互斥的分支要串成一条链，中间不能插入别的元素。
    </el-alert>
  </div>
</template>

<style scoped>
.practice__toolbar {
  margin-bottom: 16px;
}

.tip {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 8px;
  font-size: 14px;
  max-width: 640px;
  border-left: 4px solid transparent;
}

.tip__title {
  font-weight: 600;
}

.tip--gray {
  color: #303133;
  background: #f4f4f5;
  border-left-color: #303133;
}

.tip--blue {
  color: #1f6feb;
  background: #ecf5ff;
  border-left-color: #409eff;
}

.tip--gold {
  color: #a06a12;
  background: #fdf6ec;
  border-left-color: #e6a23c;
}

.chain {
  width: 100%;
  max-width: 640px;
  border-collapse: collapse;
  font-size: 13px;
}

.chain th,
.chain td {
  padding: 8px 10px;
  border: 1px solid #e4e7ed;
  text-align: left;
}

.chain th {
  background: #fafafa;
  color: #303133;
  font-weight: 600;
}

.chain td {
  color: #303133;
}

.chain code {
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
