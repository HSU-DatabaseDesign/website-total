import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/badges': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/users': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/novels': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/reviews': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/collections': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/authors': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/follow': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/hashtags': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
