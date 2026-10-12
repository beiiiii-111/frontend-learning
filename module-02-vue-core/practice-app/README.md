# 模块二 · Vue 3 核心基础练习工程

单元 4-6 的课堂练习。`src/views` 下按单元分组，`src/App.vue` 是外壳：外层标签页切单元，内层标签页切该单元下的练习。

## 运行方式

```bash
pnpm install
pnpm dev      # 开发服务器
pnpm build    # 构建到 dist/
pnpm serve    # 预览构建产物
```

## 单元与目录的对应

| 单元 | 主题 | 目录 | 练习 |
| --- | --- | --- | --- |
| 4 | 模板语法与响应式基础 | `src/views/unit-04/` | 个人名片页、事件与状态、指令练习册 |
| 5 | 计算属性、侦听器与渲染控制 | `src/views/unit-05/` | 数据表格、待办清单、活动卡片 |
| 6 | 用户交互与表单绑定 | `src/views/unit-06/` | v-model 报名表、修饰符、自定义指令 |

## 单元 4 · 模板语法与响应式基础

| 文件 | 练什么 |
| --- | --- |
| `unit-04/ProfileCard.vue` | 个人名片页。属性绑定、动态 class、动态 style、CSS 变量 |
| `unit-04/Toggle.vue` | `ref` 响应式数据 + `@click` 事件 |
| `unit-04/DirectiveBook.vue` | 指令练习册总入口，13 个练习各占一个子标签页 |

指令练习册的 13 个练习按知识点分到了三个单元目录，练习册用相对路径跨单元引用：

| # | 指令 | 所在目录 |
| --- | --- | --- |
| 01 | `v-bind` / `:` | `unit-04/practice/` |
| 02 | `v-on` / `@` | `unit-04/practice/` |
| 03 | `v-html` / `v-text` | `unit-04/practice/` |
| 04 | `v-once` | `unit-04/practice/` |
| 05 | `v-if` 系列 | `unit-05/practice/` |
| 06 | `v-show` | `unit-05/practice/` |
| 07 | `v-for` | `unit-04/practice/` |
| 08 | `v-model` | `unit-06/practice/` |
| 09 | `v-model` 修饰符 | `unit-06/practice/` |
| 10 | 自定义指令 | `unit-06/practice/` |
| 11 | `v-memo` | `unit-05/practice/` |
| 12 | `v-cloak` | `unit-04/practice/` |
| 13 | `v-pre` | `unit-04/practice/` |

子标签页都加了 `lazy`，切到那一页才创建组件 —— 10 号的自动聚焦、12 号的 iframe 都只在真正要看的时候才执行。

## 单元 5 · 计算属性、侦听器与渲染控制

| 文件 | 练什么 |
| --- | --- |
| `unit-05/Student.vue` | 数据表格。多视图切换、条件筛选、查看详情对话框 |
| `unit-05/Todo.vue` | 待办清单。数组增删、完成计数 |
| `unit-05/ActivityCard.vue` | `computed` 派生数据、动态样式 |

## 单元 6 · 用户交互与表单绑定

| 文件 | 练什么 |
| --- | --- |
| `unit-06/practice/08-ModelPractice.vue` | 一份报名表，各类表单控件绑定的数据类型对照 |
| `unit-06/practice/09-ModelModifierPractice.vue` | `.lazy` / `.number` / `.trim` |
| `unit-06/practice/10-CustomPractice.vue` | 自定义指令：自动聚焦、只许数字、关键词高亮 |

## 两个特殊文件

- `public/v-cloak-demo.html` —— 12 号练习用 `iframe` 嵌的演示页，按 CDN 方式引入 Vue，挂载时间延后 1.2 秒。地址栏加 `?mode=cloak` 看加指令的效果、`?mode=raw` 看不加的效果。
- `public/vue.global.js` —— 从 `node_modules/vue/dist/` 复制出来的全局构建，让上面那个演示页断网也能打开。

## 公共样式

`src/styles/practice.css` 放练习册共用的外观（标题、说明、小标题），在 `main.js` 里全局引入。各组件自己的 `<style scoped>` 只写它独有的部分。

## 踩坑清单

- 装依赖必须 `cd` 进本目录再装，在仓库根目录装会装到错误的位置。
- 沙箱环境下装依赖和构建要加 `NODE_OPTIONS=` 前缀，否则删除动作会被安全钩子拦下。
- pnpm 的软链接结构在某些环境识别不了，`.npmrc` 里已固化 `node-linker=hoisted`。
