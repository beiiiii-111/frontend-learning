import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

// ESLint 9 的扁平配置：数组后面的规则覆盖前面的
export default [
  // 忽略产物和依赖，别去扫 node_modules
  {
    ignores: ['dist/**', 'node_modules/**', '.vite/**'],
  },

  js.configs.recommended,

  // Vue 单文件组件的推荐规则
  ...pluginVue.configs['flat/essential'],

  {
    files: ['**/*.{js,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // 组件名必须多单词，避免和 HTML 原生标签撞车
      'vue/multi-word-component-names': 'off',
      // 定义了却没用到的变量直接报错，不留垃圾
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // 全等比较
      eqeqeq: ['warn', 'smart'],
      // 禁止 console，调试用完就删
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
]
