<script setup>
import { onMounted, onUnmounted, reactive, ref } from "vue";

/* ================= 练习 1：回车登录 ================= */

const form = reactive({ account: "", password: "" });
// idle 什么都没发生 | loading 正在登录中 | success 登录成功 | error 校验不通过
const status = ref("idle");
const tipText = ref("");

const PASSWORD_MIN = 6;
const LOGIN_DELAY = 5000; // 题目要求：提示 5 秒后消失
let loginTimer = null;

function submitLogin() {
  if (status.value === "loading") return; // 正在登录中，重复回车直接忽略

  if (form.account.trim() === "") {
    status.value = "error";
    tipText.value = "账号不能为空";
    return;
  }
  if (form.password === "") {
    status.value = "error";
    tipText.value = "密码不能为空";
    return;
  }
  if (form.password.length < PASSWORD_MIN) {
    status.value = "error";
    tipText.value = `密码不能少于 ${PASSWORD_MIN} 位，当前只有 ${form.password.length} 位`;
    return;
  }

  // 校验通过：先给“正在登录中”的提示
  status.value = "loading";
  tipText.value = "正在登录中…";

  // 5 秒后提示消失，换成“xxx 登录成功”
  loginTimer = setTimeout(() => {
    status.value = "success";
    tipText.value = `${form.account} 登录成功`;
    loginTimer = null;
  }, LOGIN_DELAY);
}

/* ================= 练习 2：方向键移动方块 ================= */

const stageRef = ref(null);
const BOX_SIZE = 48; // 方块边长，要跟 CSS 里的宽高保持一致
const STEP = 20; // 每按一次移动的像素
const pos = reactive({ x: 0, y: 0 }); // 方块左上角相对舞台的偏移
const stageSize = reactive({ w: 0, h: 0 }); // 舞台可用区域
const moves = ref(0);
const lastKey = ref("—");
const stageFocused = ref(false); // 舞台有没有拿到焦点，拿到焦点时边框高亮

const DIRECTIONS = {
  ArrowUp: { x: 0, y: -1, label: "↑ 上" },
  ArrowDown: { x: 0, y: 1, label: "↓ 下" },
  ArrowLeft: { x: -1, y: 0, label: "← 左" },
  ArrowRight: { x: 1, y: 0, label: "→ 右" },
};

// 现读舞台尺寸。注意：tab-pane 没激活时元素是 display:none，
// clientWidth 会是 0，这时候不能拿去算边界，否则方块会被算到舞台外面去。
function syncStageSize() {
  const el = stageRef.value;
  if (!el) return false;
  const w = el.clientWidth;
  const h = el.clientHeight;
  if (w === 0 || h === 0) return false;
  stageSize.w = w;
  stageSize.h = h;
  return true;
}

// 把方块放到舞台中间
function centerBox() {
  if (!syncStageSize()) return;
  pos.x = (stageSize.w - BOX_SIZE) / 2;
  pos.y = (stageSize.h - BOX_SIZE) / 2;
}

// 只把方块约束回边界内，不重置位置
function clampToStage() {
  if (!syncStageSize()) return;
  pos.x = Math.min(pos.x, Math.max(0, stageSize.w - BOX_SIZE));
  pos.y = Math.min(pos.y, Math.max(0, stageSize.h - BOX_SIZE));
}

// 点一下舞台，给它焦点（这样方向键一定落在页面里，而不是外层窗口）
function focusStage() {
  syncStageSize();
  stageRef.value && stageRef.value.focus();
}

function handleKeydown(event) {
  const dir = DIRECTIONS[event.key];
  if (!dir) return;

  // 焦点在输入框里时，方向键要留给光标移动，不抢
  if (event.target instanceof HTMLInputElement) return;

  // 切到别的单元时舞台被隐藏，别让方块偷偷跑
  if (stageRef.value && stageRef.value.offsetParent === null) return;

  // 每次按键都重新量一次，尺寸没量到就先不动
  if (!syncStageSize()) return;

  event.preventDefault(); // 阻止方向键滚动页面

  const maxX = Math.max(0, stageSize.w - BOX_SIZE);
  const maxY = Math.max(0, stageSize.h - BOX_SIZE);
  pos.x = Math.min(Math.max(pos.x + dir.x * STEP, 0), maxX);
  pos.y = Math.min(Math.max(pos.y + dir.y * STEP, 0), maxY);

  moves.value++;
  lastKey.value = dir.label;
}

/* ================= 练习 3：鼠标悬停改样式 ================= */

const hovering = ref(false);
const hoverCount = ref(0);

function handleTextEnter() {
  hovering.value = true;
  hoverCount.value++;
}

function handleTextLeave() {
  hovering.value = false;
}

/* ================= 生命周期 ================= */

let stageObserver = null;

onMounted(() => {
  centerBox();
  window.addEventListener("keydown", handleKeydown);
  window.addEventListener("resize", clampToStage);

  // 从别的 tab 切过来时，元素才从 display:none 变成可见、尺寸才算得出来。
  // window 的 resize 不会触发，得靠 ResizeObserver 兜住这一下。
  if (window.ResizeObserver && stageRef.value) {
    stageObserver = new ResizeObserver(() => {
      moves.value === 0 ? centerBox() : clampToStage();
    });
    stageObserver.observe(stageRef.value);
  }
});

onUnmounted(() => {
  clearTimeout(loginTimer); // 定时器一定要清，否则组件走了还在改数据
  window.removeEventListener("keydown", handleKeydown);
  window.removeEventListener("resize", clampToStage);
  stageObserver && stageObserver.disconnect();
});
</script>

