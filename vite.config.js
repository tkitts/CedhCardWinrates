import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  base:"/CedhCardWinrates/",
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    outDir: "./docs"
  },
  server: {
    proxy: {
      "/api": {
          target: "https://edhtop16.com/api/graphql",
					changeOrigin: true,
					secure: false,
          rewrite: (p) => p.replace(/^\/api/, ""),
      }
    },
    // headers: {
    //     "Access-Control-Allow-Origin": "https://sandbox.embed.apollographql.com",
    //     "Access-Control-Allow-Credentials": true
    // },
  },
})

