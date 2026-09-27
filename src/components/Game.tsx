import MatrixRain from './MatrixRain'
import HarvestButton from './game/HarvestButton'
import StatsBar from './game/StatsBar'
import GeneratorList from './game/GeneratorList'
import UpgradesPanel from './game/UpgradesPanel'
import QuestPanel from './game/QuestPanel'
import RebirthPanel from './game/RebirthPanel'
import OfflineGainModal from './game/OfflineGainModal'
import { useGame } from '../hooks/useGame'
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
  } = useGame()

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-matrix-black text-matrix-green">
        <p className="text-sm tracking-widest">
          CHARGEMENT DU SYSTÈME<span className="cursor-blink">_</span>
        </p>
      </div>
    )
  }

  const production = computeProductionPerSecond(state)
  const clickValue = computeClickValue(state)
  const multiplier =
    globalUpgradeMultiplier(state) * prestigeMultiplier(state)

  return (
    <div className="min-h-screen relative">
      <MatrixRain />

      {offlineGain && (
        <OfflineGainModal
          amount={offlineGain.amount}
          seconds={offlineGain.seconds}
          onDismiss={dismissOfflineGain}
        />
      )}

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6 flex flex-col gap-6">
        <header className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-matrix-green text-glow tracking-tight">
            DATA<span className="text-white">://</span>HARVEST
            <span className="cursor-blink text-matrix-green">_</span>
          </h1>
          <p className="text-xs text-white/30 tracking-widest">
            TERMINAL DE COLLECTE — REBOOTS: {state.rebirths}
          </p>
        </header>

        <StatsBar
          data={state.data}
          productionPerSecond={production}
          fragments={state.fragments}
          prestigeMultiplier={prestigeMultiplier(state)}
        />

        <div className="flex justify-center">
          <HarvestButton clickValue={clickValue} onHarvest={harvestClick} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-1 rounded-xl border border-matrix-border bg-matrix-dark/60 p-4">
            <GeneratorList
              generators={state.generators}
              data={state.data}
              effectiveMultiplier={multiplier}
              onBuy={buyGenerator}
            />
          </section>

          <section className="lg:col-span-1 rounded-xl border border-matrix-border bg-matrix-dark/60 p-4">
            <UpgradesPanel
              data={state.data}
              purchasedGlobalUpgrades={state.globalUpgrades}
              clickUpgradeLevel={state.clickUpgradeLevel}
              onBuyGlobalUpgrade={buyGlobalUpgrade}
              onBuyClickUpgrade={buyClickUpgrade}
            />
          </section>

          <section className="lg:col-span-1 flex flex-col gap-6">
            <div className="rounded-xl border border-matrix-border bg-matrix-dark/60 p-4">
              <QuestPanel state={state} onClaim={claimQuest} />
            </div>
            <RebirthPanel
              totalEarned={state.totalEarned}
              fragments={state.fragments}
              onRebirth={rebirth}
            />
          </section>
        </div>

        <footer className="text-center text-[10px] text-white/20 pb-4 flex flex-col items-center gap-1">
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
