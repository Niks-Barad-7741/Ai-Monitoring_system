import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': 'http://127.0.0.1:8000',
      '/dashboard': 'http://127.0.0.1:8000',
      '/ai': 'http://127.0.0.1:8000',
      '/admin/admin-logs': 'http://127.0.0.1:8000',
      '/admin/admin-analytics': 'http://127.0.0.1:8000',
      '/user/user-logs': 'http://127.0.0.1:8000',
      '/user/user-analytics': 'http://127.0.0.1:8000',
      '/ws': {
        target: 'ws://127.0.0.1:8000',
        ws: true,
      },
    }
  }
})
