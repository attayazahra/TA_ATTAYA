import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ url, request }) =>
              url.origin === 'http://localhost:8081' &&
              url.pathname.startsWith('/api/v1.0/') &&
              request.method === 'GET',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'nazar-paint-api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      manifest: {
        name: 'Nazar Paint - Kalkulator, Simulasi & Rekomendasi Warna',
        short_name: 'Nazar Paint',
        description: 'Hitung kebutuhan cat dan simulasi warna untuk Toko Cat Nazar Paint',
        theme_color: '#4CAF50',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ],
  server: {
    host: true,
    port: 5174
  }
})