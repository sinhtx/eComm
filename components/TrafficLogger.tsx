'use client'

import { logTraffic } from '@/app/actions/logTraffic'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

/**
 * Records one lightweight analytics row per route (skipped for admin + API routes).
 */
export function TrafficLogger() {
  const pathname = usePathname()
  const lastLogged = useRef<{ path: string; at: number } | null>(null)

  useEffect(() => {
    if (!pathname) return
    if (
      pathname.startsWith('/admin') ||
      pathname.startsWith('/api')
    ) {
      return
    }

    const now = Date.now()
    const prev = lastLogged.current
    if (
      prev &&
      prev.path === pathname &&
      now - prev.at < 2000
    ) {
      return
    }

    lastLogged.current = { path: pathname, at: now }

    logTraffic({ pagePath: pathname }).catch(() => {
      /* non-blocking — logging must never break the page */
    })
  }, [pathname])

  return null
}
