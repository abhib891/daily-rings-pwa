import type { User } from '@supabase/supabase-js'

function capitalizeWord(s: string): string {
  if (!s) return s
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

/** Best-effort first name: OAuth metadata first, then email local-part. */
export function firstNameFromUser(user: User): string {
  const meta = user.user_metadata as Record<string, unknown> | undefined

  const pickString = (key: string): string => {
    const v = meta?.[key]
    return typeof v === 'string' && v.trim() ? v.trim() : ''
  }

  const given = pickString('given_name')
  if (given) return capitalizeWord(given)

  const full = pickString('full_name') || pickString('name')
  if (full) {
    const first = full.split(/\s+/)[0]
    if (first) return capitalizeWord(first)
  }

  const email = user.email?.trim()
  if (email) {
    const local = email.split('@')[0] ?? ''
    const cleaned = local.replace(/[.+_-]/g, ' ').trim()
    const token = cleaned.split(/\s+/)[0] ?? local
    const letters = token.replace(/\d+$/, '') || token
    if (letters) return capitalizeWord(letters)
  }

  return 'there'
}

/** Signed-in header title, e.g. "Abhishek's Activity Tracker". Falls back if no usable name. */
export function possessiveActivityTitle(user: User | undefined): string {
  if (!user) return 'Activity Tracker'
  const first = firstNameFromUser(user)
  if (!first || first === 'there') return 'Activity Tracker'
  return `${first}'s Activity Tracker`
}
