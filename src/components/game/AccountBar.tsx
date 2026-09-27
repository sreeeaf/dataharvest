import { memo } from 'react'
import { Link } from '@tanstack/react-router'
import { CircleUser } from 'lucide-react'
import type { AuthUser } from '../../hooks/useAuth'
import type { SyncStatus } from '../../hooks/useCloudSync'

const STATUS_LABEL: Record<SyncStatus, string> = {
  idle: '',
  syncing: 'Synchronisation…',
  synced: 'Synchronisé',
  error: 'Erreur de synchro',
}

const ICON_LINK_CLASS =
  'relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors'

function AccountBar({
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
      <div className="flex items-center gap-2">
        <Link
          to="/login"
          className="hidden sm:inline-flex text-xs px-3 py-1.5 rounded border border-matrix-border text-white/60 hover:text-matrix-green hover:border-matrix-green/60 transition-colors"
        >
          Connexion
        </Link>
        <Link
          to="/login"
          aria-label="Connexion"
          title="Connexion"
          className={`${ICON_LINK_CLASS} border-matrix-border text-white/60 hover:text-matrix-green hover:border-matrix-green/60`}
        >
          <CircleUser size={20} />
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      <div className="hidden sm:flex flex-col items-end leading-tight min-w-0">
        <span className="text-matrix-green truncate max-w-[10rem]">
          {user.pseudonym}
        </span>
        {status !== 'idle' && (
          <span
            className={`text-[10px] ${status === 'error' ? 'text-red-400' : 'text-white/30'}`}
          >
            {STATUS_LABEL[status]}
          </span>
        )}
      </div>
      <button
        onClick={onLogout}
        className="hidden sm:inline text-white/40 hover:text-matrix-green underline underline-offset-2"
      >
        Déconnexion
      </button>
      <Link
        to="/login"
        aria-label={`Compte : ${user.pseudonym}`}
        title={user.pseudonym}
        className={`${ICON_LINK_CLASS} border-matrix-green/60 text-matrix-green hover:bg-matrix-green/10`}
      >
        <CircleUser size={20} />
        {status === 'error' && (
          <span className="sm:hidden absolute top-0 right-0 h-2 w-2 rounded-full bg-red-400" />
        )}
      </Link>
    </div>
  )
}

export default memo(AccountBar)
