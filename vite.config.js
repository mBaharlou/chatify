import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '#shared': fileURLToPath(new URL('./shared', import.meta.url)),
    },
  },
  server: {
    // The API + chat server (server/index.js) runs next to Vite during `npm run dev`.
    proxy: {
      '/api': 'http://127.0.0.1:3001',
      '/socket.io': { target: 'ws://127.0.0.1:3001', ws: true },
    },
  },
})
