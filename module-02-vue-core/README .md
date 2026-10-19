# 模块二 · Vue 3 核心基础

12 学时 · 第 4-6 周 · 单元 4-6

从操作 DOM 转向描述状态。三个单元分别处理模板与响应式、计算与渲染控制、交互与表单，每节课都有可交互的页面产出。

## 单元

| 单元 | 主题 | 视图目录 | 课堂产出 |
| --- | --- | --- | --- |
| 4 | 模板语法与响应式基础 | `practice-app/src/views/unit-04/` | 个人名片页（含交互） |
| 5 | 计算属性、侦听器与渲染控制 | `practice-app/src/views/unit-05/` | 可排序筛选的数据表格、待办清单 CRUD |
| 6 | 用户交互与表单绑定 | `practice-app/src/views/unit-06/` | 多步预订表单、Markdown 编辑器 |

## practice-app 目录约定

```
practice-app/
├── src/
│   ├── views/
│   │   ├── unit-04/              单元 4 课堂练习
│   │   │   ├── ProfileCard.vue
│   │   │   ├── Toggle.vue
│   │   │   ├── Activity.vue
│   │   │   ├── DirectiveLab.vue  指令练习入口
│   │   │   └── directive-lab/    13 个常用指令各一个文件
│   │   ├── unit-05/              单元 5 课堂练习
│   │   └── unit-06/              单元 6（随课程进度补充）
│   ├── components/               本模块内共用的小组件
│   ├── App.vue                   练习导航入口，列出全部练习页面
│   └── main.js
├── public/
│   └── unit-04-literal.html      字面量入门对照页（CDN 引入 Vue，独立打开）
├── docs/                         配套教学文档
└── package.json
```

练习入口统一放在 `App.vue`，用一张导航表列出所有页面，便于上课时逐个点开。新增练习时在 `App.vue` 的 `practiceList` 里加一条记录即可。

## 跑起来

```bash
cd practice-app
pnpm install
pnpm dev
```

## 常见错误的定位方向

课堂上会集中复现这几类问题，代码里保留了复现入口：

- 改了数据界面不动：检查状态是否用 ref / reactive 声明，是否在 reactive 对象上整体替换。
- 列表渲染顺序错乱：检查 key 是否用了索引。
- 属性被解构后失去响应性：改用 `toRefs` 或直接访问。
- 事件监听不到：检查事件名在模板中的书写形式。
