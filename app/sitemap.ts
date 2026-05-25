import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/siteUrl'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl()
  const staticPaths = [
    '',
    '/about',
    '/shop',
    '/contact',
    '/faq',
    '/privacy',
    '/terms',
  ]

  const now = new Date()

  return staticPaths.map((path) => ({
    url: `${base}${path || '/'}`,
    lastModified: now,
    changeFrequency: path === '' || path === '/shop' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : path === '/shop' ? 0.9 : 0.7,
  }))
}
