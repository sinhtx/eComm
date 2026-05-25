'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/components/CartProvider'

/** Nav items before Cart (desktop: Cart sits after Shop, top-right cluster). */
const NAV_BEFORE_CART = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/shop', label: 'Shop' },
] as const

const NAV_AFTER_CART = [
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
] as const

const MOBILE_NAV = [...NAV_BEFORE_CART, ...NAV_AFTER_CART] as const

type CartBtnProps = {
  compact?: boolean
}

function CartButton({ compact }: CartBtnProps) {
  const { itemCount, openCart } = useCart()

  return (
    <button
      type="button"
      onClick={() => openCart()}
      className={
        compact
          ? 'relative inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600'
          : 'relative inline-flex items-center gap-2 rounded-lg border-2 border-amber-500 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-950 shadow-sm transition-colors hover:bg-amber-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600'
      }
      aria-label={itemCount ? `Open cart, ${itemCount} items` : 'Open cart'}
    >
      <span aria-hidden>🛒</span>
      <span>Cart</span>
      {itemCount > 0 ? (
        <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-accent-pink px-1.5 text-xs font-bold text-white">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      ) : null}
    </button>
  )
}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
        <div className="min-w-0 shrink">
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
          className="hidden md:flex items-center gap-5 lg:gap-7 justify-end shrink-0"
          aria-label="Main"
        >
          {NAV_BEFORE_CART.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-slate-700 hover:text-amber-600 font-medium transition-colors text-sm lg:text-base whitespace-nowrap"
            >
              {label}
            </Link>
          ))}
          <CartButton />
          {NAV_AFTER_CART.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-slate-700 hover:text-amber-600 font-medium transition-colors text-sm lg:text-base whitespace-nowrap"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0 md:hidden">
          <CartButton compact />
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 p-2 text-slate-800 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-600"
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
      </div>

      {mobileOpen ? (
        <div
          id="mobile-nav"
          className="md:hidden border-t border-slate-200 bg-white px-4 pb-4"
        >
          <ul className="flex flex-col gap-1 pt-2">
            {MOBILE_NAV.map(({ href, label }) => (
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
