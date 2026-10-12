# 单元 2 · Node.js 生态、包管理与构建工具

本单元的第一个 Vite 工程。`src/App.vue` 里按编号演示了插值、`v-bind`、`v-on`、`v-model`、`v-if`、`v-for`、`computed`、`watch` 八项基础语法。

## 运行方式

```bash
pnpm install
pnpm dev      # 开发服务器，改代码热更新
pnpm build    # 产出到 dist/
pnpm preview  # 本地预览构建产物
```

## 目录说明

| 路径 | 说明 |
| --- | --- |
| `index.html` | Vite 的入口 HTML，`<script type="module" src="/src/main.js">` 是约定的入口 |
| `vite.config.js` | 构建配置，`@vitejs/plugin-vue` 负责编译 `.vue` |
| `package.json` | 依赖声明与脚本 |
| `src/main.js` | `createApp(App).mount('#app')` |
| `src/App.vue` | 八项语法演示，编号与注释一一对应 |
| `src/assets/` | 会被构建处理的静态资源（走 hash 命名） |
| `public/` | 不参与构建，原样拷到 `dist/` 根目录 |

## 课堂产出

- [x] 可复用的 `vite.config.js`
- [x] 依赖排查单（见下）
- [ ] 把 `package-lock.json` 换成 `pnpm-lock.yaml`（仓库统一用 pnpm）

## 依赖排查单

排查一个工程该装哪些依赖，按「谁会被打进产物」分两类。

| 依赖 | 类别 | 作用 | 可否去掉 |
| --- | --- | --- | --- |
| `vue` | dependencies | 运行时框架，`createApp` / `ref` / `computed` 都来自它 | 否 |
| `@vitejs/plugin-vue` | devDependencies | 编译 `.vue` 单文件组件，只在构建时用到 | 否 |
| `vite` | devDependencies | 开发服务器 + 打包器 | 否 |

判断规则：

1. 运行时 `import` 的 → `dependencies`
2. 只在构建、检查、测试阶段跑的 → `devDependencies`
3. 装了但代码里没 import 的 → 删掉，别留着
4. 装错分类不会报错，但会让产物依赖树变脏，上线镜像变大

## vite.config.js 要点

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})
```

后续单元会往这里加：

| 单元 | 新增配置 | 用途 |
| --- | --- | --- |
| 3 | 不在此处，交给 ESLint / Prettier 独立配置文件 | 规范治理 |
| 9 | `resolve.alias` | 用 `@/` 代替相对路径 |
| 10 | `server.proxy` | 开发期代理接口，绕开跨域 |
| 12 | `build.chunkSizeWarningLimit`、手动分包 | 产物优化 |

## 踩坑清单

- 本项目早期用 npm 装的，留了 `package-lock.json`。仓库统一 pnpm，后续统一锁文件时会删掉它。
- `public/` 里的文件引用时写绝对路径 `/img/yun.jpg`，不要写成 `./public/img/...`。
- `src/assets/` 里的图片要用 `import` 引入，构建才会处理并加 hash；直接写字符串路径不会。
