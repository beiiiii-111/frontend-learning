<script setup>
import { ref } from 'vue'

const user =ref({
  name: 'zxy',
  avatar: '/img/yun.jpg',
  role: 'student',
})
const isOnDuty = ref(true)
const themeColor = ref('#2f6fed')
const skills = ref(['唱歌', '跳舞', '篮球'])

const ROLE_TEXT = {
  organizer: '活动组织者',
  auditor: '审核员',
  student: '学生'
}
</script>

<template>
  <div class="card">
    <img :src="user.avatar" :alt="user.name" class="avatar" />
    <slot />
  </div>

    <section class="profile-card" :style="{ '--theme-color': themeColor }">

    <div class="info-row">
      <span class="info-row__value">{{ user.name }}</span>
    </div>

    <span
      class="role-tag"
      :class="{
        'role-tag--organizer': user.role === 'organizer',
        'role-tag--auditor': user.role === 'auditor',
        'role-tag--student': user.role === 'student'
      }"
    >
      {{ ROLE_TEXT[user.role] ?? '未知' }}
    </span>

    <span class="duty-tag" :class="{ 'duty-tag--off': !isOnDuty }">
      {{ isOnDuty ? '在岗' : '请假' }}
    </span>

    <ul class="skill-list">
      <li v-for="skill in skills" :key="skill">{{ skill }}</li>
    </ul>

    <div class="profile-card__actions">
      <button @click="isOnDuty = !isOnDuty">切换在岗状态</button>
      <button @click="themeColor = '#2f6fed'">蓝色主题</button>
      <button @click="themeColor = '#0f9d58'">绿色主题</button>
      <button @click="themeColor = '#e8710a'">橙色主题</button>
    </div>
  </section>
</template>

<style scoped>

.card,
.profile-card {
  --radius: 18px;
  --theme-color: #2f6fed;   /* 默认值；.profile-card 会被 :style 内联覆盖 */

  box-sizing: border-box;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  font-family: "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
  color: #1f2937;
}

/* ---------- 卡片一：头像 + 插槽 ---------- */
.card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  margin-bottom: 16px;
  background: #fff;
  border-radius: var(--radius);
  box-shadow: 0 1px 2px rgba(16, 24, 40, .05),
              0 10px 24px -12px rgba(16, 24, 40, .18);
}

.avatar {
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  background: #eef2ff;
  border: 2px solid #fff;
  box-shadow: 0 0 0 2px var(--theme-color);
  transition: transform .25s ease, box-shadow .25s ease;
}
.card:hover .avatar {
  transform: scale(1.05);
  box-shadow: 0 0 0 3px var(--theme-color);
}

/* 插槽内容通常没写 class，用 :deep 兜底排版（父组件传进来时也生效） */
.card :deep(p) { margin: 0; font-size: 14px; color: #6b7280; }
.card :deep(h3) { margin: 0 0 4px; font-size: 16px; font-weight: 600; }

/* ---------- 卡片二：主卡片 ---------- */
.profile-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  padding: 26px 22px 18px;
  overflow: hidden;
  background: #fff;
  border-radius: var(--radius);
  box-shadow: 0 1px 2px rgba(16, 24, 40, .05),
              0 12px 28px -12px rgba(16, 24, 40, .18);
  transition: transform .25s ease, box-shadow .25s ease;
}
.profile-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 2px 4px rgba(16, 24, 40, .06),
              0 20px 40px -14px rgba(16, 24, 40, .24);
}

/* 左侧主题色竖条：换主题时它是第一个变的地方 */
.profile-card::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 6px;
  background: var(--theme-color);
  transition: background .3s ease;
}

