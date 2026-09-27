export interface GeneratorDef {
  id: string
  name: string
  description: string
  baseCost: number
  baseProduction: number
}

export const COST_GROWTH = 1.15

export const GENERATORS: Array<GeneratorDef> = [
  {
    id: 'script',
    name: 'Script Kiddie',
    description: 'Un bot amateur qui gratte le web à la main.',
    baseCost: 15,
    baseProduction: 0.1,
  },
  {
    id: 'crawler',
    name: 'Crawler Web',
    description: 'Explore et indexe des pages en continu.',
    baseCost: 100,
    baseProduction: 1,
  },
  {
    id: 'proxy',
    name: 'Ferme de Proxies',
    description: 'Multiplie les requêtes via des IP masquées.',
    baseCost: 1_100,
    baseProduction: 8,
  },
  {
    id: 'scraper',
    name: 'Cluster de Scraping',
    description: 'Un essaim de scrapers synchronisés.',
    baseCost: 12_000,
    baseProduction: 47,
  },
  {
    id: 'datacenter',
    name: 'Datacenter Fantôme',
    description: 'Un site off-grid qui tourne jour et nuit.',
    baseCost: 130_000,
    baseProduction: 260,
  },
  {
    id: 'ia',
    name: "IA d'Extraction",
    description: "Apprentissage automatique appliqué à la collecte.",
    baseCost: 1_400_000,
    baseProduction: 1_400,
  },
  {
    id: 'neural',
    name: 'Cluster Neuronal',
    description: "Des GPU empilés pour miner l'information.",
    baseCost: 20_000_000,
    baseProduction: 7_800,
  },
  {
    id: 'quantum',
    name: 'Essaim Quantique',
    description: 'Des qubits qui explorent tous les chemins à la fois.',
    baseCost: 330_000_000,
    baseProduction: 44_000,
  },
  {
    id: 'singularity',
    name: 'Singularité Numérique',
    description: 'Une intelligence qui absorbe le réseau entier.',
    baseCost: 5_100_000_000,
    baseProduction: 260_000,
  },
]

export interface GlobalUpgradeDef {
  id: string
  name: string
  description: string
  cost: number
}

export const GLOBAL_UPGRADES: Array<GlobalUpgradeDef> = [
  {
    id: 'gu1',
    name: 'Compression de Données',
    description: 'Optimise le flux de collecte. x2 production globale.',
    cost: 1_000,
  },
  {
    id: 'gu2',
    name: 'Surclockage Réseau',
    description: 'Pousse le matériel au-delà des limites. x2 production globale.',
    cost: 15_000,
  },
  {
    id: 'gu3',
    name: 'Cache Distribué',
    description: 'Réduit la latence de collecte. x2 production globale.',
    cost: 200_000,
  },
  {
    id: 'gu4',
    name: 'Protocole Furtif',
    description: 'Contourne les limitations de débit. x2 production globale.',
    cost: 3_000_000,
  },
  {
    id: 'gu5',
    name: 'Fusion des Datacenters',
    description: "Synchronise toute l'infrastructure. x2 production globale.",
    cost: 50_000_000,
  },
  {
    id: 'gu6',
    name: 'Noyau Sentient',
    description: 'Une conscience émergente optimise tout. x2 production globale.',
    cost: 900_000_000,
  },
]

export const BASE_CLICK_VALUE = 1
export const CLICK_UPGRADE_BASE_COST = 25
export const CLICK_UPGRADE_GROWTH = 9

export const REBIRTH_MIN_TOTAL = 10_000
export const FRAGMENT_BONUS_PER_UNIT = 0.02
export const OFFLINE_CAP_SECONDS = 4 * 3600

export interface QuestDef {
  id: string
  title: string
  description: string
  reward: { data?: number; fragments?: number }
}

export const QUESTS: Array<QuestDef> = [
  {
    id: 'q1',
    title: 'Premier Contact',
    description: 'Récoltez des données manuellement pour la première fois.',
    reward: { data: 10 },
  },
  {
    id: 'q2',
    title: 'Mise en Route',
    description: 'Achetez votre premier Script Kiddie.',
    reward: { data: 50 },
  },
  {
    id: 'q3',
    title: 'Automatisation',
    description: 'Possédez 10 générateurs au total.',
    reward: { data: 250 },
  },
  {
    id: 'q4',
    title: 'Diversification',
    description: 'Débloquez 3 types de générateurs différents.',
    reward: { data: 750 },
  },
  {
    id: 'q5',
    title: 'Premier Palier',
    description: 'Récoltez 1 000 données au total sur cette vie.',
    reward: { data: 1_000 },
  },
  {
    id: 'q6',
    title: 'Montée en Puissance',
    description: 'Achetez votre première amélioration.',
    reward: { data: 2_000 },
  },
  {
    id: 'q7',
    title: "Prêt pour la Renaissance",
    description: 'Accumulez assez de données pour effectuer un Reboot du Système.',
    reward: { data: 5_000 },
  },
  {
    id: 'q8',
    title: 'Premier Reboot',
    description: 'Effectuez votre première Renaissance du Système.',
    reward: { fragments: 1 },
  },
  {
    id: 'q9',
    title: "Passage à l'Échelle",
    description: 'Récoltez 100 000 données au total sur une même vie.',
    reward: { data: 10_000 },
  },
]
