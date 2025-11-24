import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/log_in': {
        target: 'http://localhost:8050',
        changeOrigin: true,
      },
      '/register': {
        target: 'http://localhost:8050',
        changeOrigin: true,
      },
      '/clear_tk': {
        target: 'http://localhost:8050',
        changeOrigin: true,
      },
      '/validate_token': {
        target: 'http://localhost:8050',
        changeOrigin: true,
      },
    },
  },
})