/* 顶部主题色渐变条：和左侧竖条组成 L 型，主题色存在感更强 */
.profile-card::after {
  content: '';
  position: absolute;
  left: 0; top: 0; right: 0;
  height: 5px;
  background: linear-gradient(90deg,
              var(--theme-color),
              color-mix(in srgb, var(--theme-color) 35%, #ffffff));
  transition: background .3s ease;
}

/* ---------- 姓名 ---------- */
.info-row {
  display: flex;
  align-items: center;
  width: 100%;
  padding-bottom: 12px;
  border-bottom: 1px dashed #e8edf5;
}
/* 去掉"姓名"标签后，名字本身承担标题角色，字号相应放大 */
.info-row__value {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  letter-spacing: .5px;
}

/* ---------- 角色标签 & 在岗标签 ---------- */
.role-tag,
.duty-tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: .2px;
  line-height: 1.6;
  white-space: nowrap;
}

/* 角色：描边风格，只换 --c 一个变量 */
.role-tag {
  --c: #64748b;
  color: var(--c);
  background: color-mix(in srgb, var(--c) 10%, #fff);
  border: 1px solid color-mix(in srgb, var(--c) 22%, #fff);
}
.role-tag--organizer { --c: #7c3aed; }   /* 紫 */
.role-tag--auditor   { --c: #0891b2; }   /* 青 */
.role-tag--student   { --c: #2563eb; }   /* 蓝 */

/* 在岗：实心填充更醒目；请假变灰 */
.duty-tag {
  --c: #0f9d58;
  color: #fff;
  background: var(--c);
  box-shadow: 0 3px 10px -3px var(--c);
  transition: background .25s ease, box-shadow .25s ease;
}
.duty-tag--off {
  --c: #94a3b8;
  box-shadow: none;
}

/* ---------- 技能列表 ---------- */
.skill-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}
/* 技能标签默认就带主题色，切主题时整片一起变，比灰底醒目得多 */
.skill-list li {
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--theme-color);
  background: color-mix(in srgb, var(--theme-color) 10%, #fff);
  border: 1px solid color-mix(in srgb, var(--theme-color) 22%, #fff);
  transition: color .2s, background .2s, border-color .2s, transform .2s;
}
.skill-list li:hover {
  transform: translateY(-2px);
  background: color-mix(in srgb, var(--theme-color) 18%, #fff);
  border-color: var(--theme-color);
}

/* ---------- 底部按钮组 ---------- */
.profile-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
  padding-top: 14px;
  border-top: 1px solid #f1f5f9;
}

.profile-card__actions button {
  padding: 8px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #fff;
  color: #475569;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: color .2s, background .2s, border-color .2s;
}
.profile-card__actions button:hover {
  color: var(--theme-color);
  background: color-mix(in srgb, var(--theme-color) 6%, #fff);
  border-color: var(--theme-color);
}
.profile-card__actions button:active { transform: translateY(1px); }

/* 第一个按钮（切换在岗）独占一行做主按钮 */
.profile-card__actions button:first-child {
  flex: 1 0 100%;
  padding: 10px 0;
  font-size: 14px;
  color: #fff;
  background: var(--theme-color);
  border-color: var(--theme-color);
  box-shadow: 0 4px 14px -4px var(--theme-color);
  transition: filter .2s, box-shadow .2s;
}
.profile-card__actions button:first-child:hover {
  color: #fff;
  filter: brightness(1.08);
  box-shadow: 0 6px 18px -4px var(--theme-color);
}
.profile-card__actions button:first-child:active { transform: translateY(1px); }

/* 后三个主题按钮：等分一排，各自带自己的颜色圆点 */
.profile-card__actions button:not(:first-child) {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 6px;
  color: var(--btn);
  background: color-mix(in srgb, var(--btn) 8%, #fff);
  border-color: color-mix(in srgb, var(--btn) 30%, #fff);
}
.profile-card__actions button:not(:first-child):hover {
  color: #fff;
  background: var(--btn);
  border-color: var(--btn);
}
/* 颜色圆点：一眼看出点哪个变什么色 */
.profile-card__actions button:not(:first-child)::before {
  content: '';
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--btn);
  transition: background .2s;
}
.profile-card__actions button:not(:first-child):hover::before {
  background: #fff;
}

/* 按位置对应各自的主题色（第 2/3/4 个按钮） */
.profile-card__actions button:nth-child(2) { --btn: #2f6fed; }  /* 蓝 */
.profile-card__actions button:nth-child(3) { --btn: #0f9d58; }  /* 绿 */
.profile-card__actions button:nth-child(4) { --btn: #e8710a; }  /* 橙 */
</style>
