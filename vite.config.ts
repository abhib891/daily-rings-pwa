import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE')
  const hasUrl = Boolean(env.VITE_SUPABASE_URL?.trim())
  const hasKey = Boolean(
    env.VITE_SUPABASE_ANON_KEY?.trim() ||
      env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim(),
  )
  if (mode === 'production') {
    // Shows in Vercel "Build" logs — no secret values printed.
    console.log(
      `[daily-rings] Supabase client env at build: ${hasUrl && hasKey ? 'OK (URL + key)' : 'MISSING — add VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY for Production, then redeploy'}`,
    )
  }

  return {
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'pwa-192.png', 'pwa-512.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'Activity Tracker',
        short_name: 'Activity',
        description: 'Track daily habits — rings, week view, and gentle never-miss-twice nudges.',
        theme_color: '#dbeafe',
        background_color: '#eff6ff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  }
})
