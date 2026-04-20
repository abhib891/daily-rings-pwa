import { addDays, localDateString } from './dates'

export type Habit = {
  id: string
  name: string
  sortOrder: number
}

export type AppState = {
  habits: Habit[]
  /** habitId -> date (YYYY-MM-DD) -> completed */
  entries: Record<string, Record<string, boolean>>
}

const STORAGE_KEY = 'daily-rings-v1'

const DEFAULT_HABITS: Habit[] = [
  { id: 'h-exercise', name: 'Exercise', sortOrder: 0 },
  { id: 'h-read', name: 'Read', sortOrder: 1 },
  { id: 'h-learn', name: 'Learn / build', sortOrder: 2 },
]

function emptyState(): AppState {
  return {
    habits: DEFAULT_HABITS.map((h) => ({ ...h })),
    entries: {},
  }
}

/** Empty habits (used before cloud data loads). */
export function emptySyncedShell(): AppState {
  return { habits: [], entries: {} }
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyState()
    const parsed = JSON.parse(raw) as AppState
    if (!parsed.habits?.length) return emptyState()
    return {
      habits: parsed.habits,
      entries: parsed.entries ?? {},
    }
  } catch {
    return emptyState()
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function isCompleted(
  state: AppState,
  habitId: string,
  dateStr: string,
): boolean {
  return Boolean(state.entries[habitId]?.[dateStr])
}

export function setCompleted(
  state: AppState,
  habitId: string,
  dateStr: string,
  completed: boolean,
): AppState {
  const next: AppState = {
    habits: state.habits,
    entries: { ...state.entries },
  }
  const row = { ...(next.entries[habitId] ?? {}) }
  if (completed) row[dateStr] = true
  else delete row[dateStr]
  next.entries[habitId] = row
  return next
}

/** Any completion logged strictly before `beforeDate` (YYYY-MM-DD). */
export function hasCompletedBefore(
  state: AppState,
  habitId: string,
  beforeDate: string,
): boolean {
  const row = state.entries[habitId]
  if (!row) return false
  return Object.keys(row).some((d) => d < beforeDate && row[d])
}

/** Missed yesterday and not done today, only after the habit has prior history (avoids day-one noise). */
export function doubleMissRisk(
  state: AppState,
  habitId: string,
  today = localDateString(),
): boolean {
  const yesterday = addDays(today, -1)
  const missedYesterday = !isCompleted(state, habitId, yesterday)
  const notDoneToday = !isCompleted(state, habitId, today)
  if (!missedYesterday || !notDoneToday) return false
  return hasCompletedBefore(state, habitId, yesterday)
}

export function addHabit(state: AppState, name: string): AppState {
  const trimmed = name.trim()
  if (!trimmed) return state
  const maxOrder = Math.max(-1, ...state.habits.map((h) => h.sortOrder))
  const id = `h-${crypto.randomUUID()}`
  return {
    ...state,
    habits: [...state.habits, { id, name: trimmed, sortOrder: maxOrder + 1 }],
  }
}

export function renameHabit(state: AppState, habitId: string, name: string): AppState {
  const trimmed = name.trim()
  if (!trimmed) return state
  return {
    ...state,
    habits: state.habits.map((h) =>
      h.id === habitId ? { ...h, name: trimmed } : h,
    ),
  }
}
