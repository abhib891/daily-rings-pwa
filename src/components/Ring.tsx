import { useEffect, useRef, useState, type CSSProperties } from 'react'
import './Ring.css'

type RingProps = {
  label: string
  closed: boolean
  atRisk: boolean
  accent: string
  track: string
  onToggle: () => void
  onRename: (name: string) => void
}

export function Ring({
  label,
  closed,
  atRisk,
  accent,
  track,
  onToggle,
  onRename,
}: RingProps) {
  const pct = closed ? 1 : 0
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(label)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setDraft(label)
  }, [label])

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  function commitRename() {
    const t = draft.trim()
    if (!t) {
      setDraft(label)
      setEditing(false)
      return
    }
    if (t !== label) onRename(t)
    setEditing(false)
  }

  function cancelRename() {
    setDraft(label)
    setEditing(false)
  }

  return (
    <div
      className={`ring-card${atRisk ? ' ring-card--risk' : ''}`}
      role="group"
      aria-label={`Habit: ${label}`}
    >
      <button
        type="button"
        className="ring-donut-btn"
        onClick={onToggle}
        aria-pressed={closed}
        aria-label={`${label}: ${closed ? 'completed for today' : 'not completed'}. Tap to ${closed ? 'remove today’s completion' : 'mark complete for today'}.`}
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
      </button>

      {editing ? (
        <input
          ref={inputRef}
          type="text"
          className="ring-rename-input"
          value={draft}
          maxLength={80}
          aria-label={`Rename ${label}`}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => commitRename()}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              commitRename()
            }
            if (e.key === 'Escape') {
              e.preventDefault()
              cancelRename()
            }
          }}
        />
      ) : (
        <button
          type="button"
          className="ring-label-btn"
          title="Tap to rename"
          onClick={() => setEditing(true)}
        >
          {label}
        </button>
      )}

      {atRisk && (
        <span className="ring-risk" title="Missed yesterday — tap the ring to complete today">
          Never miss twice
        </span>
      )}
    </div>
  )
}
