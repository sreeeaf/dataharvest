import { useState } from 'react'
import { fragmentsForRebirth } from '../../lib/gameEngine'
import { formatBits, formatNumber } from '../../lib/format'
import { REBIRTH_MIN_TOTAL } from '../../lib/gameConfig'

export default function RebirthPanel({
  totalEarned,
  fragments,
  onRebirth,
}: {
  totalEarned: number
  fragments: number
  onRebirth: () => void
}) {
  const [confirming, setConfirming] = useState(false)
  const gain = fragmentsForRebirth(totalEarned)
  const canRebirth = gain >= 1
  const progress = Math.min(1, totalEarned / REBIRTH_MIN_TOTAL)

  return (
    <div className="rounded-lg border border-matrix-green/40 bg-matrix-panel p-4 flex flex-col gap-3">
      <h2 className="text-sm uppercase tracking-[0.25em] text-white/50">
        Reboot du Système
      </h2>
      <p className="text-xs text-white/40">
        Réinitialisez votre progression contre des Fragments de Code.
        Chaque fragment ajoute +2% de production, pour toujours.
      </p>

      {!canRebirth && (
        <div className="flex flex-col gap-1">
          <div className="h-1.5 w-full rounded-full bg-matrix-border overflow-hidden">
            <div
              className="h-full bg-matrix-green-dim"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-white/30">
            {formatBits(totalEarned)} / {formatBits(REBIRTH_MIN_TOTAL)}{' '}
            données requises
          </span>
        </div>
      )}

      <div className="text-xs text-white/50">
        Fragments actuels:{' '}
        <span className="text-matrix-green">{formatNumber(fragments)}</span>
      </div>

      {canRebirth && (
        <div className="text-xs text-white/50">
          Gain estimé:{' '}
          <span className="text-matrix-green">+{formatNumber(gain)}</span>{' '}
          fragments
        </div>
      )}

      {!confirming ? (
        <button
          onClick={() => setConfirming(true)}
          disabled={!canRebirth}
          className={`text-sm px-3 py-2 rounded border font-semibold ${
            canRebirth
              ? 'border-matrix-green text-matrix-green hover:bg-matrix-green/10'
              : 'border-matrix-border text-white/30 cursor-not-allowed'
          }`}
        >
          Initier le Reboot
        </button>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-matrix-green">
            Confirmer ? Toute la progression actuelle sera perdue.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                onRebirth()
                setConfirming(false)
              }}
              className="text-sm px-3 py-2 rounded border border-matrix-green text-matrix-green hover:bg-matrix-green/10 font-semibold"
            >
              Confirmer le Reboot
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="text-sm px-3 py-2 rounded border border-matrix-border text-white/50 hover:text-white"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
