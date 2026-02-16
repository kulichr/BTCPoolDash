import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const poolApiUrl = env.VITE_POOL_API_URL || 'http://192.168.1.209:2019'

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: poolApiUrl,
          changeOrigin: true,
        },
      },
    },
  }
})
