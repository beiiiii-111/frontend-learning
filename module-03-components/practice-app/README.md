# 模块三 · 组件化开发（单元 7-8）

状态：**未开始**（第 7-8 周）

## 计划的代码位置

| 单元 | 主题 | 代码位置 | 产出 |
| --- | --- | --- | --- |
| 7 | 组件基础与父子通信 | `src/components/` | 卡片组件、可自定义单元格的表格 |
| 8 | 组件进阶与逻辑复用 | `src/composables/` | 弹窗与全局通知、组合式函数集 |

## 起步方式

到单元 7 开课时用模板初始化：

```bash
cp -r ../../templates/vue3-vite-starter .
pnpm install
```

（先在临时目录复制，再把内容拷进来，别把本 README 覆盖掉。）

## 目录约定

```
practice-app/
└── src/
    ├── components/     单元 7：自研组件，props / emit / slot
    │   ├── ActivityCard.vue      卡片组件，默认插槽 + 具名插槽
    │   └── DataTable.vue         表格组件，作用域插槽让外部自定义单元格
    ├── composables/    单元 8：组合式函数
    │   ├── useDialog.js          弹窗开关逻辑
    │   ├── useNotify.js          全局通知
    │   └── useRequest.js         请求状态封装（单元 10 会扩展它）
    └── views/          调用上面这些组件的演示页面
```
