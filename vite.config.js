import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // PWA : rend le site installable sur le téléphone et utilisable hors connexion
    VitePWA({
      // Quand une nouvelle version est publiée, elle s'installe toute seule
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'RacketLive',
        short_name: 'RacketLive',
        description:
          'Calendrier des tournois, classements ATP et WTA et fiches joueurs de tennis',
        lang: 'fr',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#0b1626',
        theme_color: '#001c59',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Toute adresse du site renvoie l'application (React Router prend le relais)
        navigateFallback: '/index.html',
        // Les drapeaux (près de 200 fichiers svg) ne sont pas préchargés : trop lourd.
        // Ils sont gardés au fur et à mesure qu'on les voit (voir plus bas).
        globPatterns: ['**/*.{js,css,html,png}', 'favicon.svg'],
        runtimeCaching: [
          {
            // Drapeaux : une fois vus, ils restent disponibles hors connexion
            urlPattern: /\/assets\/.*\.svg$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'drapeaux',
              expiration: { maxEntries: 250, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          },
          {
            // Résultats des tournois : on affiche la version gardée en mémoire
            // tout de suite, et on la met à jour en arrière-plan.
            urlPattern: /\/data\/resultats\/.*\.json$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'resultats-tournois',
              expiration: { maxEntries: 60, maxAgeSeconds: 7 * 24 * 60 * 60 },
            },
          },
        ],
      },
    }),
  ],
})
