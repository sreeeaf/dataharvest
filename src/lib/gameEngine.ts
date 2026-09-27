import {
  BASE_CLICK_VALUE,
  CLICK_UPGRADE_BASE_COST,
  CLICK_UPGRADE_GROWTH,
  COST_GROWTH,
  FRAGMENT_BONUS_PER_UNIT,
  GENERATORS,
  GLOBAL_UPGRADES,
  PRODUCTION_BREAKPOINT_INTERVAL,
  PRODUCTION_BREAKPOINT_MULTIPLIER,
  QUESTS,
  REBIRTH_MIN_TOTAL,
} from './gameConfig'

export interface GameState {
  data: number
  totalEarned: number
  lifetimeEarned: number
  manualClicks: number
  generators: Record<string, number>
  globalUpgrades: Array<string>
  clickUpgradeLevel: number
  fragments: number
  rebirths: number
  completedQuests: Array<string>
  lastSave: number
}

export const SAVE_VERSION = 1

export function createInitialState(): GameState {
  const generators: Record<string, number> = {}
  for (const g of GENERATORS) generators[g.id] = 0
  return {
    data: 0,
    totalEarned: 0,
    lifetimeEarned: 0,
    manualClicks: 0,
    generators,
    globalUpgrades: [],
    clickUpgradeLevel: 0,
    fragments: 0,
    rebirths: 0,
    completedQuests: [],
    lastSave: Date.now(),
  }
}

export function mergeLoadedState(saved: Partial<GameState> | null): GameState {
  const initial = createInitialState()
  if (!saved) return initial
  return {
    ...initial,
    ...saved,
    generators: { ...initial.generators, ...(saved.generators ?? {}) },
    globalUpgrades: saved.globalUpgrades ?? [],
    completedQuests: saved.completedQuests ?? [],
  }
}

export function totalGeneratorsOwned(state: GameState): number {
  return Object.values(state.generators).reduce((a, b) => a + b, 0)
}

export function distinctGeneratorTypesOwned(state: GameState): number {
  return Object.values(state.generators).filter((n) => n > 0).length
}

export function prestigeMultiplier(state: GameState): number {
  return 1 + state.fragments * FRAGMENT_BONUS_PER_UNIT
}

export function globalUpgradeMultiplier(state: GameState): number {
  return Math.pow(2, state.globalUpgrades.length)
}

export function clickUpgradeMultiplier(state: GameState): number {
  return Math.pow(2, state.clickUpgradeLevel)
}

export function generatorCost(
  generatorId: string,
  owned: number,
  quantity: number,
): number {
  const def = GENERATORS.find((g) => g.id === generatorId)
  if (!def) return Infinity
  if (COST_GROWTH === 1) return def.baseCost * quantity
  const growthPow = Math.pow(COST_GROWTH, owned)
  const sum =
    (Math.pow(COST_GROWTH, quantity) - 1) / (COST_GROWTH - 1)
  return Math.ceil(def.baseCost * growthPow * sum)
}

export function maxAffordableGenerators(
  generatorId: string,
  owned: number,
  data: number,
): number {
  const def = GENERATORS.find((g) => g.id === generatorId)
  if (!def || data <= 0) return 0
  const firstCost = def.baseCost * Math.pow(COST_GROWTH, owned)
  let n = Math.floor(
    Math.log(1 + (data * (COST_GROWTH - 1)) / firstCost) / Math.log(COST_GROWTH),
  )
  // generatorCost rounds up, so the closed-form estimate can overshoot by one.
  while (n > 0 && generatorCost(generatorId, owned, n) > data) n--
  return Math.max(0, n)
}

export function clickUpgradeCost(level: number): number {
  return Math.ceil(
    CLICK_UPGRADE_BASE_COST * Math.pow(CLICK_UPGRADE_GROWTH, level),
  )
}

export function generatorBreakpointMultiplier(owned: number): number {
  return Math.pow(
    PRODUCTION_BREAKPOINT_MULTIPLIER,
    Math.floor(owned / PRODUCTION_BREAKPOINT_INTERVAL),
  )
}

export function questProductionMultiplier(state: GameState): number {
  let bonus = 0
  for (const id of state.completedQuests) {
    const q = QUESTS.find((x) => x.id === id)
    if (q?.reward.permanentBonus?.production) {
      bonus += q.reward.permanentBonus.production
    }
  }
  return 1 + bonus
}

export function questClickMultiplier(state: GameState): number {
  let bonus = 0
  for (const id of state.completedQuests) {
    const q = QUESTS.find((x) => x.id === id)
    if (q?.reward.permanentBonus?.click) {
      bonus += q.reward.permanentBonus.click
    }
  }
  return 1 + bonus
}

export function computeProductionPerSecond(state: GameState): number {
  let base = 0
  for (const g of GENERATORS) {
    const owned = state.generators[g.id] ?? 0
    base += owned * g.baseProduction * generatorBreakpointMultiplier(owned)
  }
  return (
    base *
    globalUpgradeMultiplier(state) *
    prestigeMultiplier(state) *
    questProductionMultiplier(state)
  )
}

export function computeClickValue(state: GameState): number {
  return (
    BASE_CLICK_VALUE *
    clickUpgradeMultiplier(state) *
    globalUpgradeMultiplier(state) *
    prestigeMultiplier(state) *
    questClickMultiplier(state)
  )
}

