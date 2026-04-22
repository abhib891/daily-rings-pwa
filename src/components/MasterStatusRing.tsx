import { ConcentricRingStack, type ConcentricLayer } from './ConcentricRingStack'
import './MasterStatusRing.css'

export type MasterRingLayer = ConcentricLayer

type MasterStatusRingProps = {
  layers: MasterRingLayer[]
  /** True if any underlying habit is in “never miss twice” risk today. */
  anyAtRisk: boolean
  onOpenPastWeek: () => void
  pastWeekModalOpen: boolean
}

export function MasterStatusRing({
  layers,
  anyAtRisk,
  onOpenPastWeek,
  pastWeekModalOpen,
}: MasterStatusRingProps) {
  const n = layers.length
  if (n === 0) return null

  const doneCount = layers.filter((l) => l.closed).length

  return (
    <button
      type="button"
      className={`ring-card master-ring-card${anyAtRisk ? ' ring-card--risk' : ''}`}
      onClick={onOpenPastWeek}
      aria-haspopup="dialog"
      aria-expanded={pastWeekModalOpen}
      aria-label={`Today’s status: ${doneCount} of ${n} complete for today. Opens past week as rings.`}
    >
      <ConcentricRingStack layers={layers} size="master" />
      <span className="master-ring-title">Today&apos;s status</span>
      <span className="master-ring-hint">Tap for past week</span>
    </button>
  )
}
