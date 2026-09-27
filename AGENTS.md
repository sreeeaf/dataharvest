# AGENTS.md

Overview of the project for developers and AI agents working on this codebase.

## Project Overview

**DATA://HARVEST** is an incremental/tycoon game. The player collects "Données" (Data), the
core currency, by clicking a manual harvest button and by buying automated generators. A
prestige ("Reboot du Système" / rebirth) mechanic resets the current run in exchange for
permanent production multipliers. A short quest list guides new players through the early
game. The visual theme is a dark, "Matrix" hacker aesthetic (black/dark-gray/white/green).

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start |
| Frontend | React 19, TanStack Router v1 |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 (custom `matrix-*` theme colors in `src/styles.css`) |
| Language | TypeScript 5.9 |
| Persistence | Browser `localStorage` (single-player, no accounts) |
| Deployment | Netlify |

## Directory Structure

```
├── src
│   ├── components
│   │   ├── Game.tsx                # Top-level game screen, composes all panels
│   │   ├── MatrixRain.tsx          # Canvas background effect (falling code)
│   │   └── game/
│   │       ├── HarvestButton.tsx   # Manual click button + floating "+N" text
│   │       ├── StatsBar.tsx        # Current data, rate, fragments, multiplier
│   │       ├── GeneratorList.tsx   # Buyable generators (progressively unlocked)
│   │       ├── UpgradesPanel.tsx   # Global x2 upgrades + click power upgrade
│   │       ├── QuestPanel.tsx      # Starter quests with claimable rewards
│   │       ├── RebirthPanel.tsx    # Prestige/rebirth UI with confirmation step
│   │       └── OfflineGainModal.tsx# "Welcome back" offline-progress modal
│   ├── hooks
│   │   └── useGame.ts              # Game loop (tick interval), load/save/offline gain
│   ├── lib
│   │   ├── gameConfig.ts           # All game balance data: generators, upgrades, quests
│   │   ├── gameEngine.ts           # Pure functions + reducer: costs, production, rebirth
│   │   └── format.ts               # Number formatting (K/M/B/T… suffixes)
│   └── routes
│       ├── __root.tsx              # HTML shell, fonts, metadata
│       └── index.tsx               # Renders <Game />
```

## Key Concepts

### Game loop and state

`useGame` (src/hooks/useGame.ts) owns a `useReducer` (src/lib/gameEngine.ts) and drives it with
a `setInterval` tick every 100ms, computing elapsed real time so the game stays correct even if
the tab throttles background timers. All game math (costs, production, prestige multiplier) is
implemented as pure functions in `gameEngine.ts` so it can be reasoned about and tested in
isolation from React.

### Persistence

Progress is saved to `localStorage` (key `data-harvest-save-v1`) on an interval, on tab hide, and
on unload. On load, elapsed real time since the last save is used to grant capped offline
production (see `OFFLINE_CAP_SECONDS` in `gameConfig.ts`), shown via `OfflineGainModal`. This is a
single-player browser game with no accounts, so no server-side database is used.

### Balancing data

All tunable numbers (generator costs/production, upgrade costs, rebirth formula, quest
definitions) live in `src/lib/gameConfig.ts`. Change numbers there rather than in components.

### Rebirth ("Reboot du Système")

Resets `data`, `generators`, `globalUpgrades`, and `clickUpgradeLevel` to zero, but keeps
`fragments` (prestige currency), `rebirths` count, and `completedQuests`. Fragments grant +2%
production each, permanently (see `prestigeMultiplier` in `gameEngine.ts`). The formula for
fragments earned is `floor(sqrt(totalEarned / 10000))`, gated by `REBIRTH_MIN_TOTAL`.

## Development Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
```

## Conventions

- Components: PascalCase. Utilities/hooks: camelCase.
- Game balance/content data stays in `gameConfig.ts`; game math stays in `gameEngine.ts`
  as pure functions; React components stay presentational and call hook actions.
- Tailwind CSS utility classes; custom theme tokens (`matrix-green`, `matrix-black`,
  `matrix-panel`, `matrix-border`, …) are defined via `@theme` in `src/styles.css`.
- All in-game copy is in French, matching the requested tone.
