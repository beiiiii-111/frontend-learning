<script setup>
import { ref } from "vue";

// 一、数据源：学生数组。视图切换只改变怎么显示，不改变这份数据
// 这份数据从头到尾不会被修改，所以用普通数组就够了，不用 ref
const students = [
  {
    id: "20230101",
    name: "林一鸣",
    className: "软件 2301",
    direction: "前端开发",
    score: 92,
    status: "active",
  },
  {
    id: "20230102",
    name: "周予安",
    className: "软件 2301",
    direction: "后端开发",
    score: 85,
    status: "active",
  },
  {
    id: "20230103",
    name: "苏晚晴",
    className: "软件 2302",
    direction: "前端开发",
    score: 78,
    status: "intern",
  },
  {
    id: "20230104",
    name: "陈砚舟",
    className: "软件 2302",
    direction: "数据开发",
    score: 64,
    status: "leave",
  },
  {
    id: "20230105",
    name: "顾星野",
    className: "软件 2302",
    direction: "后端开发",
    score: 88,
    status: "active",
  },
  {
    id: "20230106",
    name: "许知微",
    className: "软件 2303",
    direction: "测试开发",
    score: 71,
    status: "intern",
  },
  {
    id: "20230107",
    name: "沈墨白",
    className: "软件 2303",
    direction: "前端开发",
    score: 95,
    status: "active",
  },
  {
    id: "20230108",
    name: "叶清和",
    className: "软件 2303",
    direction: "数据开发",
    score: 59,
    status: "leave",
  },
];

// 二、视图模式：table / card / group / list，模板里按它做 v-if 分支
const viewMode = ref("table");

// 三、状态字典：数据和文案分开写，模板里只做映射
const STATUS_MAP = {
  active: { text: "在读", type: "success" },
  intern: { text: "实习中", type: "warning" },
  leave: { text: "休学", type: "info" },
};

// 四、成绩颜色：普通函数，传入分数返回颜色
function scoreColor(score) {
  if (score >= 85) return "#0f9d58";
  if (score >= 70) return "#e6a23c";
  return "#f56c6c";
}

// 五、专业分组：把同一方向的人归到一起。
// 分组结果跟着「只看及格」变，所以用 ref 包起来；归类只用最普通的 for 循环，
// 不用还没学到的 filter / reduce，也不需要用 computed
const DIRECTIONS = ["前端开发", "后端开发", "数据开发", "测试开发"];

function buildGroups(list) {
  const groups = [];
  for (const direction of DIRECTIONS) {
    const members = [];
    for (const item of list) {
      if (item.direction === direction) members.push(item);
    }
    groups.push({ direction, members });
  }
  return groups;
}

// 六、延伸练习 1：只看及格开关。
// 现在页面上有两处会变：当前视图 + 是否只看及格，各占一个 ref。
// 显示用的数组单独用一个 ref 存，开关一拨就换成新的数组
const onlyPass = ref(false);
const displayStudents = ref([...students]);
const groupedStudents = ref(buildGroups(students));

function handlePassChange(passOnly) {
  const list = [];
  for (const item of students) {
    if (!passOnly || item.score >= 60) list.push(item);
  }
  displayStudents.value = list;
  groupedStudents.value = buildGroups(list);
}

// 七、延伸练习 2：查看详情对话框。
// 一个 ref 存当前选中的学生，一个 ref 控制对话框开和关
const currentStudent = ref(null);
const dialogVisible = ref(false);

function showDetail(student) {
  currentStudent.value = student;
  dialogVisible.value = true;
}
</script>

