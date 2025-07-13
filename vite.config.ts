import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      name: 'Vue3Turnstile',
      fileName: (format) => `vue3-turnstile.${format}.js`,
    },
    rollupOptions: {
      external: ['vue', '@unhead/vue'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
          '@unhead/vue': 'UnheadVue',
        },
      },
    },
  },
})
