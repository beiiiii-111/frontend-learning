<script setup>
import { ref } from "vue";

// 会员信息：内容是固定不变的，普通对象就够了，不需要 ref
const member = {
  name: "李明",
  homePage: "https://cn.vuejs.org",
  points: 2860,
};

// 头像列表：切换头像时靠 :src 重新绑定地址
const avatars = [
  "https://infinityx7-oss.oss-cn-hangzhou.aliyuncs.com/avatar/4.jpg",
  "https://infinityx7-oss.oss-cn-hangzhou.aliyuncs.com/avatar/5.jpg",
  "https://infinityx7-oss.oss-cn-hangzhou.aliyuncs.com/avatar/6.jpg",
  "https://infinityx7-oss.oss-cn-hangzhou.aliyuncs.com/avatar/7.jpg",
];
const avatarIndex = ref(0);

// 皮肤主题：切换后靠 :class 和 :style 改变卡片外观
const themes = [
  { label: "普通", color: "#5a5f66" },
  { label: "黄金", color: "#e6a23c" },
  { label: "铂金", color: "#409eff" },
];
const themeIndex = ref(0);

// VIP 开关：控制按钮的 :disabled
const isVip = ref(false);

function nextAvatar() {
  avatarIndex.value = (avatarIndex.value + 1) % avatars.length;
}
</script>

<template>
  <div class="practice">
    <h3 class="practice__title">v-bind：会员卡片的动态外观</h3>
    <p class="practice__desc">
      头像地址、卡片皮肤、按钮可用状态全部由数据决定，数据一变页面就跟着变。
    </p>

    <div class="practice__toolbar">
      <el-radio-group v-model="themeIndex" size="small">
        <el-radio-button v-for="(t, i) in themes" :key="t.label" :value="i">
          {{ t.label }}
        </el-radio-button>
      </el-radio-group>
      <el-switch v-model="isVip" active-text="VIP 状态" />
    </div>

    <!-- 对象语法：条件成立时加上 is-vip 这个类名 -->
    <div
      class="member-card"
      :class="{ 'is-vip': isVip }"
      :style="{ '--main-color': themes[themeIndex].color }"
    >
      <img
        class="member-card__avatar"
        :src="avatars[avatarIndex]"
        :alt="member.name"
      />

      <div class="member-card__info">
        <div class="member-card__name">
          {{ member.name }}
          <!-- 数组语法：可以混着写死类名、变量、三元表达式 -->
          <span
            :class="[
              'member-card__badge',
              isVip ? 'member-card__badge--on' : '',
            ]"
          >
            {{ isVip ? "VIP 会员" : "普通用户" }}
          </span>
        </div>
        <div class="member-card__meta">
          积分 {{ member.points }} · 皮肤 {{ themes[themeIndex].label }}
        </div>
        <a
          :href="member.homePage"
          target="_blank"
          :title="'打开 ' + member.name + ' 的主页'"
        >
          个人主页
        </a>
      </div>

      <div class="member-card__actions">
        <!-- 布尔属性绑定：值为 false 时 disabled 属性会整个从 DOM 上移除 -->
        <el-button type="primary" size="small" :disabled="!isVip"
          >升级权益</el-button
        >
        <el-button size="small" @click="nextAvatar">换头像</el-button>
      </div>
    </div>

    <el-alert type="info" :closable="false" show-icon class="practice__note">
      <template #title>两种写法完全等价</template>
      <code>v-bind:src="地址"</code> 和
      <code>:src="地址"</code> 是一回事，冒号就是 v-bind 的简写。
      绑定表达式里的内容会被当成 JS 来算，所以
      <code>'打开 ' + member.name</code> 这种拼接也能写。
    </el-alert>
  </div>
</template>

<style scoped>
.practice__toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.member-card {
  --main-color: #303133;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border: 2px solid var(--main-color);
  border-radius: 12px;
  background: #fff;
  max-width: 620px;
  transition: border-color 0.2s;
}

.member-card.is-vip {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}

.member-card__avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--main-color);
}

.member-card__info {
  flex: 1;
  min-width: 0;
}

.member-card__name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.member-card__badge {
  margin-left: 8px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 400;
  border-radius: 10px;
  color: #303133;
  background: #f4f4f5;
}

.member-card__badge--on {
  color: #fff;
  background: var(--main-color);
}

.member-card__meta {
  margin: 4px 0 8px;
  font-size: 13px;
  color: #303133;
}

.member-card__actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
