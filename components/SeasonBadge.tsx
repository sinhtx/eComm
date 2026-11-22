'use client'

import { getSeasonBadge, IN_SEASON_BADGE } from '@/lib/season'

export function SeasonBadge({ inSeason }: { inSeason: boolean }) {
  const label = getSeasonBadge(inSeason)
  if (!label) return null

  const preorder = label !== IN_SEASON_BADGE

  return (
    <span
      className={
        preorder
          ? 'inline-block max-w-[12rem] whitespace-normal text-left leading-snug rounded-md bg-[#C46A12] px-2 py-1 text-[11px] font-semibold text-white shadow-sm'
          : 'inline-block rounded-full bg-accent-pink px-3 py-1 text-xs font-semibold text-white'
      }
    >
      {label}
    </span>
  )
}
