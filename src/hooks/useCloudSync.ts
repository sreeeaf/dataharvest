import { useCallback, useEffect, useRef, useState } from 'react'
import { mergeLoadedState, type GameState } from '../lib/gameEngine'
import type { AuthUser } from './useAuth'

const SYNC_INTERVAL_MS = 30_000

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
    if (syncedUserId.current === user.id) return
    syncedUserId.current = user.id

    let cancelled = false
    ;(async () => {
      setStatus('syncing')
      try {
        const res = await fetch('/api/game-save', { method: 'GET' })
        if (cancelled) return
        if (res.status === 204) {
          await pushToCloud(stateRef.current)
          if (!cancelled) setStatus('synced')
          return
        }
        if (!res.ok) throw new Error('cloud fetch failed')
        const payload = (await res.json()) as {
          state: GameState
          updatedAt: string
        }
        if (cancelled) return
        setConflict({ cloudState: payload.state, updatedAt: payload.updatedAt })
        setStatus('synced')
      } catch {
        if (!cancelled) setStatus('error')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [user])

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
    setConflict(null)
  }, [conflict, loadState])

  const keepLocalSave = useCallback(() => {
    if (!conflict) return
    setConflict(null)
    setStatus('syncing')
    pushToCloud(stateRef.current).then((ok) => setStatus(ok ? 'synced' : 'error'))
  }, [conflict])

  return { status, conflict, keepCloudSave, keepLocalSave }
}
