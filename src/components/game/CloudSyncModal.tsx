import { formatDuration } from '../../lib/format'

export default function CloudSyncModal({
  updatedAt,
  onKeepCloud,
  onKeepLocal,
}: {
  updatedAt: string
  onKeepCloud: () => void
  onKeepLocal: () => void
}) {
  const seconds = Math.max(0, (Date.now() - new Date(updatedAt).getTime()) / 1000)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-sm rounded-lg border border-matrix-green/50 bg-matrix-panel p-6 box-glow text-center">
        <h2 className="text-matrix-green text-lg font-semibold mb-2">
          Sauvegarde cloud détectée
        </h2>
        <p className="text-white/60 text-sm mb-4">
          Une progression a été synchronisée il y a {formatDuration(seconds)}{' '}
          depuis un autre appareil ou navigateur. Que voulez-vous faire ?
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={onKeepCloud}
            className="px-4 py-2 rounded border border-matrix-green text-matrix-green hover:bg-matrix-green/10 text-sm"
          >
            Charger la sauvegarde cloud (écrase la progression locale)
          </button>
          <button
            onClick={onKeepLocal}
            className="px-4 py-2 rounded border border-matrix-border text-white/60 hover:text-white text-sm"
          >
            Garder ma progression locale (écrase le cloud)
          </button>
        </div>
      </div>
    </div>
  )
}
