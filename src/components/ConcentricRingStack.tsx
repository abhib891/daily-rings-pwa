import { type CSSProperties } from 'react'
import './ConcentricRingStack.css'

export type ConcentricLayer = {
  id: string
  closed: boolean
  accent: string
}

function layerSizePercent(n: number, index: number): number {
  if (n <= 1) return 100
  const innerPct = 52
  return 100 - (index * (100 - innerPct)) / (n - 1)
}

type ConcentricRingStackProps = {
  layers: ConcentricLayer[]
  /** `master` uses `--master-ring-stack-size` from layout; `sm` for modal cells */
  size: 'master' | 'sm'
}

export function ConcentricRingStack({ layers, size }: ConcentricRingStackProps) {
  const n = layers.length
  if (n === 0) return null

  const track = 'var(--ring-donut-track, var(--ring-track-muted))'
  const stackClass =
    size === 'master'
      ? 'concentric-ring-stack concentric-ring-stack--master'
      : 'concentric-ring-stack concentric-ring-stack--sm'

  return (
    <div className={stackClass} aria-hidden="true">
      {layers.map((layer, i) => {
        const pct = layer.closed ? 1 : 0
        const sizePct = layerSizePercent(n, i)
        return (
          <div
            key={layer.id}
            className="concentric-ring-layer-wrap"
            style={{ width: `${sizePct}%`, height: `${sizePct}%` }}
          >
            <div
              className={size === 'sm' ? 'concentric-ring-donut concentric-ring-donut--sm' : 'concentric-ring-donut'}
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
  )
}
