const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const

/**
 * Harvest window for customer-facing copy.
 * Month numbers are 1–12. This does not write variety `in_season` flags.
 */
export const SEASON = {
  startMonth: 5,
  endMonth: 9,
  peakStartMonth: 6,
  peakEndMonth: 8,
  offSeasonLabel: 'Pre-orders for the 2027 season open soon',
} as const

export const IN_SEASON_BADGE = 'In Season'

export function isHarvestSeason(now = new Date()): boolean {
  const month = now.getMonth() + 1
  return month >= SEASON.startMonth && month <= SEASON.endMonth
}

/** "Season runs May–September, peak June–August" */
export function getSeasonRangeLabel(): string {
  const start = MONTHS[SEASON.startMonth - 1]
  const end = MONTHS[SEASON.endMonth - 1]
  const peakStart = MONTHS[SEASON.peakStartMonth - 1]
  const peakEnd = MONTHS[SEASON.peakEndMonth - 1]
  return `Season runs ${start}–${end}, peak ${peakStart}–${peakEnd}`
}

/**
 * Badge for a variety the catalog marks in season.
 * Outside May–September this is the pre-order line, not "In Season".
 */
export function getSeasonBadge(varietyInSeason: boolean, now = new Date()): string | null {
  if (!varietyInSeason) return null
  if (!isHarvestSeason(now)) return SEASON.offSeasonLabel
  return IN_SEASON_BADGE
}
