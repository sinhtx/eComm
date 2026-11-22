import type { Metadata } from 'next'

/** Canonical production origin. Sitemap, robots, and social metadata all use this. */
export const SITE_URL = 'https://www.flmango.com'

/** Single brand string used in the header, footer, emails, and metadata. */
export const BRAND_NAME = 'Pine Island Mango Grove'

/** Public path. Add the file at public/og-image.jpg when the artwork is ready. */
export const OG_IMAGE_PATH = '/og-image.jpg'

/** Leave empty to hide the icon. Set a full profile URL when one exists. */
export const INSTAGRAM_URL = ''

/** Leave empty to hide the icon. Set a full profile URL when one exists. */
export const FACEBOOK_URL = ''

export function hasSocialLinks(): boolean {
  return Boolean(INSTAGRAM_URL || FACEBOOK_URL)
}

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string
  description: string
  path: string
}): Metadata {
  const url = path === '/' ? SITE_URL : `${SITE_URL}${path}`

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: BRAND_NAME,
      title,
      description,
      url,
      images: [
        {
          url: OG_IMAGE_PATH,
          alt: `${BRAND_NAME} — Naturally grown Florida mangoes`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE_PATH],
    },
  }
}
