import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  applyColorSchemeToDocument,
  persistColorSchemeMode,
  readStoredColorSchemeMode,
  subscribeToSystemColorScheme,
  type ColorSchemeMode,
} from './lib/colorScheme'
import { persistTheme, readStoredTheme, type ThemeId } from './lib/themePreview'

type ThemeContextValue = {
  themeId: ThemeId
  setThemeId: (id: ThemeId) => void
  colorSchemeMode: ColorSchemeMode
  setColorSchemeMode: (mode: ColorSchemeMode) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeIdState] = useState<ThemeId>(() => readStoredTheme())
  const [colorSchemeMode, setColorSchemeModeState] = useState<ColorSchemeMode>(() =>
    readStoredColorSchemeMode(),
  )

  useEffect(() => {
    applyColorSchemeToDocument(colorSchemeMode)
    return subscribeToSystemColorScheme(colorSchemeMode, () => {
      applyColorSchemeToDocument(colorSchemeMode)
    })
  }, [colorSchemeMode])

  const setThemeId = useCallback((id: ThemeId) => {
    document.documentElement.dataset.theme = id
    persistTheme(id)
    setThemeIdState(id)
  }, [])

  const setColorSchemeMode = useCallback((mode: ColorSchemeMode) => {
    persistColorSchemeMode(mode)
    setColorSchemeModeState(mode)
  }, [])

  const value = useMemo(
    () => ({ themeId, setThemeId, colorSchemeMode, setColorSchemeMode }),
    [themeId, setThemeId, colorSchemeMode, setColorSchemeMode],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useAppTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useAppTheme must be used within ThemeProvider')
  }
  return ctx
}
