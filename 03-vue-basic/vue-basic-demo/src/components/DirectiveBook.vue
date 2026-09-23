<script setup>
import { ref } from "vue";

// 指令练习册：13 个练习各占一个子标签页
// lazy 表示第一次切到这一页时才创建组件，避免一进页面就全部挂载
// （比如 10 的自动聚焦、12 的 iframe 都只在真正要看的时候才执行）
import BindPractice from "./practice/01-BindPractice.vue";
import OnPractice from "./practice/02-OnPractice.vue";
import HtmlTextPractice from "./practice/03-HtmlTextPractice.vue";
import OncePractice from "./practice/04-OncePractice.vue";
import ConditionPractice from "./practice/05-ConditionPractice.vue";
import ShowPractice from "./practice/06-ShowPractice.vue";
import ForPractice from "./practice/07-ForPractice.vue";
import ModelPractice from "./practice/08-ModelPractice.vue";
import ModelModifierPractice from "./practice/09-ModelModifierPractice.vue";
import CustomPractice from "./practice/10-CustomPractice.vue";
import MemoPractice from "./practice/11-MemoPractice.vue";
import CloakPractice from "./practice/12-CloakPractice.vue";
import PrePractice from "./practice/13-PrePractice.vue";

const tab = ref("bind");
</script>

<template>
  <el-tabs v-model="tab" class="practice-book__tabs">
    <el-tab-pane label="v-bind" name="bind" lazy>
      <BindPractice />
    </el-tab-pane>

    <el-tab-pane label="v-on" name="on" lazy>
      <OnPractice />
    </el-tab-pane>

    <el-tab-pane label="v-html / v-text" name="html-text" lazy>
      <HtmlTextPractice />
    </el-tab-pane>

    <el-tab-pane label="v-once" name="once" lazy>
      <OncePractice />
    </el-tab-pane>

    <el-tab-pane label="v-if" name="if" lazy>
      <ConditionPractice />
    </el-tab-pane>

    <el-tab-pane label="v-show" name="show" lazy>
      <ShowPractice />
    </el-tab-pane>

    <el-tab-pane label="v-for" name="for" lazy>
      <ForPractice />
    </el-tab-pane>

    <el-tab-pane label="v-model" name="model" lazy>
      <ModelPractice />
    </el-tab-pane>

    <el-tab-pane label="v-model 修饰符" name="model-modifier" lazy>
      <ModelModifierPractice />
    </el-tab-pane>

    <el-tab-pane label="自定义指令" name="custom" lazy>
      <CustomPractice />
    </el-tab-pane>

    <el-tab-pane label="v-memo" name="memo" lazy>
      <MemoPractice />
    </el-tab-pane>

    <el-tab-pane label="v-cloak" name="cloak" lazy>
      <CloakPractice />
    </el-tab-pane>

    <el-tab-pane label="v-pre" name="pre" lazy>
      <PrePractice />
    </el-tab-pane>
  </el-tabs>
</template>
