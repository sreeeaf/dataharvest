import { useCallback, useEffect, useRef, useState } from 'react'
import { mergeLoadedState, type GameState } from '../lib/gameEngine'
import type { AuthUser } from './useAuth'
import { getLocalSaveTimestamp } from './useGame'

const SYNC_INTERVAL_MS = 30_000
// Id of the account whose save this browser is already linked to. Once the
// player has chosen which save to keep, later logins silently keep the most
// recent save instead of asking again.
const LINK_KEY = 'data-harvest-cloud-link-v1'

function getLinkedUserId(): string | null {
  try {
    return window.localStorage.getItem(LINK_KEY)
  } catch {
    return null
  }
}

function setLinkedUserId(userId: string) {
  try {
    window.localStorage.setItem(LINK_KEY, userId)
  } catch {
    // storage unavailable — the player may be asked again next time
  }
}

function hasProgress(state: GameState): boolean {
  return state.lifetimeEarned > 0 || state.rebirths > 0
}

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error'

export interface CloudConflict {
  cloudState: GameState
  updatedAt: string
}

async function pushToCloud(state: GameState): Promise<boolean> {
  try {
    const res = await fetch('/api/game-save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state }),
    })
    return res.ok
  } catch {
    return false
  }
}

export function useCloudSync(
  user: AuthUser | null,
  state: GameState,
  loadState: (next: GameState) => void,
  ready: boolean,
) {
  const [status, setStatus] = useState<SyncStatus>('idle')
  const [conflict, setConflict] = useState<CloudConflict | null>(null)
  const stateRef = useRef(state)
  stateRef.current = state
  const syncedUserId = useRef<string | null>(null)

  useEffect(() => {
    if (!user) {
      syncedUserId.current = null
      setStatus('idle')
      return
    }
    if (!ready) return
    if (syncedUserId.current === user.id) return
    syncedUserId.current = user.id

    let cancelled = false
    ;(async () => {
      setStatus('syncing')
      try {
        const res = await fetch('/api/game-save', { method: 'GET' })
        if (cancelled) return
        if (res.status === 204) {
          const ok = await pushToCloud(stateRef.current)
          if (ok) setLinkedUserId(user.id)
          if (!cancelled) setStatus(ok ? 'synced' : 'error')
          return
        }
        if (!res.ok) throw new Error('cloud fetch failed')
        const payload = (await res.json()) as {
          state: GameState
          updatedAt: string
        }
        if (cancelled) return

        const alreadyLinked = getLinkedUserId() === user.id
        if (!alreadyLinked && hasProgress(stateRef.current)) {
          // First login on this browser with local progress: ask once.
          setConflict({ cloudState: payload.state, updatedAt: payload.updatedAt })
          setStatus('synced')
          return
        }

        const cloudTime = new Date(payload.updatedAt).getTime()
        // Not linked here yet but no local progress: just take the cloud save.
        const cloudIsNewer =
          !alreadyLinked || cloudTime > getLocalSaveTimestamp()
        if (cloudIsNewer) {
          loadState(mergeLoadedState(payload.state))
          setLinkedUserId(user.id)
          setStatus('synced')
        } else {
          const ok = await pushToCloud(stateRef.current)
          if (ok) setLinkedUserId(user.id)
          if (!cancelled) setStatus(ok ? 'synced' : 'error')
        }
      } catch {
        if (!cancelled) setStatus('error')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [user, ready, loadState])

  useEffect(() => {
    if (!user) return
    const interval = window.setInterval(() => {
      setStatus('syncing')
      pushToCloud(stateRef.current).then((ok) => {
        setStatus(ok ? 'synced' : 'error')
      })
    }, SYNC_INTERVAL_MS)
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        pushToCloud(stateRef.current)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('beforeunload', handleVisibility)
    return () => {
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('beforeunload', handleVisibility)
    }
  }, [user])

  const keepCloudSave = useCallback(() => {
    if (!conflict) return
    loadState(mergeLoadedState(conflict.cloudState))
    if (user) setLinkedUserId(user.id)
    setConflict(null)
  }, [conflict, loadState, user])

  const keepLocalSave = useCallback(() => {
    if (!conflict) return
    setConflict(null)
    setStatus('syncing')
    pushToCloud(stateRef.current).then((ok) => {
      if (ok && user) setLinkedUserId(user.id)
      setStatus(ok ? 'synced' : 'error')
    })
  }, [conflict, user])

  return { status, conflict, keepCloudSave, keepLocalSave }
}
