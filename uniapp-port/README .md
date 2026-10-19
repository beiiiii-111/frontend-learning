# 跨端拓展 · uni-app 移植

选学内容，课外 6 学时，不占课内 48 学时。完成 Web 端项目后，用同一套业务与接口把其中两个页面移植到移动端。

## 拓展任务

| 任务 | 内容 | 验收方式 |
| --- | --- | --- |
| 环境与工程 | uni-app（Vue 3 版本线）工程初始化；用 HBuilderX 或命令行运行到浏览器与小程序模拟器 | 能在两种端上跑起 Hello 页面 |
| 页面与适配 | 用 rpx 单位与弹性布局做适配；页面生命周期与滚动区域的差异 | 移动端布局不错位，长列表滚动正常 |
| 能力差异 | 条件编译的用法；把 localStorage 换成跨端存储 API；请求 API 的替换 | 同一份代码在不同端都能读写登录态 |
| 移植实践 | 把“活动列表”与“活动报名详情”两个页面移植过去，复用同一套接口与状态模块 | 真机或模拟器演示，功能可用 |

## 目录约定

```
uniapp-port/
├── README.md      本文件
├── docs/
│   └── 差异对照.md   Web 端与移动端的 API 差异清单
└── src/
    ├── api/        复用综合项目的接口层，替换请求实现
    ├── pages/      移植过来的页面
    ├── static/
    ├── stores/     复用状态模块，替换存储 API
    └── utils/
```

## 与 Web 端的差异清单

| 项目 | Web 端 | 移动端 |
| --- | --- | --- |
| 存储 | `localStorage` | `uni.setStorageSync` / `uni.getStorageSync` |
| 请求 | axios | `uni.request` 或适配层 |
| 路由跳转 | `router.push` | `uni.navigateTo` / `uni.switchTab` |
| 单位 | px / rem | rpx |
| 布局 | Flex 为主 | Flex 为主，注意安全区与固定底部栏 |

同一份业务逻辑尽量放 `stores/`，平台差异集中在 `api/` 与 `utils/` 两层，便于对照。

## 跑起来

```bash
cd uniapp-port
pnpm install
pnpm dev:h5
pnpm dev:mp-weixin
```
