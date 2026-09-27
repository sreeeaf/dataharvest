# DATA://HARVEST

An incremental / tycoon game about harvesting data. Click to collect "Données" (Data) by hand,
buy automated collection sources to scale up, spend on upgrades, and use the "Reboot du Système"
prestige system to reset your run for a permanent production boost. A short quest list guides new
players through the opening moves. The look is a dark, Matrix-inspired hacker terminal: black,
dark gray, white, and green, with a falling-code background effect.

## How the game works

- **Récolter** — click the central button to manually harvest data.
- **Sources de récolte** — buy generators (Script Kiddie, Crawler Web, Datacenter Fantôme, …) that
  produce data automatically every second. Costs scale up with each purchase.
- **Améliorations** — spend data on upgrades that double your manual click power or double all
  generator output globally.
- **Quêtes de départ** — a short checklist (first click, first generator, first upgrade, …) that
  rewards bonus data as you complete early milestones.
- **Reboot du Système** — once you've earned enough lifetime data in a run, you can reset
  everything (data, generators, upgrades) in exchange for permanent "Fragments de Code", each
  giving +2% production forever. This lets you restart faster and push further each time.

Progress is saved automatically to your browser's local storage, including a capped amount of
progress while you were away.

## Tech stack

- [TanStack Start](https://tanstack.com/start) (React 19 + TanStack Router) on Vite 7
- Tailwind CSS 4 with a custom "matrix" color theme
- Plain React state (`useReducer`) for the game engine — no backend, no accounts
- Deployed on Netlify

## Project structure

See [AGENTS.md](./AGENTS.md) for a full breakdown of the codebase (game engine, hooks,
components, and where to tune balance numbers).

## Running locally

```bash
npm install
npm run dev
```

Then open the printed local URL. The game runs entirely client-side.

## Building

```bash
npm run build
```
