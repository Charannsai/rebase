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
          target: 'https://gnusnjlf.fuseplane.com',
          changeOrigin: true,
          secure: true,
          configure: (proxy, _options) => {
            proxy.on('proxyReq', (proxyReq, _req, _res) => {
              proxyReq.setHeader('Authorization', `Bearer ${env.FUSEPLANE_SECRET_KEY || ''}`)
            });
          }
        }
      }
    }}
})
