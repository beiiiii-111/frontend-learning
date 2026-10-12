# 前端工程化开发 · 课程代码仓库

《前端工程化开发》配套代码仓库，按课程的 12 个单元组织。每个单元的课堂任务、练习代码、案例实现放在对应目录，随课程进度逐步补全。

| 项目 | 内容 |
| --- | --- |
| 课程 | 前端工程化开发 |
| 学时 | 48 学时 · 12 周 × 4 学时 |
| 技术栈 | Vue 3 + Vite + Vue Router + Pinia + Element Plus |
| 适用专业 | 软件工程技术（职业本科） |
| 先修课程 | Web 前端基础 |
| 后续课程 | Web 应用系统综合实训 |

## 仓库结构

```
frontend-learning/
├── docs/                       课程资料：环境自检清单、问题记录表
├── templates/                  工程模板（单元 1-3 产出，后续实训的起点）
│   └── vue3-vite-starter/      含构建配置、规范配置、提交钩子
├── module-01-toolchain/        模块一 · 工程化认知与工具链（12 学时，第 1-3 周）
│   ├── unit-01-env/            单元 1 环境自检、学习路线图
│   ├── unit-02-package-vite/   单元 2 依赖排查单、vite.config.js
│   └── unit-03-quality-git/    单元 3 规范治理、提交钩子、流水线配置
├── module-02-vue-core/         模块二 · Vue 3 核心基础（12 学时，第 4-6 周）
│   └── practice-app/           课堂练习工程，src/views 内按单元分组
├── module-03-components/       模块三 · 组件化开发（8 学时，第 7-8 周）
│   └── practice-app/           自研组件与组合式函数
├── module-04-architecture/     模块四 · 应用架构（8 学时，第 9-10 周）
│   └── practice-app/           路由、状态、请求层
├── cases/                      案例库，10 个案例分三档难度
├── campus-activity-admin/      综合项目 · 校园活动服务平台（管理端）
└── uniapp-port/                跨端拓展 · uni-app 移植
```

## 单元与代码的对应关系

| 周次 | 单元 | 主题 | 代码位置 | 课堂产出 |
| --- | --- | --- | --- | --- |
| 第 1 周 | 1 | 工程化认知、学习路线与开发环境 | `module-01-toolchain/unit-01-env/` | 环境自检报告、学习路线图 |
| 第 2 周 | 2 | Node.js 生态、包管理与构建工具 | `module-01-toolchain/unit-02-package-vite/` | 依赖排查单、可复用的 vite.config.js |
| 第 3 周 | 3 | 工程规范、质量保障与 Git 协作 | `module-01-toolchain/unit-03-quality-git/` | 带校验钩子的工程模板、合并请求 + 流水线 |
| 第 4 周 | 4 | 模板语法与响应式基础 | `module-02-vue-core/practice-app/src/views/unit-04/` | 个人名片页 |
| 第 5 周 | 5 | 计算属性、侦听器与渲染控制 | `module-02-vue-core/practice-app/src/views/unit-05/` | 数据表格、待办清单 |
| 第 6 周 | 6 | 用户交互与表单绑定 | `module-02-vue-core/practice-app/src/views/unit-06/` | 多步表单、Markdown 编辑器 |
| 第 7 周 | 7 | 组件基础与父子通信 | `module-03-components/practice-app/src/components/` | 卡片组件、可自定义单元格的表格 |
| 第 8 周 | 8 | 组件进阶与逻辑复用 | `module-03-components/practice-app/src/composables/` | 弹窗与全局通知、组合式函数集 |
| 第 9 周 | 9 | 路由 Vue Router 与登录鉴权 | `module-04-architecture/practice-app/src/router/` | 带鉴权的页面骨架 |
| 第 10 周 | 10 | Pinia 状态管理与数据请求层 | `module-04-architecture/practice-app/src/stores/`、`src/api/` | 登录态模块、请求层封装 |
| 第 11 周 | 11 | 项目启动与核心业务实现 | `campus-activity-admin/` | 需求规格、可运行骨架、三个业务页面 |
| 第 12 周 | 12 | 联调、优化、部署与答辩 | `campus-activity-admin/` | 线上项目、交付文档 |

模块五的编码工作从第 9 周开始落入综合项目，第 11、12 周把前面积累的页面收拢成完整应用。

## 快速开始

需要 Node.js 22.12 LTS 及以上，包管理器统一用 pnpm。

```bash
# 查看版本基线
node -v && pnpm -v

# 安装依赖并启动练习工程
cd module-02-vue-core/practice-app
pnpm install
pnpm dev

# 构建产物并本地预览
pnpm build && pnpm preview
```

各子工程的运行方式见其目录内的 README。

## 分支与提交约定

| 分支 | 用途 |
| --- | --- |
| `main` | 稳定分支，只接受通过检查的合并 |
| `feat/u<单元号>-<简述>` | 单个单元或功能的开发分支 |
| `fix/<简述>` | 问题修复分支 |

提交信息按 Conventional Commits 格式书写，type 取 `feat`、`fix`、`docs`、`style`、`refactor`、`chore`、`test`。

```
feat(u05): 待办清单支持按状态筛选
fix(u02): 修正 vite 代理配置导致的接口 404
docs(u01): 补充环境自检清单
```

提交前会自动执行 ESLint 与 Prettier 检查，检查不通过无法提交。

## 与考核的对应关系

| 考核时点 | 考核动作 | 仓库里的证据 |
| --- | --- | --- |
| 第 3 周 | 工程模板验收 | `templates/vue3-vite-starter/` 可在干净环境跑通 |
| 第 6 周 | 阶段小结 | `module-02-vue-core/practice-app/` 的提交记录 |
| 第 10 周 | 路由与状态综合任务 | `module-04-architecture/practice-app/` 鉴权闭环 |
| 第 12 周 | 项目答辩与互评 | `campus-activity-admin/` 源码、部署地址、交付文档 |

## 参考资源

| 类别 | 资料 |
| --- | --- |
| 框架 | Vue 官方文档（中文版）、Vue Router 文档、Pinia 文档 |
| 构建 | Vite 官方文档 |
| 组件库 | Element Plus 官方文档 |
| 工具库 | VueUse 组合式函数集合 |
| 质量 | ESLint、Prettier、Stylelint、Vitest 官方文档 |
| 跨端 | uni-app 官方文档 |

自编教材《Vue 3 深入浅出实操教程》36 章，与本仓库逐单元对应。
