import { GLOBAL_UPGRADES } from '../../lib/gameConfig'
import { clickUpgradeCost } from '../../lib/gameEngine'
import { formatNumber } from '../../lib/format'

export default function UpgradesPanel({
  data,
  purchasedGlobalUpgrades,
  clickUpgradeLevel,
  onBuyGlobalUpgrade,
  onBuyClickUpgrade,
}: {
  data: number
  purchasedGlobalUpgrades: Array<string>
  clickUpgradeLevel: number
  onBuyGlobalUpgrade: (id: string) => void
  onBuyClickUpgrade: () => void
}) {
  const nextClickCost = clickUpgradeCost(clickUpgradeLevel)
  const clickAffordable = data >= nextClickCost

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm uppercase tracking-[0.25em] text-white/50">
        Améliorations
      </h2>

      <button
        onClick={onBuyClickUpgrade}
        disabled={!clickAffordable}
        className={`text-left rounded-lg border p-3 transition-colors ${
          clickAffordable
            ? 'border-matrix-border bg-matrix-panel hover:border-matrix-green/60 hover:bg-matrix-green/5'
            : 'border-matrix-border/50 bg-matrix-panel/50 opacity-50 cursor-not-allowed'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="font-semibold text-white">
              Optimiser la Récolte Manuelle
            </span>
            <p className="text-xs text-white/40">
              Double la valeur de chaque clic. Niveau {clickUpgradeLevel}
            </p>
          </div>
          <span
            className={`text-sm font-semibold tabular-nums shrink-0 ${
              clickAffordable ? 'text-matrix-green' : 'text-white/40'
            }`}
          >
            {formatNumber(nextClickCost)}
          </span>
        </div>
      </button>

      {GLOBAL_UPGRADES.map((upgrade) => {
        const owned = purchasedGlobalUpgrades.includes(upgrade.id)
        const affordable = data >= upgrade.cost
        return (
          <button
            key={upgrade.id}
            onClick={() => onBuyGlobalUpgrade(upgrade.id)}
            disabled={owned || !affordable}
            className={`text-left rounded-lg border p-3 transition-colors ${
              owned
                ? 'border-matrix-green/50 bg-matrix-green/5'
                : affordable
                  ? 'border-matrix-border bg-matrix-panel hover:border-matrix-green/60 hover:bg-matrix-green/5'
                  : 'border-matrix-border/50 bg-matrix-panel/50 opacity-50 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="font-semibold text-white">
                  {upgrade.name}
                </span>
                <p className="text-xs text-white/40">{upgrade.description}</p>
              </div>
              <span
                className={`text-sm font-semibold tabular-nums shrink-0 ${
                  owned
                    ? 'text-matrix-green'
                    : affordable
                      ? 'text-matrix-green'
                      : 'text-white/40'
                }`}
              >
                {owned ? 'ACTIF' : formatNumber(upgrade.cost)}
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
