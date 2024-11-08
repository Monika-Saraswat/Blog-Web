import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import reactRefresh from '@vitejs/plugin-react-refresh'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), reactRefresh()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove /api from the path before forwarding
      },
    },
    historyApiFallback:true
  },
})


