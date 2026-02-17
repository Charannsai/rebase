import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    server: {
    
    proxy: {
      '^/[a-z0-9]{8}/.*': {
        target: env.FUSEPLANE_URL || 'https://api.fuseplane.com',
        changeOrigin: true,
        secure: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Authorization', `Bearer ${env.FUSEPLANE_SECRET_KEY || ''}`)
          })
        }
      }
    }
    }}
})
