import { type CSSProperties } from 'react'
import './MasterStatusRing.css'

export type MasterRingLayer = {
  id: string
  closed: boolean
  accent: string
}

type MasterStatusRingProps = {
  layers: MasterRingLayer[]
  /** True if any underlying habit is in “never miss twice” risk today. */
  anyAtRisk: boolean
}

function layerSizePercent(n: number, index: number): number {
  if (n <= 1) return 100
  const innerPct = 52
  return 100 - (index * (100 - innerPct)) / (n - 1)
}

export function MasterStatusRing({ layers, anyAtRisk }: MasterStatusRingProps) {
  const n = layers.length
  if (n === 0) return null

  const doneCount = layers.filter((l) => l.closed).length
  const track = 'var(--ring-track-muted)'

  return (
    <div
      className={`ring-card master-ring-card${anyAtRisk ? ' ring-card--risk' : ''}`}
      role="group"
      aria-label={`Today’s status: ${doneCount} of ${n} complete for today.`}
    >
      <div className="master-ring-stack" aria-hidden="true">
        {layers.map((layer, i) => {
          const pct = layer.closed ? 1 : 0
          const sizePct = layerSizePercent(n, i)
          return (
            <div
              key={layer.id}
              className="master-ring-layer-wrap"
              style={{ width: `${sizePct}%`, height: `${sizePct}%` }}
            >
              <div
                className="master-ring-donut"
                style={
                  {
                    '--ring-accent': layer.accent,
                    '--ring-track': track,
                    '--ring-p': String(pct),
                  } as CSSProperties
                }
              />
            </div>
          )
        })}
      </div>
      <p className="master-ring-title">Today&apos;s status</p>
    </div>
  )
}