<template>
  <div class="page">
    <header class="page__head">
      <div>
        <h2 class="page__title">学生名单</h2>
        <p class="page__desc">
          共 {{ displayStudents.length }} 人 · 切换视图用的是 v-if / v-else-if / v-else
        </p>
      </div>

      <div class="page__controls">
        <!-- 视图切换：viewMode 一变，模板自动在几个分支之间换 -->
        <el-radio-group v-model="viewMode">
          <el-radio-button value="table">表格</el-radio-button>
          <el-radio-button value="card">卡片</el-radio-button>
          <el-radio-button value="group">专业分组</el-radio-button>
          <el-radio-button value="list">名单</el-radio-button>
        </el-radio-group>

        <!-- 延伸练习：只看及格。开关一拨，handlePassChange 换一个新的显示数组 -->
        <el-switch
          v-model="onlyPass"
          active-text="只看及格"
          @change="handlePassChange"
        />
      </div>
    </header>

    <!-- ===== 条件渲染：下面四块同一时间只会出现一块 ===== -->

    <!-- 第一块：表格模式 -->
    <el-table v-if="viewMode === 'table'" :data="displayStudents" stripe border>
      <el-table-column prop="id" label="学号" width="120" />
      <el-table-column prop="name" label="姓名" width="110" />
      <el-table-column prop="className" label="班级" width="120" />
      <el-table-column prop="direction" label="方向" />
      <el-table-column prop="score" label="成绩" width="100" sortable>
        <template #default="scope">
          <span class="score" :style="{ color: scoreColor(scope.row.score) }">{{
            scope.row.score
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="110">
        <template #default="scope">
          <el-tag :type="STATUS_MAP[scope.row.status].type" effect="light">
            {{ STATUS_MAP[scope.row.status].text }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="90">
        <template #default="scope">
          <el-button link type="primary" @click="showDetail(scope.row)"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 第二块：卡片模式 -->
    <el-row v-else-if="viewMode === 'card'" :gutter="16">
      <el-col
        v-for="item in displayStudents"
        :key="item.id"
        :xs="24"
        :sm="12"
        :md="8"
        class="card-col"
      >
        <el-card shadow="hover" class="stu-card">
          <div class="stu-card__top">
            <el-avatar :size="48" class="avatar">{{
              item.name.charAt(0)
            }}</el-avatar>
            <div>
              <p class="stu-card__name">{{ item.name }}</p>
              <p class="stu-card__id">{{ item.id }} · {{ item.className }}</p>
            </div>
          </div>

          <div class="stu-card__tags">
            <el-tag size="small" effect="plain">{{ item.direction }}</el-tag>
            <el-tag size="small" :type="STATUS_MAP[item.status].type" effect="light">
              {{ STATUS_MAP[item.status].text }}
            </el-tag>
          </div>

          <p class="stu-card__score">成绩 {{ item.score }}</p>
          <el-progress
            :percentage="item.score"
            :color="scoreColor(item.score)"
            :stroke-width="8"
            :show-text="false"
          />

          <template #footer>
            <el-button link type="primary" @click="showDetail(item)"
              >查看详情</el-button
            >
          </template>
        </el-card>
      </el-col>
    </el-row>

    <!-- 第三块：专业分组模式（延伸练习：在判断链上再加一个 v-else-if 分支） -->
    <div v-else-if="viewMode === 'group'" class="group-wrap">
      <!-- 没有人的方向直接不显示：外层 template 负责循环，内层元素才放 v-if -->
      <template v-for="group in groupedStudents" :key="group.direction">
        <section v-if="group.members.length" class="group">
        <h3 class="group__title">
          {{ group.direction }}
          <span class="group__count">{{ group.members.length }} 人</span>
        </h3>

        <ul class="group__list">
          <li v-for="item in group.members" :key="item.id" class="group__item">
            <el-avatar :size="32" class="avatar">{{
              item.name.charAt(0)
            }}</el-avatar>
            <span class="group__name">{{ item.name }}</span>
            <span class="group__meta">{{ item.id }} · {{ item.className }}</span>
            <span class="score" :style="{ color: scoreColor(item.score) }">{{
              item.score
            }}</span>
            <el-tag size="small" :type="STATUS_MAP[item.status].type" effect="light">
              {{ STATUS_MAP[item.status].text }}
            </el-tag>
          </li>
        </ul>
        </section>
      </template>
    </div>

    <!-- 第四块：名单模式，一行一人，人多了用这个（v-else 兜底，不写条件） -->
    <ul v-else class="name-list">
      <li v-for="item in displayStudents" :key="item.id" class="name-list__item">
        <el-avatar :size="32" class="avatar">{{ item.name.charAt(0) }}</el-avatar>
        <span class="name-list__name">{{ item.name }}</span>
        <span class="name-list__meta"
          >{{ item.id }} · {{ item.className }} · {{ item.direction }}</span
        >
        <span class="score" :style="{ color: scoreColor(item.score) }">{{
          item.score
        }}</span>
        <el-tag size="small" :type="STATUS_MAP[item.status].type" effect="light">
          {{ STATUS_MAP[item.status].text }}
        </el-tag>
      </li>
    </ul>

    <!-- 延伸练习：查看详情对话框。dialogVisible 一变真就弹出 / 关闭 -->
    <el-dialog
      v-model="dialogVisible"
      :title="currentStudent ? currentStudent.name + ' · 详细信息' : '详细信息'"
      width="420"
    >
      <el-descriptions v-if="currentStudent" :column="1" border>
        <el-descriptions-item label="学号">{{ currentStudent.id }}</el-descriptions-item>
        <el-descriptions-item label="姓名">{{ currentStudent.name }}</el-descriptions-item>
        <el-descriptions-item label="班级">{{ currentStudent.className }}</el-descriptions-item>
        <el-descriptions-item label="方向">{{ currentStudent.direction }}</el-descriptions-item>
        <el-descriptions-item label="成绩">
          <span class="score" :style="{ color: scoreColor(currentStudent.score) }">
            {{ currentStudent.score }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="STATUS_MAP[currentStudent.status].type" effect="light">
            {{ STATUS_MAP[currentStudent.status].text }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>

      <template #footer>
        <el-button type="primary" @click="dialogVisible = false">知道了</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.page {
  max-width: 1000px;
  margin: 40px auto;
  padding: 0 16px;
}

.page__head {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.page__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}

.page__title {
  margin: 0;
  font-size: 22px;
  color: #1f2329;
}

.page__desc {
  margin: 6px 0 0;
  font-size: 15px;
  color: #4b5563;
}

.score {
  font-weight: 600;
}

.avatar {
  background: #2f6fed;
  color: #fff;
}

/* 卡片模式 */
.card-col {
  margin-bottom: 16px;
}

.stu-card__top {
  display: flex;
  gap: 12px;
  align-items: center;
}

.stu-card__name {
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  color: #1f2329;
}

.stu-card__id {
  margin: 4px 0 0;
  font-size: 13px;
  color: #4b5563;
}

.stu-card__tags {
  display: flex;
  gap: 8px;
  margin: 14px 0;
}

.stu-card__score {
  margin: 0 0 6px;
  font-size: 14px;
  color: #374151;
}

/* 专业分组模式 */
.group-wrap {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.group {
  border: 1px solid #ebeef5;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.group__title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 10px 16px;
  font-size: 15px;
  font-weight: 600;
  color: #1f2329;
  background: #f7f9fc;
  border-bottom: 1px solid #ebeef5;
}

.group__count {
  font-size: 12px;
  font-weight: 400;
  color: #8a919f;
}

.group__list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.group__item {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 10px 16px;
  background: #fff;
  border-bottom: 1px solid #f2f3f5;
}

.group__item:last-child {
  border-bottom: none;
}

.group__item:hover {
  background: #f7f9fc;
}

.group__name {
  width: 80px;
  font-size: 15px;
  font-weight: 600;
  color: #1f2329;
}

.group__meta {
  flex: 1;
  font-size: 14px;
  color: #4b5563;
}

/* 名单模式 */
.name-list {
  margin: 0;
  padding: 0;
  list-style: none;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  overflow: hidden;
}

.name-list__item {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 10px 16px;
  background: #fff;
  border-bottom: 1px solid #f2f3f5;
}

.name-list__item:last-child {
  border-bottom: none;
}

.name-list__item:hover {
  background: #f7f9fc;
}

.name-list__name {
  width: 80px;
  font-size: 15px;
  font-weight: 600;
  color: #1f2329;
}

.name-list__meta {
  flex: 1;
  font-size: 14px;
  color: #4b5563;
}
</style>
