# vue-basic-demo

Vue 3 + Vite + Element Plus 的基础练习合集，一个 `el-tabs` 页面切各个练习。

```bash
# 装依赖（必须 cd 进项目再装）
pnpm install --config.node-linker=hoisted

node node_modules/vite/bin/vite.js          # 开发
node node_modules/vite/bin/vite.js build    # 构建到 dist/
```

## 页面结构

`src/App.vue` 是外壳，一级标签页有六个：

| 标签页 | 组件 | 练什么 |
| --- | --- | --- |
| 事件与状态 | `components/Toggle.vue` | `@click`、`ref` |
| 列表渲染 Todo | `components/Todo.vue` | `v-for`、数组增删 |
| 活动卡片 | `components/ActivityCard.vue` | 动态样式 |
| 个人名片 | `components/ProfileCard.vue` | 动态 class |
| 学生名单 | `components/Student.vue` | `v-if / v-else-if / v-else` 多视图切换 |
| 指令练习册 | `components/DirectiveBook.vue` | 常用指令逐个练，见下 |

## 指令练习册

`DirectiveBook.vue` 里再套一层标签页，对应 `src/components/practice/` 下 13 个组件，每个组件只练一个指令。子标签页都加了 `lazy`，切到那一页才创建组件。

| # | 文件 | 指令 | 场景 |
| --- | --- | --- | --- |
| 01 | `01-BindPractice.vue` | `v-bind` / `:` | 会员卡片的皮肤、头像、按钮状态 |
| 02 | `02-OnPractice.vue` | `v-on` / `@` | 点赞、回车搜索、阻止冒泡与表单刷新 |
| 03 | `03-HtmlTextPractice.vue` | `v-html` / `v-text` | 公告栏富文本的三栏对照 |
| 04 | `04-OncePractice.vue` | `v-once` | 页脚信息与时间戳的对照 |
| 05 | `05-ConditionPractice.vue` | `v-if` 系列 | 三种身份的提示条 |
| 06 | `06-ShowPractice.vue` | `v-show` | 切来切去也不丢内容的表单 |
| 07 | `07-ForPractice.vue` | `v-for` | 购物车清单、标签、规格、星级 |
| 08 | `08-ModelPractice.vue` | `v-model` | 一份报名表 |
| 09 | `09-ModelModifierPractice.vue` | `v-model` 修饰符 | 结算页的价格输入 |
| 10 | `10-CustomPractice.vue` | 自定义指令 | 自动聚焦、只许数字、关键词高亮 |
| 11 | `11-MemoPractice.vue` | `v-memo` | 只有选中状态变化才更新的长列表 |
| 12 | `12-CloakPractice.vue` | `v-cloak` | 加载慢时的闪烁对比 |
| 13 | `13-PrePractice.vue` | `v-pre` | 展示模板语法本身 |

练习册里的组件只用到 `ref`、模板语法和事件绑定，没有出现计算属性和侦听器——列表统计、星级判断都用普通函数完成。等学完计算属性再回来改写，正好能对比两种写法。

## 两个特殊文件

- `public/v-cloak-demo.html` —— 12 号练习用 `iframe` 嵌的演示页，按 CDN 方式引入 Vue，挂载时间延后 1.2 秒，地址栏加 `?mode=cloak` 看加指令的效果、`?mode=raw` 看不加的效果。
- `public/vue.global.js` —— 从 `node_modules/vue/dist/` 复制出来的全局构建，让上面那个演示页断网也能打开。

## 公共样式

`src/styles/practice.css` 放练习册共用的外观（标题、说明、小标题），在 `main.js` 里全局引入。各组件自己的 `<style scoped>` 只写它独有的部分。
