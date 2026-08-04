import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // Escape karakter khusus regex jika VITE_API_URL berisi IP address atau Port
  const rawApiUrl = env.VITE_API_URL || ''
  const escapedApiUrl = rawApiUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  // Pattern matcher aman untuk Workbox
  const apiPattern = rawApiUrl
    ? new RegExp(`^${escapedApiUrl}/api/v1\\.0/.*`, 'i')
    : new RegExp('^/api/v1\\.0/.*', 'i')

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          enabled: true,
        },
        workbox: {
          runtimeCaching: [
            {
              urlPattern: apiPattern,
              handler: 'NetworkFirst',
              method: 'GET', // ✅ Hanya memproksi GET request (keamanan endpoint POST/PUT)
              options: {
                cacheName: 'nazar-paint-api-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24, // 24 Jam
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        manifest: {
          name: 'Nazar Paint - Kalkulator, Simulasi & Rekomendasi Warna',
          short_name: 'Nazar Paint',
          description:
            'Hitung kebutuhan cat dan simulasi warna untuk Toko Cat Nazar Paint',
          theme_color: '#EA580C',
          background_color: '#ffffff',
          display: 'standalone',
          orientation: 'portrait',
          scope: '/',
          start_url: '/',
          icons: [
            { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          ],
        },
      }),
    ],
    build: {
      chunkSizeWarningLimit: 1000, // Menaikkan batas peringatan chunk menjadi 1000 kB
      rollupOptions: {
        output: {
          // ✅ Memecah node_modules menjadi beberapa vendor chunk terpisah
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (
                id.includes('react') ||
                id.includes('react-dom') ||
                id.includes('react-router-dom')
              ) {
                return 'vendor-react'
              }
              if (id.includes('react-icons')) {
                return 'vendor-icons'
              }
              if (id.includes('@react-oauth')) {
                return 'vendor-google'
              }
              return 'vendor-core'
            }
          },
        },
      },
    },
    server: {
      host: true, // Membuka akses jaringan lokal/Wi-Fi
      port: 5174,
    },
  }
})
