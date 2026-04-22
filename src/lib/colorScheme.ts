export const COLOR_SCHEME_STORAGE_KEY = 'daily-rings-color-scheme'

export const COLOR_SCHEME_OPTIONS = [
  { id: 'system', label: 'System' },
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
] as const

export type ColorSchemeMode = (typeof COLOR_SCHEME_OPTIONS)[number]['id']

const MODES = new Set<string>(COLOR_SCHEME_OPTIONS.map((o) => o.id))

export function isColorSchemeMode(value: string | undefined | null): value is ColorSchemeMode {
  return Boolean(value && MODES.has(value))
}

export function readStoredColorSchemeMode(): ColorSchemeMode {
  try {
    const raw = localStorage.getItem(COLOR_SCHEME_STORAGE_KEY)
    if (isColorSchemeMode(raw)) return raw
  } catch {
    /* private mode */
  }
  return 'system'
}

export function persistColorSchemeMode(mode: ColorSchemeMode): void {
  try {
    localStorage.setItem(COLOR_SCHEME_STORAGE_KEY, mode)
  } catch {
    /* ignore */
  }
}

export function effectiveAppearanceIsDark(mode: ColorSchemeMode): boolean {
  if (mode === 'dark') return true
  if (mode === 'light') return false
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
}

const THEME_COLOR_LIGHT = '#f4e8ff'
const THEME_COLOR_DARK = '#0a0416'

/** Syncs <html> class, dataset, native color-scheme, and optional theme-color meta. */
export function applyColorSchemeToDocument(mode: ColorSchemeMode): void {
  if (typeof document === 'undefined') return
  const dark = effectiveAppearanceIsDark(mode)
  const root = document.documentElement
  root.dataset.colorScheme = mode
  root.style.colorScheme = dark ? 'dark' : 'light'
  if (dark) root.classList.add('color-scheme-dark')
  else root.classList.remove('color-scheme-dark')

  const meta = document.getElementById('app-theme-color') as HTMLMetaElement | null
  if (meta) meta.setAttribute('content', dark ? THEME_COLOR_DARK : THEME_COLOR_LIGHT)
}

export function subscribeToSystemColorScheme(
  mode: ColorSchemeMode,
  onChange: () => void,
): () => void {
  if (mode !== 'system' || typeof window === 'undefined') return () => {}
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  const handler = () => onChange()
  mq.addEventListener('change', handler)
  return () => mq.removeEventListener('change', handler)
}
