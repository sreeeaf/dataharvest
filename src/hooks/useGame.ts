import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import {
  createInitialState,
  gameReducer,
  computeProductionPerSecond,
  mergeLoadedState,
  type GameState,
} from '../lib/gameEngine'
import { OFFLINE_CAP_SECONDS } from '../lib/gameConfig'

const SAVE_KEY = 'data-harvest-save-v1'
const AUTOSAVE_INTERVAL_MS = 5_000
const TICK_INTERVAL_MS = 100

function loadFromStorage(): GameState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as GameState
  } catch {
    return null
  }
}

function saveToStorage(state: GameState) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(state))
  } catch {
    // storage unavailable — ignore, game keeps running in-memory
  }
}

export interface OfflineGain {
  amount: number
  seconds: number
}

export function useGame() {
  const [state, dispatch] = useReducer(gameReducer, undefined, () =>
    createInitialState(),
  )
  const [ready, setReady] = useState(false)
  const [offlineGain, setOfflineGain] = useState<OfflineGain | null>(null)
  const lastTickRef = useRef<number>(Date.now())
  const stateRef = useRef<GameState>(state)
  stateRef.current = state

  useEffect(() => {
    const saved = loadFromStorage()
    const merged = mergeLoadedState(saved)
    if (saved) {
      const elapsedSeconds = Math.min(
        Math.max(0, (Date.now() - (saved.lastSave ?? Date.now())) / 1000),
        OFFLINE_CAP_SECONDS,
      )
      const production = computeProductionPerSecond(merged)
      const gained = production * elapsedSeconds
      if (gained > 1 && elapsedSeconds > 30) {
        merged.data += gained
        merged.totalEarned += gained
        merged.lifetimeEarned += gained
        setOfflineGain({ amount: gained, seconds: elapsedSeconds })
      }
    }
    dispatch({ type: 'LOAD_STATE', state: merged })
    lastTickRef.current = Date.now()
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    const interval = window.setInterval(() => {
      const now = Date.now()
      const dtSeconds = (now - lastTickRef.current) / 1000
      lastTickRef.current = now
      dispatch({ type: 'TICK', dtSeconds })
    }, TICK_INTERVAL_MS)
    return () => window.clearInterval(interval)
  }, [ready])

  useEffect(() => {
    if (!ready) return
    const interval = window.setInterval(() => {
      saveToStorage({ ...stateRef.current, lastSave: Date.now() })
    }, AUTOSAVE_INTERVAL_MS)
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        saveToStorage({ ...stateRef.current, lastSave: Date.now() })
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('beforeunload', handleVisibility)
    return () => {
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('beforeunload', handleVisibility)
    }
  }, [ready])

  const harvestClick = useCallback(() => dispatch({ type: 'HARVEST_CLICK' }), [])
  const buyGenerator = useCallback(
    (id: string, quantity: number) =>
      dispatch({ type: 'BUY_GENERATOR', id, quantity }),
    [],
  )
  const buyGlobalUpgrade = useCallback(
    (id: string) => dispatch({ type: 'BUY_GLOBAL_UPGRADE', id }),
    [],
  )
  const buyClickUpgrade = useCallback(
    () => dispatch({ type: 'BUY_CLICK_UPGRADE' }),
    [],
  )
  const claimQuest = useCallback(
    (id: string) => dispatch({ type: 'CLAIM_QUEST', id }),
    [],
  )
  const rebirth = useCallback(() => dispatch({ type: 'REBIRTH' }), [])
  const dismissOfflineGain = useCallback(() => setOfflineGain(null), [])
  const loadState = useCallback(
    (next: GameState) => dispatch({ type: 'LOAD_STATE', state: next }),
    [],
  )

  const resetSave = useCallback(() => {
    window.localStorage.removeItem(SAVE_KEY)
    dispatch({ type: 'LOAD_STATE', state: createInitialState() })
  }, [])

  return {
    state,
    ready,
    offlineGain,
    dismissOfflineGain,
    harvestClick,
    buyGenerator,
    buyGlobalUpgrade,
    buyClickUpgrade,
    claimQuest,
    rebirth,
    resetSave,
    loadState,
  }
}
