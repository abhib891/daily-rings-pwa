import type { User } from '@supabase/supabase-js'

export const GOAL_LINE_STORAGE_KEY = 'activity-tracker-goal-oneliner'
export const GOAL_LINE_META_KEY = 'goal_oneliner'
export const GOAL_LINE_MAX_LEN = 200

export function readGoalLineFromUser(user: User | null | undefined): string {
  if (!user) return ''
  const raw = (user.user_metadata as Record<string, unknown> | undefined)?.[GOAL_LINE_META_KEY]
  return typeof raw === 'string' ? raw : ''
}

export function readGoalLineFromStorage(): string {
  try {
    return localStorage.getItem(GOAL_LINE_STORAGE_KEY) ?? ''
  } catch {
    return ''
  }
}

export function writeGoalLineToStorage(value: string): void {
  try {
    localStorage.setItem(GOAL_LINE_STORAGE_KEY, value)
  } catch {
    /* ignore quota */
  }
}
