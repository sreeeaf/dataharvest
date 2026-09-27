const SUFFIXES = [
  '',
  'K',
  'M',
  'B',
  'T',
  'Qa',
  'Qi',
  'Sx',
  'Sp',
  'Oc',
  'No',
  'Dc',
  'Ud',
  'Dd',
  'Td',
]

const BIT_SUFFIXES = ['bit', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb', 'Rb', 'Qb']

function formatWithSuffixes(
  value: number,
  decimals: number,
  suffixes: Array<string>,
  baseUnit: string,
): string {
  if (!Number.isFinite(value)) return `0${baseUnit}`
  const sign = value < 0 ? '-' : ''
  const abs = Math.abs(value)
  if (abs < 1000) {
    const rounded = Number.isInteger(abs) ? abs.toString() : abs.toFixed(decimals)
    return `${sign}${rounded}${baseUnit}`
  }
  const tier = Math.min(Math.floor(Math.log10(abs) / 3), suffixes.length - 1)
  const scaled = abs / Math.pow(1000, tier)
  return `${sign}${scaled.toFixed(decimals)}${suffixes[tier]}`
}

export function formatNumber(value: number, decimals = 2): string {
  return formatWithSuffixes(value, decimals, SUFFIXES, '')
}

export function formatInt(value: number): string {
  return formatNumber(value, 0)
}

export function formatRate(value: number): string {
  return `${formatNumber(value, 2)}/s`
}

/** Formats a Données amount using the game's bit-themed units: 1bit, 1Kb, 1Mb, 1Gb… */
export function formatBits(value: number, decimals = 2): string {
  return formatWithSuffixes(value, decimals, BIT_SUFFIXES, 'bit')
}

export function formatBitsRate(value: number, decimals = 2): string {
  return `${formatBits(value, decimals)}/s`
}

export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${sec}s`
  return `${sec}s`
}
