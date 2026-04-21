export const THEME_STORAGE_KEY = 'daily-rings-theme'

export const THEME_OPTIONS = [
  { id: 'aurora', label: 'Aurora Pulse' },
  { id: 'calm', label: 'Calm Sky' },
  { id: 'sunrise', label: 'Sunrise Sprint' },
  { id: 'neon', label: 'Neon Track' },
  { id: 'volt', label: 'Tidal Voltage' },
] as const

export type ThemeId = (typeof THEME_OPTIONS)[number]['id']

export const THEME_IDS: ThemeId[] = THEME_OPTIONS.map((o) => o.id)

const IDS = new Set<string>(THEME_IDS)

export function isThemeId(value: string | undefined | null): value is ThemeId {
  return Boolean(value && IDS.has(value))
}

export function readStoredTheme(): ThemeId {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY)
    if (isThemeId(raw)) return raw
  } catch {
    /* private mode */
  }
  return 'aurora'
}

export function persistTheme(id: ThemeId): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, id)
  } catch {
    /* ignore */
  }
}

/** Habit ring stroke colors per theme (shown in the main grid). */
export const THEME_RING_ACCENTS: Record<ThemeId, string[]> = {
  aurora: ['#fb7185', '#a3e635', '#22d3ee', '#e879f9', '#fbbf24'],
  calm: ['#ff375f', '#30d158', '#0a84ff', '#bf5af2', '#ff9f0a'],
  sunrise: ['#fb7185', '#fb923c', '#fbbf24', '#ec4899', '#a78bfa'],
  neon: ['#84cc16', '#22d3ee', '#f472b6', '#eab308', '#38bdf8'],
  volt: ['#f43f5e', '#14b8a6', '#e11d48', '#2dd4bf', '#f97316'],
}
