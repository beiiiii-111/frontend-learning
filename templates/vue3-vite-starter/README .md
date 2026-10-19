# 工程模板 · vue3-vite-starter

模块一（单元 1-3）的最终产出。包含构建配置、规范配置、目录结构与提交钩子，后续所有实训从这个模板起步。

## 包含什么

| 层次 | 内容 |
| --- | --- |
| 构建 | Vite 配置：路径别名、开发代理、环境变量、构建分包、资源内联阈值 |
| 规范 | ESLint 扁平配置、Prettier、Stylelint，两者职责划分清楚 |
| 提交 | husky + lint-staged 提交前校验，commitlint 校验提交信息格式 |
| 结构 | 按功能组织的目录：`api/`、`components/`、`composables/`、`router/`、`stores/`、`views/` |
| 说明 | 根目录 README 写清运行方式与目录职责，他人可在 15 分钟内跑起来 |

## 用法

```bash
# 复制模板作为新工程起点
cp -r templates/vue3-vite-starter ../my-app
cd ../my-app

# 改工程名与版本
# 编辑 package.json 的 name 字段

pnpm install
pnpm dev
```

## 验收标准

在干净环境上按 README 操作，能做到：工程跑起来、改一行代码看到界面变化、提交一次代码触发自动构建。三条都通过才算合格。

## 配置速查

| 文件 | 作用 |
| --- | --- |
| `vite.config.js` | 别名、代理、构建分包 |
| `eslint.config.js` | 扁平配置，规则集与忽略项 |
| `.prettierrc.json` | 格式化规则 |
| `.stylelintrc.json` | 样式检查规则 |
| `.husky/pre-commit` | 提交前执行 lint-staged |
| `commitlint.config.js` | 提交信息格式约束 |
| `.env.development` / `.env.production` | 环境变量，变量名统一用 `VITE_` 前缀 |
