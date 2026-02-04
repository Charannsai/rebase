import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    server: { 
      proxy: {
        '/api/p': {
          target: 'https://api.tryezbuild.tech',        
          changeOrigin: true,
          secure: true,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {        
              proxyReq.setHeader('Authorization', `Bearer ${env.EASYBUILD_SECRET_KEY || ''}`)
            })
          }
        }
      }
    }
  }
})
