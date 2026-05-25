import type { MangoVariety } from '@/lib/types'

/**
 * Static catalog used when Supabase is unreachable (CI, local without DB, network errors).
 * Matches seed data in docs/migrations/002-create-mango-varieties-tables.sql.
 */
const FALLBACK: MangoVariety[] = [
  {
    id: 'fallback-carrie',
    name: 'Carrie',
    description:
      'Sweet, smooth tropical flavor with minimal fiber. Perfect for first-time mango lovers.',
    imageUrl: '/images/mangoes/carrie.svg',
    available: true,
    inSeason: true,
    pricePerPound: 6.5,
  },
  {
    id: 'fallback-mallika',
    name: 'Mallika',
    description:
      'Rich, creamy texture with balanced sweetness and slight tang. A customer favorite.',
    imageUrl: '/images/mangoes/mallika.svg',
    available: true,
    inSeason: true,
    pricePerPound: 6.5,
  },
  {
    id: 'fallback-nam-dok-mai',
    name: 'Nam Dok Mai',
    description:
      'Golden-colored with floral notes and smooth, fiber-free flesh. Premium quality.',
    imageUrl: '/images/mangoes/nam-dok-mai.svg',
    available: true,
    inSeason: false,
    pricePerPound: 7.5,
  },
  {
    id: 'fallback-frorigan',
    name: 'Frorigan',
    description: 'Large, vibrant mango with sweet juice and aromatic flavor profile.',
    imageUrl: '/images/mangoes/frorigan.svg',
    available: true,
    inSeason: true,
    pricePerPound: 6.0,
  },
  {
    id: 'fallback-kent',
    name: 'Kent',
    description: 'Stringless, creamy flesh with delicate sweetness. Excellent for fresh eating.',
    imageUrl: '/images/mangoes/kent.svg',
    available: true,
    inSeason: true,
    pricePerPound: 6.5,
  },
  {
    id: 'fallback-tommy-atkins',
    name: 'Tommy Atkins',
    description:
      'Firm texture, good shipping quality, naturally sweet with slight tartness.',
    imageUrl: '/images/mangoes/tommy-atkins.svg',
    available: true,
    inSeason: true,
    pricePerPound: 5.5,
  },
  {
    id: 'fallback-ataulfo',
    name: 'Ataulfo',
    description: 'Small but mighty—dense, creamy, and intensely sweet. No fiber.',
    imageUrl: '/images/mangoes/ataulfo.svg',
    available: true,
    inSeason: false,
    pricePerPound: 8.0,
  },
  {
    id: 'fallback-alphonso',
    name: 'Alphonso',
    description: 'The King of Mangoes—buttery texture, complex flavor, premium delicacy.',
    imageUrl: '/images/mangoes/alphonso.svg',
    available: true,
    inSeason: false,
    pricePerPound: 9.0,
  },
  {
    id: 'fallback-haden',
    name: 'Haden',
    description: 'Classic heritage variety, red-blushed skin, sweet and aromatic.',
    imageUrl: '/images/mangoes/haden.svg',
    available: true,
    inSeason: false,
    pricePerPound: 6.5,
  },
]

function isActuallyAvailable(m: MangoVariety, comingSoonDate: string | null): boolean {
  if (!m.available) return false
  if (!comingSoonDate) return true
  return new Date(comingSoonDate) <= new Date()
}

export function getFallbackMangoesWithMeta(): Array<{
  variety: MangoVariety
  comingSoonDate: string | null
}> {
  return FALLBACK.map((variety) => ({
    variety,
    comingSoonDate: null,
  }))
}

export function getFallbackAvailableMangoes(): MangoVariety[] {
  return FALLBACK.filter((m) => isActuallyAvailable(m, null))
}
