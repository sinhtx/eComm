import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL
  const staticPaths = [
    '',
    '/about',
    '/shop',
    '/contact',
    '/faq',
    '/privacy',
    '/terms',
    '/credits',
  ]

  const now = new Date()

  return staticPaths.map((path) => ({
    url: path ? `${base}${path}` : base,
    lastModified: now,
    changeFrequency: path === '' || path === '/shop' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : path === '/shop' ? 0.9 : 0.7,
  }))
}
