import { useEffect, useId, useRef } from 'react'
import { ConcentricRingStack, type ConcentricLayer } from './ConcentricRingStack'
import './PastWeekRingsModal.css'

export type PastWeekRingDay = {
  iso: string
  /** Single-letter weekday */
  dow: string
  isToday: boolean
  layers: ConcentricLayer[]
}

type PastWeekRingsModalProps = {
  open: boolean
  onClose: () => void
  days: PastWeekRingDay[]
}

export function PastWeekRingsModal({ open, onClose, days }: PastWeekRingsModalProps) {
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="past-week-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="past-week-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="past-week-modal__head">
          <h2 id={titleId} className="past-week-modal__title">
            Past week · rings
          </h2>
          <button
            ref={closeRef}
            type="button"
            className="past-week-modal__close"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <ul className="past-week-modal__grid">
          {days.map((d) => (
            <li
              key={d.iso}
              className={`past-week-modal__cell${d.isToday ? ' past-week-modal__cell--today' : ''}`}
            >
              <span className="past-week-modal__dow" title={d.iso}>
                {d.dow}
                {d.isToday ? ' · today' : ''}
              </span>
              <ConcentricRingStack layers={d.layers} size="sm" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
