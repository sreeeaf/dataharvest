import { QUESTS } from '../../lib/gameConfig'
import { isQuestComplete, type GameState } from '../../lib/gameEngine'
import { formatBits } from '../../lib/format'

function rewardLabel(reward: (typeof QUESTS)[number]['reward']): string {
  if (reward.data) return `+${formatBits(reward.data)}`
  if (reward.fragments) return `+${reward.fragments} frag.`
  if (reward.permanentBonus?.production) {
    return `+${Math.round(reward.permanentBonus.production * 100)}% prod.`
  }
  if (reward.permanentBonus?.click) {
    return `+${Math.round(reward.permanentBonus.click * 100)}% clic`
  }
  return ''
}

export default function QuestPanel({
  state,
  onClaim,
}: {
  state: GameState
  onClaim: (id: string) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        {QUESTS.map((quest) => {
          const claimed = state.completedQuests.includes(quest.id)
          const complete = claimed || isQuestComplete(state, quest.id)
          return (
            <div
              key={quest.id}
              className={`rounded-lg border p-3 ${
                claimed
                  ? 'border-matrix-green/30 bg-matrix-green/5 opacity-60'
                  : complete
                    ? 'border-matrix-green/60 bg-matrix-green/5'
                    : 'border-matrix-border bg-matrix-panel'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs whitespace-nowrap ${claimed ? 'text-matrix-green' : 'text-white/30'}`}
                    >
                      {claimed ? '[x]' : '[ ]'}
                    </span>
                    <span className="font-semibold text-white text-sm">
                      {quest.title}
                    </span>
                  </div>
                  <p className="text-xs text-white/40 mt-0.5">
                    {quest.description}
                  </p>
                </div>
                {!claimed && (
                  <button
                    onClick={() => onClaim(quest.id)}
                    disabled={!complete}
                    className={`shrink-0 text-xs px-2 py-1 rounded border ${
                      complete
                        ? 'border-matrix-green text-matrix-green hover:bg-matrix-green/10'
                        : 'border-matrix-border text-white/30 cursor-not-allowed'
                    }`}
                  >
                    {rewardLabel(quest.reward)}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
