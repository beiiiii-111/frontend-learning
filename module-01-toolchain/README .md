# 模块一 · 工程化认知与工具链

12 学时 · 第 1-3 周 · 单元 1-3

先弄清工程化解决什么问题，再把环境、依赖、构建、规范、协作这条链子打通。模块结束时产出一套可复用的工程模板，后续所有实训都从它起步。

## 单元

| 单元 | 主题 | 目录 | 课堂产出 |
| --- | --- | --- | --- |
| 1 | 工程化认知、学习路线与开发环境 | `unit-01-env/` | 环境自检报告、个人学习路线图 |
| 2 | Node.js 生态、包管理与构建工具 | `unit-02-package-vite/` | 依赖排查单、可复用的 vite.config.js |
| 3 | 工程规范、质量保障与 Git 协作 | `unit-03-quality-git/` | 带校验钩子的工程模板、合并请求 |

## 目录说明

```
unit-01-env/                         环境自检截图、学习路线图、工程化理解笔记
unit-02-package-vite/                依赖排查单、vite 配置片段
unit-02-package-vite/vite-scaffold-demo/   Vite 脚手架初始化的原始工程，作为构建工具的对照样本
unit-03-quality-git/                 规范治理记录、eslint/prettier/stylelint 配置、husky 钩子、流水线说明
```

## 版本基线

表中版本为 2026 年 10 月核对的 npm 最新稳定版。写法上用 caret 范围锁定主版本，安装时取同主版本的最新稳定版，不追预发布版本。

| 工具 | 版本 | 用途 |
| --- | --- | --- |
| Node.js | 22.12 LTS 及以上 | 运行时 |
| pnpm | 10 及以上 | 包管理 |
| Vite | 8.3.x | 构建 |
| ESLint | 10.x | 语义检查（扁平配置） |
| Prettier | 3.9.x | 格式 |
| Stylelint | 17.x | 样式检查 |
| Vitest | 5.x | 单元测试 |
| husky + lint-staged | 9.1.x + 17.x | 提交前校验 |
| commitlint | 21.x | 提交信息校验 |

## 模块验收标准（第 3 周）

在一台干净环境上，只凭仓库里的说明文档与配置文件，能做到三件事：

1. 把工程跑起来；
2. 改一行代码，界面上看到变化；
3. 提交一次代码，触发自动构建。

三条都通过，模块一算过关。工程模板落在 `templates/vue3-vite-starter/`，后续单元直接基于它开发。

## 跑起来

`vite-scaffold-demo` 是脚手架初始化的原始工程，用于对照初始状态与改造后的差异。

```bash
cd unit-02-package-vite/vite-scaffold-demo
pnpm install
pnpm dev
```
