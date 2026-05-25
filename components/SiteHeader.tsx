'use client'

import Link from 'next/link'
import { useState } from 'react'

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/shop', label: 'Shop' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
] as const

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <Link
            href="/"
            className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 rounded-sm"
          >
            <span className="text-xl sm:text-2xl font-bold text-slate-900 truncate">
              Mango Tango Farm
            </span>
            <p className="text-slate-600 text-xs sm:text-sm mt-0.5 truncate">
              Premium organic mangoes — Pine Island, Florida
            </p>
          </Link>
        </div>

        <nav
          className="hidden md:flex items-center gap-6 lg:gap-8"
          aria-label="Main"
        >
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-slate-700 hover:text-amber-600 font-medium transition-colors text-sm lg:text-base"
            >
              {label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-lg border border-slate-300 p-2 text-slate-800 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-600"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileOpen((o) => !o)}
        >
          <span className="sr-only">{mobileOpen ? 'Close menu' : 'Open menu'}</span>
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden
          >
            {mobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen ? (
        <div
          id="mobile-nav"
          className="md:hidden border-t border-slate-200 bg-white px-4 pb-4"
        >
          <ul className="flex flex-col gap-1 pt-2">
            {NAV.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="block py-2 text-slate-800 font-medium hover:text-amber-600"
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </header>
  )
}
