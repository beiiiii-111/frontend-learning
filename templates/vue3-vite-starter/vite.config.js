import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],

  // 用 @/ 代替 ../../ 这类相对路径，目录再深也不会写成一串点
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  server: {
    port: 5173,
    // 开发期把 /api 开头的请求转给后端，绕开浏览器跨域拦截
    // 单元 10 做请求层时会真正用上，先按注释保留
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:8080',
    //     changeOrigin: true,
    //   },
    // },
  },

  build: {
    // 单个 chunk 超过这个体积会告警，提醒你去做代码分割
    chunkSizeWarningLimit: 1000,
  },
})
