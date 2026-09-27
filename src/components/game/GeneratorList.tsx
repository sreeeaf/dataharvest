import { useState } from 'react'
import { GENERATORS } from '../../lib/gameConfig'
import { generatorCost } from '../../lib/gameEngine'
import { formatInt, formatNumber, formatRate } from '../../lib/format'

const QUANTITIES = [1, 10, 25] as const

export default function GeneratorList({
  generators,
  data,
  effectiveMultiplier,
  onBuy,
}: {
  generators: Record<string, number>
  data: number
  effectiveMultiplier: number
  onBuy: (id: string, quantity: number) => void
}) {
  const [quantity, setQuantity] = useState<(typeof QUANTITIES)[number]>(1)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm uppercase tracking-[0.25em] text-white/50">
          Sources de récolte
        </h2>
        <div className="flex gap-1">
          {QUANTITIES.map((q) => (
            <button
              key={q}
              onClick={() => setQuantity(q)}
              className={`px-2 py-1 text-xs rounded border ${
                quantity === q
                  ? 'border-matrix-green text-matrix-green bg-matrix-green/10'
                  : 'border-matrix-border text-white/40 hover:text-white/70'
              }`}
            >
              x{q}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {GENERATORS.map((def, index) => {
          const owned = generators[def.id] ?? 0
          const prevOwned =
            index === 0 ? 1 : (generators[GENERATORS[index - 1].id] ?? 0)
          const unlocked =
            index === 0 || prevOwned > 0 || data >= def.baseCost * 0.1
          if (!unlocked) return null

          const cost = generatorCost(def.id, owned, quantity)
          const affordable = data >= cost
          const unitProduction = def.baseProduction * effectiveMultiplier
          const totalProduction = owned * unitProduction

          return (
            <button
              key={def.id}
              onClick={() => onBuy(def.id, quantity)}
              disabled={!affordable}
              className={`text-left rounded-lg border p-3 transition-colors ${
                affordable
                  ? 'border-matrix-border bg-matrix-panel hover:border-matrix-green/60 hover:bg-matrix-green/5'
                  : 'border-matrix-border/50 bg-matrix-panel/50 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-white truncate">
                      {def.name}
                    </span>
                    <span className="text-xs text-matrix-green-dim shrink-0">
                      x{formatInt(owned)}
                    </span>
                  </div>
                  <p className="text-xs text-white/40 truncate">
                    {def.description}
                  </p>
                  {owned > 0 && (
                    <p className="text-xs text-matrix-green/70 mt-0.5">
                      {formatRate(totalProduction)} au total
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <div
                    className={`text-sm font-semibold tabular-nums ${
                      affordable ? 'text-matrix-green' : 'text-white/40'
                    }`}
                  >
                    {formatNumber(cost)}
                  </div>
                  <div className="text-[10px] text-white/30">
                    +{formatRate(unitProduction)}/u
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
