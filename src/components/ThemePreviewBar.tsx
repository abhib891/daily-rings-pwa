import { COLOR_SCHEME_OPTIONS, type ColorSchemeMode } from '../lib/colorScheme'
import { THEME_OPTIONS, type ThemeId } from '../lib/themePreview'
import { useAppTheme } from '../ThemeContext'
import './ThemePreviewBar.css'

export function ThemePreviewBar() {
  const { themeId, setThemeId, colorSchemeMode, setColorSchemeMode } = useAppTheme()

  return (
    <div className="theme-preview-bar" role="region" aria-label="Theme and appearance">
      <div className="theme-preview-bar__group">
        <label className="theme-preview-bar__label" htmlFor="theme-preview-select">
          Theme
        </label>
        <select
          id="theme-preview-select"
          className="theme-preview-bar__select"
          value={themeId}
          onChange={(e) => setThemeId(e.target.value as ThemeId)}
        >
          {THEME_OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <div className="theme-preview-bar__group">
        <label className="theme-preview-bar__label" htmlFor="color-scheme-select">
          Mode
        </label>
        <select
          id="color-scheme-select"
          className="theme-preview-bar__select theme-preview-bar__select--narrow"
          value={colorSchemeMode}
          onChange={(e) => setColorSchemeMode(e.target.value as ColorSchemeMode)}
        >
          {COLOR_SCHEME_OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
