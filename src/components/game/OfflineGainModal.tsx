import { formatDuration, formatNumber } from '../../lib/format'

export default function OfflineGainModal({
  amount,
  seconds,
  onDismiss,
}: {
  amount: number
  seconds: number
  onDismiss: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-sm rounded-lg border border-matrix-green/50 bg-matrix-panel p-6 box-glow text-center">
        <h2 className="text-matrix-green text-lg font-semibold mb-2">
          Reconnexion établie
        </h2>
        <p className="text-white/60 text-sm mb-4">
          Vos processus ont continué à tourner pendant votre absence (
          {formatDuration(seconds)}).
        </p>
        <p className="text-3xl font-bold text-matrix-green text-glow mb-4">
          +{formatNumber(amount)}
        </p>
        <button
          onClick={onDismiss}
          className="px-4 py-2 rounded border border-matrix-green text-matrix-green hover:bg-matrix-green/10 text-sm"
        >
          Reprendre la collecte
        </button>
      </div>
    </div>
  )
}
