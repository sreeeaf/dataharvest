import { useMemo } from 'react'
import MatrixRain from './MatrixRain'
import HarvestButton from './game/HarvestButton'
import StatsBar from './game/StatsBar'
import GeneratorList from './game/GeneratorList'
import UpgradesPanel from './game/UpgradesPanel'
import QuestPanel from './game/QuestPanel'
import RebirthPanel from './game/RebirthPanel'
import OfflineGainModal from './game/OfflineGainModal'
import AccountBar from './game/AccountBar'
import CloudSyncModal from './game/CloudSyncModal'
import CollapsibleSection from './game/CollapsibleSection'
import { useGame } from '../hooks/useGame'
import { useAuth } from '../hooks/useAuth'
import { useCloudSync } from '../hooks/useCloudSync'
import {
  computeClickValue,
  computeProductionPerSecond,
  globalUpgradeMultiplier,
  prestigeMultiplier,
} from '../lib/gameEngine'

export default function Game() {
  const {
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
  } = useGame()
  const { user, logout } = useAuth()
  const { status: syncStatus, conflict, keepCloudSave, keepLocalSave } =
    useCloudSync(user, state, loadState, ready)

  // These recompute a per-generator loop and several Math.pow calls; state.data
  // (the balance) changes on every 100ms tick but doesn't affect the result, so
  // depending on the narrower fields avoids redoing the work on every tick.
  const prestige = useMemo(() => prestigeMultiplier(state), [state.fragments])
  const production = useMemo(
    () => computeProductionPerSecond(state),
    [state.generators, state.globalUpgrades, state.fragments, state.completedQuests],
  )
  const clickValue = useMemo(
    () => computeClickValue(state),
    [
      state.clickUpgradeLevel,
      state.globalUpgrades,
      state.fragments,
      state.completedQuests,
    ],
  )
  const multiplier = useMemo(
    () => globalUpgradeMultiplier(state) * prestige,
    [state.globalUpgrades, prestige],
  )

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-matrix-black text-matrix-green">
        <p className="text-sm tracking-widest">
          CHARGEMENT DU SYSTÈME<span className="cursor-blink">_</span>
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <MatrixRain />

      <header className="sticky top-0 z-20 border-b border-matrix-border bg-matrix-black/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2 sm:py-3 grid grid-cols-[2.25rem_1fr_2.25rem] sm:grid-cols-[1fr_auto_1fr] items-center gap-2">
          <div />
          <div className="flex flex-col items-center gap-0.5 sm:gap-1 text-center min-w-0">
            <h1 className="text-lg sm:text-3xl font-bold text-matrix-green text-glow tracking-tight whitespace-nowrap">
              DATA<span className="text-white">://</span>HARVEST
              <span className="cursor-blink text-matrix-green">_</span>
            </h1>
            <p className="text-[9px] sm:text-xs text-white/30 tracking-wide sm:tracking-widest">
              TERMINAL DE COLLECTE — REBOOTS: {state.rebirths}
            </p>
          </div>
          <div className="flex justify-end">
            <AccountBar user={user} status={syncStatus} onLogout={logout} />
          </div>
        </div>
      </header>

      {offlineGain && (
        <OfflineGainModal
          amount={offlineGain.amount}
          seconds={offlineGain.seconds}
          onDismiss={dismissOfflineGain}
        />
      )}

      {conflict && (
        <CloudSyncModal
          updatedAt={conflict.updatedAt}
          onKeepCloud={keepCloudSave}
          onKeepLocal={keepLocalSave}
        />
      )}

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6 flex flex-col gap-6">
        <StatsBar
          data={state.data}
          productionPerSecond={production}
          fragments={state.fragments}
          prestigeMultiplier={prestige}
        />

        <div className="flex justify-center">
          <HarvestButton clickValue={clickValue} onHarvest={harvestClick} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <CollapsibleSection title="Sources de récolte">
            <GeneratorList
              generators={state.generators}
              data={state.data}
              effectiveMultiplier={multiplier}
              onBuy={buyGenerator}
            />
          </CollapsibleSection>

          <CollapsibleSection title="Améliorations">
            <UpgradesPanel
              data={state.data}
              purchasedGlobalUpgrades={state.globalUpgrades}
              clickUpgradeLevel={state.clickUpgradeLevel}
              onBuyGlobalUpgrade={buyGlobalUpgrade}
              onBuyClickUpgrade={buyClickUpgrade}
            />
          </CollapsibleSection>

          <div className="flex flex-col gap-6">
            <CollapsibleSection title="Quêtes">
              <QuestPanel state={state} onClaim={claimQuest} />
            </CollapsibleSection>
            <RebirthPanel
              totalEarned={state.totalEarned}
              fragments={state.fragments}
              onRebirth={rebirth}
            />
          </div>
        </div>

        <footer className="text-center text-[10px] text-white/20 pb-24 sm:pb-4 flex flex-col items-center gap-1">
          <span>Progression sauvegardée automatiquement dans ce navigateur.</span>
          <button
            onClick={() => {
              if (window.confirm('Effacer définitivement votre sauvegarde ?')) {
                resetSave()
              }
            }}
            className="text-white/20 hover:text-matrix-green underline underline-offset-2"
          >
            Réinitialiser la sauvegarde
          </button>
        </footer>
      </div>
    </div>
  )
}
