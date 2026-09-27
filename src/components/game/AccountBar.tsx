import { Link } from '@tanstack/react-router'
import type { AuthUser } from '../../hooks/useAuth'
import type { SyncStatus } from '../../hooks/useCloudSync'

const STATUS_LABEL: Record<SyncStatus, string> = {
  idle: '',
  syncing: 'Synchronisation…',
  synced: 'Synchronisé',
  error: 'Erreur de synchro',
}

export default function AccountBar({
  user,
  status,
  onLogout,
}: {
  user: AuthUser | null
  status: SyncStatus
  onLogout: () => void
}) {
  if (!user) {
    return (
      <Link
        to="/login"
        className="text-xs px-3 py-1.5 rounded border border-matrix-border text-white/50 hover:text-matrix-green hover:border-matrix-green/60 transition-colors"
      >
        Se connecter / Créer un compte
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-white/50">
        Connecté: <span className="text-matrix-green">{user.pseudonym}</span>
      </span>
      {status !== 'idle' && (
        <span
          className={`text-[10px] ${status === 'error' ? 'text-red-400' : 'text-white/30'}`}
        >
          {STATUS_LABEL[status]}
        </span>
      )}
      <button
        onClick={onLogout}
        className="text-white/40 hover:text-matrix-green underline underline-offset-2"
      >
        Se déconnecter
      </button>
    </div>
  )
}
