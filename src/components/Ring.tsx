import type { CSSProperties } from 'react'
import './Ring.css'

type RingProps = {
  label: string
  closed: boolean
  atRisk: boolean
  accent: string
  track: string
  onToggle: () => void
}

export function Ring({
  label,
  closed,
  atRisk,
  accent,
  track,
  onToggle,
}: RingProps) {
  const pct = closed ? 1 : 0
  return (
    <button
      type="button"
      className={`ring-card${atRisk ? ' ring-card--risk' : ''}`}
      onClick={onToggle}
      aria-pressed={closed}
      aria-label={`${label}: ${closed ? 'closed' : 'open'}. Tap to toggle.`}
    >
      <div
        className="ring-donut"
        style={
          {
            '--ring-accent': accent,
            '--ring-track': track,
            '--ring-p': String(pct),
          } as CSSProperties
        }
      />
      <span className="ring-label">{label}</span>
      {atRisk && (
        <span className="ring-risk" title="Missed yesterday — tap to close the ring today">
          Never miss twice
        </span>
      )}
    </button>
  )
}