<template>
  <div class="practice">
    <h3 class="practice__title">
      事件综合练习：回车登录 / 方向键移动方块 / 悬停变样式
    </h3>
    <p class="practice__desc">
      三小题都是 v-on 的用法：键盘事件（<code>@keyup.enter</code>、<code>keydown</code>）和鼠标事件（<code>@mouseenter</code>
      / <code>@mouseleave</code>）。
    </p>

    <!-- 1. 回车登录 -->
    <section class="practice__block">
      <h4 class="practice__subtitle">
        1. 回车登录（账号、密码都非空，密码不少于 6 位）
      </h4>

      <div class="practice__toolbar">
        <el-input
          v-model="form.account"
          placeholder="账号"
          style="max-width: 200px"
          clearable
          @keyup.enter="submitLogin"
        />
        <el-input
          v-model="form.password"
          type="password"
          show-password
          placeholder="密码（不少于 6 位）"
          style="max-width: 220px"
          @keyup.enter="submitLogin"
        />
        <el-button
          type="primary"
          :loading="status === 'loading'"
          @click="submitLogin"
        >
          登录
        </el-button>
      </div>

      <!-- 正在登录中：5 秒后自动消失 -->
      <el-alert
        v-if="status === 'loading'"
        class="practice__msg"
        type="info"
        :closable="false"
        show-icon
      >
        <template #title>正在登录中…（5 秒后消失）</template>
      </el-alert>

      <el-alert
        v-else-if="status === 'success'"
        class="practice__msg"
        type="success"
        :closable="false"
        show-icon
      >
        <template #title>{{ tipText }}</template>
      </el-alert>

      <el-alert
        v-else-if="status === 'error'"
        class="practice__msg"
        type="error"
        :closable="false"
        show-icon
      >
        <template #title>{{ tipText }}</template>
      </el-alert>

      <div v-else class="practice__log">
        在两个输入框里任意一个按回车，就会触发登录
      </div>
    </section>

    <!-- 2. 方向键移动方块 -->
    <section class="practice__block">
      <h4 class="practice__subtitle">2. 用键盘上下左右箭头控制方块移动</h4>
      <p class="practice__desc">
        ① 先用鼠标点一下下面这块灰色区域（点完边框会变蓝）；② 再按键盘的
        ↑ ↓ ← →。焦点在输入框里时方向键留给光标，方块不会动。
      </p>

      <div
        ref="stageRef"
        class="stage"
        :class="{ 'stage--focused': stageFocused }"
        tabindex="0"
        @click="focusStage"
        @focus="stageFocused = true"
        @blur="stageFocused = false"
      >
        <div
          class="stage__box"
          :style="{ transform: `translate(${pos.x}px, ${pos.y}px)` }"
        ></div>

        <span v-if="moves === 0" class="stage__hint">
          点这里，然后按 ↑ ↓ ← →
        </span>
      </div>

      <div class="practice__log">
        坐标 x = {{ Math.round(pos.x) }}，y = {{ Math.round(pos.y) }} ｜ 最近按键：{{
          lastKey
        }}
        ｜ 已移动 {{ moves }} 次
      </div>
    </section>

    <!-- 3. 悬停变样式 -->
    <section class="practice__block">
      <h4 class="practice__subtitle">
        3. 鼠标移到文本上样式变化，移开恢复原样
      </h4>

      <p
        class="hover-text"
        :class="{ 'hover-text--active': hovering }"
        @mouseenter="handleTextEnter"
        @mouseleave="handleTextLeave"
      >
        把鼠标移到我身上试试
      </p>

      <div class="practice__log">
        mouseenter 触发 {{ hoverCount }} 次 ｜ 当前状态：{{
          hovering ? "鼠标在上面" : "鼠标已离开"
        }}
      </div>
    </section>
  </div>
</template>

<style scoped>
.practice__title {
  font-size: 16px;
  color: #0f172a;
  margin: 0 0 6px;
}

.practice__desc {
  font-size: 13px;
  color: #303133;
  line-height: 1.7;
  margin: 0 0 12px;
}

.practice__block {
  padding: 16px 0;
  border-top: 1px dashed #e4e7ed;
}

.practice__block:first-of-type {
  border-top: none;
  padding-top: 4px;
}

.practice__subtitle {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 10px;
}

.practice__toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.practice__msg {
  max-width: 520px;
  margin-bottom: 4px;
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

.stage {
  position: relative;
  width: 100%;
  max-width: 520px;
  height: 240px;
  background: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-radius: 10px;
  overflow: hidden;
  user-select: none;
  outline: none; /* 去掉浏览器默认的聚焦黑框，用下面的高亮代替 */
  cursor: pointer;
}

/* 拿到焦点时边框变蓝，告诉你现在按方向键有效 */
.stage--focused {
  border-color: #409eff;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.15);
}

.stage__hint {
  position: absolute;
  left: 50%;
  bottom: 12px;
  transform: translateX(-50%);
  padding: 4px 10px;
  border-radius: 6px;
  background: rgba(48, 49, 51, 0.06);
  font-size: 12px;
  color: #303133;
  white-space: nowrap;
  pointer-events: none;
}

.stage__box {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.35);
  transition: transform 0.12s ease-out;
}

.hover-text {
  display: inline-block;
  padding: 10px 16px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background: #f5f7fa;
  font-size: 15px;
  color: #303133;
  cursor: pointer;
  transition: all 0.2s ease;
}

/* 鼠标移上去的样子：颜色、字号、粗细全变 */
.hover-text--active {
  color: #e6a23c;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 1px;
  background: #fdf6ec;
  border-color: #f5dab1;
}
</style>
