import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let singleton: SupabaseClient | null | undefined

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

  singleton = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
  return singleton
}
