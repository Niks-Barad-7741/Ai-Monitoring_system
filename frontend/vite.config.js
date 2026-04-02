import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables dynamically based on Vite mode
  const env = loadEnv(mode, process.cwd(), '');
  const targetUrl = env.VITE_API_URL || 'http://127.0.0.1:8000';
  const wsUrl = env.VITE_WS_URL || 'ws://127.0.0.1:8000';

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/auth': targetUrl,
        '/dashboard': targetUrl,
        '/ai': targetUrl,
        '/admin/admin-logs': targetUrl,
        '/admin/admin-analytics': targetUrl,
        '/user/user-logs': targetUrl,
        '/user/user-analytics': targetUrl,
        '/ws': {
          target: wsUrl,
          ws: true,
        },
      }
    }
  };
})
