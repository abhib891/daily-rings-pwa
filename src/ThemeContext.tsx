import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { persistTheme, readStoredTheme, type ThemeId } from './lib/themePreview'

type ThemeContextValue = {
  themeId: ThemeId
  setThemeId: (id: ThemeId) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeIdState] = useState<ThemeId>(() => readStoredTheme())

  const setThemeId = useCallback((id: ThemeId) => {
    document.documentElement.dataset.theme = id
    persistTheme(id)
    setThemeIdState(id)
  }, [])

  const value = useMemo(() => ({ themeId, setThemeId }), [themeId, setThemeId])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useAppTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useAppTheme must be used within ThemeProvider')
  }
  return ctx
}
