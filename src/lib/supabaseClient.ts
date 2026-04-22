import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let singleton: SupabaseClient | null | undefined

/**
 * iOS Safari / installed PWA: timers pause in the background, so JWT auto-refresh
 * can miss until the tab is foregrounded. Resume refresh and try a silent refresh
 * when the app becomes visible again (also helps recover from rare client hibernation).
 */
function attachAuthForegroundResume(client: SupabaseClient): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return

  const onVisible = () => {
    if (document.visibilityState !== 'visible') return
    void client.auth.startAutoRefresh()
    void client.auth.refreshSession().catch(() => {
      /* no stored session, expired refresh, or offline */
    })
  }

  const onHidden = () => {
    void client.auth.stopAutoRefresh()
  }

  const onVisibility = () => {
    if (document.visibilityState === 'visible') onVisible()
    else onHidden()
  }

  document.addEventListener('visibilitychange', onVisibility)
  window.addEventListener('focus', onVisible)
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) onVisible()
  })
  onVisibility()
}

/** Returns null if env is missing or still placeholders (local-only mode). */
export function getSupabase(): SupabaseClient | null {
  if (singleton !== undefined) return singleton

  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
  const key =
    (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
    (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined)
  if (
    !url ||
    !key ||
    url.includes('YOUR_PROJECT') ||
    key.includes('YOUR_ANON')
  ) {
    singleton = null
    return singleton
  }

  const client = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      storage: globalThis.localStorage,
    },
  })
  singleton = client
  attachAuthForegroundResume(client)
  return singleton
}
