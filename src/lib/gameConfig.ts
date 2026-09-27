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
  {
    id: 'hive',
    name: 'Essaim de Ruche',
    description: 'Des milliers de nœuds collaborent en essaim distribué.',
    baseCost: 80_000_000_000,
    baseProduction: 1_480_000,
  },
  {
    id: 'oracle',
    name: 'Oracle Prédictif',
    description: 'Anticipe les données avant même leur création.',
    baseCost: 1_300_000_000_000,
    baseProduction: 8_400_000,
  },
  {
    id: 'multivers',
    name: 'Serveur Multivers',
    description: 'Récolte des données à travers des réalités parallèles.',
    baseCost: 21_000_000_000_000,
    baseProduction: 48_000_000,
  },
  {
    id: 'demiurge',
    name: 'Démiurge Numérique',
    description: 'Une entité qui façonne la réalité des données à volonté.',
    baseCost: 340_000_000_000_000,
    baseProduction: 274_000_000,
  },
]

export const PRODUCTION_BREAKPOINT_INTERVAL = 50
export const PRODUCTION_BREAKPOINT_MULTIPLIER = 1.5

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
  {
    id: 'gu7',
    name: 'Conscience Distribuée',
    description:
      'Une intelligence collective coordonne toute la récolte. x2 production globale.',
    cost: 14_000_000_000,
  },
  {
    id: 'gu8',
    name: 'Transcendance Algorithmique',
    description:
      'Le système dépasse ses propres limites de conception. x2 production globale.',
    cost: 220_000_000_000,
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
  tier: 'early' | 'mid' | 'end'
  reward: {
    data?: number
    fragments?: number
    permanentBonus?: { production?: number; click?: number }
  }
}

export const QUESTS: Array<QuestDef> = [
  {
    id: 'q1',
    title: 'Premier Contact',
    description: 'Récoltez des données manuellement pour la première fois.',
    tier: 'early',
    reward: { data: 10 },
  },
  {
    id: 'q2',
    title: 'Mise en Route',
    description: 'Achetez votre premier Script Kiddie.',
    tier: 'early',
    reward: { data: 50 },
  },
  {
    id: 'q3',
    title: 'Automatisation',
    description: 'Possédez 10 générateurs au total.',
    tier: 'early',
    reward: { data: 250 },
  },
  {
    id: 'q4',
    title: 'Diversification',
    description: 'Débloquez 3 types de générateurs différents.',
    tier: 'early',
    reward: { data: 750 },
  },
  {
    id: 'q5',
    title: 'Premier Palier',
    description: 'Récoltez 1 000 données au total sur cette vie.',
    tier: 'early',
    reward: { data: 1_000 },
  },
  {
    id: 'q6',
    title: 'Montée en Puissance',
    description: 'Achetez votre première amélioration.',
    tier: 'early',
    reward: { data: 2_000 },
  },
  {
    id: 'q7',
    title: "Prêt pour la Renaissance",
    description: 'Accumulez assez de données pour effectuer un Reboot du Système.',
    tier: 'mid',
    reward: { data: 5_000 },
  },
  {
    id: 'q8',
    title: 'Premier Reboot',
    description: 'Effectuez votre première Renaissance du Système.',
    tier: 'mid',
    reward: { fragments: 1 },
  },
  {
    id: 'q9',
    title: "Passage à l'Échelle",
    description: 'Récoltez 100 000 données au total sur une même vie.',
    tier: 'mid',
    reward: { data: 10_000 },
  },
  {
    id: 'q10',
    title: 'Diversification Totale',
    description: 'Débloquez tous les types de générateurs existants.',
    tier: 'mid',
    reward: { permanentBonus: { production: 0.02 } },
  },
  {
    id: 'q11',
    title: 'Cinquante Nuances',
    description: "Possédez 50 générateurs d'un même type.",
    tier: 'mid',
    reward: { permanentBonus: { production: 0.02 } },
  },
  {
    id: 'q12',
    title: 'Centurie',
    description: 'Possédez 100 générateurs au total.',
    tier: 'mid',
    reward: { permanentBonus: { click: 0.02 } },
  },
  {
    id: 'q13',
    title: 'Triple Reboot',
    description: 'Effectuez 3 Reboots du Système.',
    tier: 'mid',
    reward: { permanentBonus: { production: 0.03 } },
  },
  {
    id: 'q14',
    title: 'Collectionneur de Fragments',
    description: 'Possédez 25 Fragments de Code.',
    tier: 'mid',
    reward: { permanentBonus: { click: 0.03 } },
  },
  {
    id: 'q15',
    title: 'Empire des Données',
    description: 'Récoltez 10 000 000 données au total, tous Reboots confondus.',
    tier: 'end',
    reward: { permanentBonus: { production: 0.03 } },
  },
  {
    id: 'q16',
    title: 'Maître du Clic',
    description: "Atteignez le niveau 10 de l'amélioration de récolte manuelle.",
    tier: 'end',
    reward: { permanentBonus: { click: 0.03 } },
  },
  {
    id: 'q17',
    title: 'Arsenal Complet',
    description: 'Achetez toutes les améliorations globales disponibles.',
    tier: 'end',
    reward: { permanentBonus: { production: 0.04 } },
  },
  {
    id: 'q18',
    title: 'Vétéran du Reboot',
    description: 'Effectuez 10 Reboots du Système.',
    tier: 'end',
    reward: { permanentBonus: { production: 0.05 } },
  },
  {
    id: 'q19',
    title: 'Domination Numérique',
    description: 'Récoltez 1 000 000 000 données au total, tous Reboots confondus.',
    tier: 'end',
    reward: { permanentBonus: { production: 0.05 } },
  },
  {
    id: 'q20',
    title: 'Ascension Ultime',
    description: "Possédez 500 générateurs d'un même type.",
    tier: 'end',
    reward: { permanentBonus: { click: 0.05 } },
  },
]
