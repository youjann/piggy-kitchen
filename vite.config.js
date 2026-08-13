import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // 相对 base：产物用 ./assets 引用资源，兼容 GitHub Pages 子路径与 CloudStudio 根域名
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    {
      // 移除构建产物中 script/link 的 crossorigin 属性：
      // CloudStudio Gateway 等托管环境下可能触发浏览器 CORS 判定，
      // 导致 module script 被拒绝执行（页面只剩 CSS 背景）。
      name: 'strip-crossorigin',
      transformIndexHtml(html) {
        return html.replace(/\s+crossorigin(="[^"]*")?/g, '')
      },
    },
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
})