export function fragmentsForRebirth(totalEarned: number): number {
  if (totalEarned < REBIRTH_MIN_TOTAL) return 0
  return Math.floor(Math.sqrt(totalEarned / 10_000))
}

export function canRebirth(state: GameState): boolean {
  return fragmentsForRebirth(state.totalEarned) >= 1
}

export function isQuestComplete(state: GameState, questId: string): boolean {
  switch (questId) {
    case 'q1':
      return state.manualClicks >= 1
    case 'q2':
      return (state.generators['script'] ?? 0) >= 1
    case 'q3':
      return totalGeneratorsOwned(state) >= 10
    case 'q4':
      return distinctGeneratorTypesOwned(state) >= 3
    case 'q5':
      return state.totalEarned >= 1_000
    case 'q6':
      return state.globalUpgrades.length >= 1 || state.clickUpgradeLevel >= 1
    case 'q7':
      return state.totalEarned >= REBIRTH_MIN_TOTAL
    case 'q8':
      return state.rebirths >= 1
    case 'q9':
      return state.totalEarned >= 100_000
    case 'q10':
      return distinctGeneratorTypesOwned(state) >= GENERATORS.length
    case 'q11':
      return Object.values(state.generators).some((n) => n >= 50)
    case 'q12':
      return totalGeneratorsOwned(state) >= 100
    case 'q13':
      return state.rebirths >= 3
    case 'q14':
      return state.fragments >= 25
    case 'q15':
      return state.lifetimeEarned >= 10_000_000
    case 'q16':
      return state.clickUpgradeLevel >= 10
    case 'q17':
      return state.globalUpgrades.length >= GLOBAL_UPGRADES.length
    case 'q18':
      return state.rebirths >= 10
    case 'q19':
      return state.lifetimeEarned >= 1_000_000_000
    case 'q20':
      return Object.values(state.generators).some((n) => n >= 500)
    default:
      return false
  }
}

type Action =
  | { type: 'TICK'; dtSeconds: number }
  | { type: 'HARVEST_CLICK' }
  | { type: 'BUY_GENERATOR'; id: string; quantity: number | 'max' }
  | { type: 'BUY_GLOBAL_UPGRADE'; id: string }
  | { type: 'BUY_CLICK_UPGRADE' }
  | { type: 'CLAIM_QUEST'; id: string }
  | { type: 'REBIRTH' }
  | { type: 'LOAD_STATE'; state: GameState }

export function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'LOAD_STATE':
      return action.state

    case 'TICK': {
      const production = computeProductionPerSecond(state)
      const gained = production * action.dtSeconds
      if (gained <= 0) return state
      return {
        ...state,
        data: state.data + gained,
        totalEarned: state.totalEarned + gained,
        lifetimeEarned: state.lifetimeEarned + gained,
      }
    }

    case 'HARVEST_CLICK': {
      const value = computeClickValue(state)
      return {
        ...state,
        data: state.data + value,
        totalEarned: state.totalEarned + value,
        lifetimeEarned: state.lifetimeEarned + value,
        manualClicks: state.manualClicks + 1,
      }
    }

    case 'BUY_GENERATOR': {
      const owned = state.generators[action.id] ?? 0
      const quantity =
        action.quantity === 'max'
          ? maxAffordableGenerators(action.id, owned, state.data)
          : action.quantity
      if (quantity <= 0) return state
      const cost = generatorCost(action.id, owned, quantity)
      if (!Number.isFinite(cost) || state.data < cost) return state
      return {
        ...state,
        data: state.data - cost,
        generators: {
          ...state.generators,
          [action.id]: owned + quantity,
        },
      }
    }

    case 'BUY_GLOBAL_UPGRADE': {
      const def = GLOBAL_UPGRADES.find((u) => u.id === action.id)
      if (!def) return state
      if (state.globalUpgrades.includes(action.id)) return state
      if (state.data < def.cost) return state
      return {
        ...state,
        data: state.data - def.cost,
        globalUpgrades: [...state.globalUpgrades, action.id],
      }
    }

    case 'BUY_CLICK_UPGRADE': {
      const cost = clickUpgradeCost(state.clickUpgradeLevel)
      if (state.data < cost) return state
      return {
        ...state,
        data: state.data - cost,
        clickUpgradeLevel: state.clickUpgradeLevel + 1,
      }
    }

    case 'CLAIM_QUEST': {
      if (state.completedQuests.includes(action.id)) return state
      if (!isQuestComplete(state, action.id)) return state
      const quest = QUESTS.find((q) => q.id === action.id)
      if (!quest) return state
      return {
        ...state,
        data: state.data + (quest.reward.data ?? 0),
        fragments: state.fragments + (quest.reward.fragments ?? 0),
        completedQuests: [...state.completedQuests, action.id],
      }
    }

    case 'REBIRTH': {
      const gained = fragmentsForRebirth(state.totalEarned)
      if (gained <= 0) return state
      const fresh = createInitialState()
      return {
        ...fresh,
        fragments: state.fragments + gained,
        rebirths: state.rebirths + 1,
        completedQuests: state.completedQuests,
        lifetimeEarned: state.lifetimeEarned,
        manualClicks: state.manualClicks,
        lastSave: Date.now(),
      }
    }

    default:
      return state
  }
}
