import { formatNumber, formatRate } from '../../lib/format'

export default function StatsBar({
  data,
  productionPerSecond,
  fragments,
  prestigeMultiplier,
}: {
  data: number
  productionPerSecond: number
  fragments: number
  prestigeMultiplier: number
}) {
  return (
    <div className="flex flex-col items-center text-center gap-1">
      <span className="text-xs uppercase tracking-[0.3em] text-white/40">
        Données collectées
      </span>
      <span className="text-5xl sm:text-6xl font-bold text-matrix-green text-glow tabular-nums">
        {formatNumber(data)}
      </span>
      <span className="text-sm text-matrix-green-dim tabular-nums">
        {formatRate(productionPerSecond)}
      </span>
      <div className="flex gap-4 mt-2 text-xs text-white/50">
        <span>
          Fragments de Code:{' '}
          <span className="text-matrix-green">{formatNumber(fragments)}</span>
        </span>
        <span>
          Multiplicateur:{' '}
          <span className="text-matrix-green">
            x{prestigeMultiplier.toFixed(2)}
          </span>
        </span>
      </div>
    </div>
  )
}
