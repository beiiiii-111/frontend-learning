# 模块四 · 应用架构（单元 9-10）

状态：**未开始**（第 9-10 周）

## 计划的代码位置

| 单元 | 主题 | 代码位置 | 产出 |
| --- | --- | --- | --- |
| 9 | 路由 Vue Router 与登录鉴权 | `src/router/` | 带鉴权的页面骨架 |
| 10 | Pinia 状态管理与数据请求层 | `src/stores/`、`src/api/` | 登录态模块、请求层封装 |

## 起步方式

到单元 9 开课时用模板初始化，并补装依赖：

```bash
pnpm add vue-router pinia axios
```

## 目录约定

```
practice-app/
└── src/
    ├── router/
    │   ├── index.js         路由表与 createRouter
    │   └── guard.js         全局前置守卫，未登录跳 /login
    ├── stores/
    │   ├── user.js          登录态：token、用户信息、登录/登出动作
    │   └── app.js           全局 UI 态：侧边栏折叠、加载中
    ├── api/
    │   ├── request.js       axios 实例、拦截器、统一错误处理
    │   └── user.js          按业务模块拆的接口函数
    └── views/
        ├── LoginView.vue
        ├── DashboardView.vue
        └── ForbiddenView.vue
```

## 验收点（第 10 周）

鉴权闭环要能走通这四步：

1. 未登录访问 `/dashboard` → 被守卫拦到 `/login`
2. 登录后写入 token 到 store → 跳转回原目标页
3. 刷新页面 → 从本地恢复登录态，不被踢出
4. 登出 → 清 token，再访问受保护页面又被拦下
