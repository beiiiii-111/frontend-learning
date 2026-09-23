<script setup>
import { ref } from "vue";

// 十行数据，用来观察哪些行真的重新渲染了
const students = ref([
  { id: 1, name: "李明", className: "软件 2301", score: 92 },
  { id: 2, name: "王小雨", className: "软件 2301", score: 88 },
  { id: 3, name: "陈超", className: "软件 2302", score: 76 },
  { id: 4, name: "张梦琪", className: "软件 2302", score: 95 },
  { id: 5, name: "李思远", className: "网络 2301", score: 81 },
  { id: 6, name: "赵倩", className: "网络 2301", score: 69 },
  { id: 7, name: "孙浩然", className: "网络 2302", score: 84 },
  { id: 8, name: "周欣", className: "网络 2302", score: 90 },
]);

// 当前选中行：点击某一行时它才会变
const activeId = ref(1);

// 一个和列表毫无关系的数据，点按钮让它变化，就能观察两边的差异
const noise = ref(0);

// 故意把依赖数组写成空的，用来复现「高亮不更新」的 bug
const wrongDeps = ref(false);

function select(id) {
  activeId.value = id;
}

function bumpNoise() {
  noise.value++;
}

// 返回当前时刻，精确到毫秒，哪个数字变了就说明这一行重新渲染了
function stamp() {
  const d = new Date();
  return (
    String(d.getMinutes()).padStart(2, "0") +
    ":" +
    String(d.getSeconds()).padStart(2, "0") +
    "." +
    String(d.getMilliseconds()).padStart(3, "0")
  );
}
</script>

<template>
  <div class="practice">
    <h3 class="practice__title">v-memo：让没变化的列表项跳过更新</h3>
    <p class="practice__desc">
      每行右边的毫秒数是渲染那一刻打上的时间戳。点行、点按钮，看两边哪些行的时间戳变了。
    </p>

    <div class="practice__toolbar">
      <el-button type="primary" @click="bumpNoise">改动一个无关数据</el-button>
      <!-- 这个数字直接写在当前组件的模板里，它一变整个组件就会重新渲染 -->
      <span class="hint">无关数据的当前值：{{ noise }}</span>
      <el-switch v-model="wrongDeps" active-text="故意把依赖数组写空" />
    </div>

    <div class="layout">
      <div class="layout__col">
        <div class="layout__head">左边：加了 v-memo</div>
        <ul class="rows">
          <!-- 依赖数组里放的是「这一行的高亮状态」，只有它变了才更新 -->
          <li
            v-for="item in students"
            :key="item.id"
            v-memo="wrongDeps ? [] : [item.id === activeId]"
            :class="['row', item.id === activeId ? 'row--active' : '']"
            @click="select(item.id)"
          >
            <span class="row__name">{{ item.name }}</span>
            <span class="row__cls">{{ item.className }}</span>
            <span class="row__score">{{ item.score }}</span>
            <span class="row__stamp">{{ stamp() }}</span>
          </li>
        </ul>
      </div>

      <div class="layout__col">
        <div class="layout__head layout__head--warn">右边：没有 v-memo</div>
        <ul class="rows">
          <li
            v-for="item in students"
            :key="item.id"
            :class="['row', item.id === activeId ? 'row--active' : '']"
            @click="select(item.id)"
          >
            <span class="row__name">{{ item.name }}</span>
            <span class="row__cls">{{ item.className }}</span>
            <span class="row__score">{{ item.score }}</span>
            <span class="row__stamp">{{ stamp() }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="practice__log">
      操作建议：先点某一行，再看点「改动一个无关数据」。左边只有受影响的两行换了时间戳，右边整张列表都换了。
    </div>

    <el-alert type="warning" :closable="false" show-icon class="practice__note">
      <template #title>依赖数组必须写全</template>
      把开关打开，右侧的依赖数组就变成空数组了，此时点别的行高亮不会再移动 ——
      这正是 v-memo 用错时最常见的现象。凡是会影响这一段 DOM
      的响应式数据，都要写进数组里。
    </el-alert>
  </div>
</template>

<style scoped>
.practice__toolbar {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.hint {
  font-size: 13px;
  color: #909399;
}

.layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.layout__head {
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 600;
  color: #409eff;
  background: #ecf5ff;
  border-radius: 8px 8px 0 0;
}

.layout__head--warn {
  color: #e6a23c;
  background: #fdf6ec;
}

.rows {
  margin: 0;
  padding: 0;
  list-style: none;
  border: 1px solid #e4e7ed;
  border-top: none;
  border-radius: 0 0 8px 8px;
  overflow: hidden;
  background: #fff;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr 40px 80px;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  font-size: 13px;
  border-bottom: 1px solid #f2f3f5;
  cursor: pointer;
}

.row:last-child {
  border-bottom: none;
}

.row--active {
  background: #ecf5ff;
  box-shadow: inset 3px 0 0 #409eff;
}

.row__name {
  color: #303133;
}

.row__cls {
  color: #909399;
}

.row__score {
  color: #f56c6c;
  text-align: right;
}

.row__stamp {
  color: #c0c4cc;
  font-family: Menlo, Consolas, monospace;
  font-size: 12px;
  text-align: right;
}

.practice__log {
  margin-top: 16px;
  padding: 10px 14px;
  border-radius: 8px;
  background: #f5f7fa;
  font-size: 13px;
  color: #303133;
  max-width: 760px;
  line-height: 1.7;
}
</style>
