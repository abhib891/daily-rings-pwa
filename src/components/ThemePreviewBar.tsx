import { THEME_OPTIONS, type ThemeId } from '../lib/themePreview'
import { useAppTheme } from '../ThemeContext'
import './ThemePreviewBar.css'

export function ThemePreviewBar() {
  const { themeId, setThemeId } = useAppTheme()

  return (
    <div className="theme-preview-bar" role="region" aria-label="Theme preview">
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
  )
}
