/** Real variety photos in /public/images/mangoes. The matching .svg is the onError fallback. */
const VARIETY_SLUGS = new Set([
  'alphonso',
  'ataulfo',
  'carrie',
  'florigon',
  'haden',
  'kent',
  'mallika',
  'nam-dok-mai',
  'tommy-atkins',
])

const VARIETY_LABELS: Record<string, string> = {
  alphonso: 'Alphonso',
  ataulfo: 'Ataulfo',
  carrie: 'Carrie',
  florigon: 'Florigon',
  haden: 'Haden',
  kent: 'Kent',
  mallika: 'Mallika',
  'nam-dok-mai': 'Nam Dok Mai',
  'tommy-atkins': 'Tommy Atkins',
}

/** Card grids: one column on phones, two on tablets, three on desktop. */
export const VARIETY_IMAGE_SIZES =
  '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'

/** The catalog typo "Frorigan" uses the Florigon photo. */
export function varietySlug(nameOrSlug: string): string {
  const slug = nameOrSlug.trim().toLowerCase().replace(/\s+/g, '-')
  if (slug === 'frorigan') return 'florigon'
  return slug
}

export function isKnownVarietySlug(slug: string): boolean {
  return VARIETY_SLUGS.has(slug)
}

export function varietyPhotoUrl(nameOrSlug: string): string {
  return `/images/mangoes/${varietySlug(nameOrSlug)}.jpg`
}

export function varietySvgUrl(nameOrSlug: string): string {
  return `/images/mangoes/${varietySlug(nameOrSlug)}.svg`
}

export function varietyImageAlt(name: string): string {
  const slug = varietySlug(name)
  const label = VARIETY_LABELS[slug] ?? name.trim()
  return `${label} mango`
}

/**
 * Known variety files, including a misspelled frorigan path, load the JPG.
 * Mix-box SVGs and remote URLs are left unchanged.
 */
export function preferVarietyPhoto(src: string): string {
  const match = src.match(/^\/images\/mangoes\/([a-z0-9-]+)\.(?:svg|jpe?g)$/i)
  if (!match) return src
  const slug = varietySlug(match[1])
  if (!isKnownVarietySlug(slug)) return src
  return varietyPhotoUrl(slug)
}

/** SVG paired with a variety JPG. Null when src is not a variety photo. */
export function varietySvgFallback(src: string): string | null {
  const match = src.match(/^\/images\/mangoes\/([a-z0-9-]+)\.jpe?g$/i)
  if (!match) return null
  const slug = varietySlug(match[1])
  if (!isKnownVarietySlug(slug)) return null
  return varietySvgUrl(slug)
}
