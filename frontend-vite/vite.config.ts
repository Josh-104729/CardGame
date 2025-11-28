import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/log_in': {
        target: 'http://172.20.1.144:8050',
        changeOrigin: true,
      },
      '/register': {
        target: 'http://172.20.1.144:8050',
        changeOrigin: true,
      },
      '/clear_tk': {
        target: 'http://172.20.1.144:8050',
        changeOrigin: true,
      },
      '/validate_token': {
        target: 'http://172.20.1.144:8050',
        changeOrigin: true,
      },
    },
  },
})

