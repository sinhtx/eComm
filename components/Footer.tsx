'use client'

import Link from 'next/link'
import { SocialLinks } from '@/components/SocialLinks'
import { BRAND_NAME, hasSocialLinks } from '@/lib/site'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-neutral-charcoal text-neutral-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Footer Grid */}
        <div className={`grid grid-cols-1 ${hasSocialLinks() ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-8 mb-8`}>
          {/* Brand */}
          <div>
            <h3 className="text-h3 mb-2">{BRAND_NAME}</h3>
            <p className="text-sm text-neutral-gray">
              Naturally grown Florida mangoes from Pine Island, FL. Small-batch
              farming with big values.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-neutral-cream hover:text-primary-yellow">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-neutral-cream hover:text-primary-yellow">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-neutral-cream hover:text-primary-yellow">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-neutral-cream hover:text-primary-yellow">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-neutral-cream hover:text-primary-yellow">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-neutral-gray">
                {BRAND_NAME} <br /> Pine Island, FL
              </li>
              <li>
                <a
                  href="mailto:contact@mangotangofarm.com"
                  className="text-neutral-cream hover:text-primary-yellow"
                >
                  contact@mangotangofarm.com
                </a>
              </li>
              <li>Seasonal availability</li>
            </ul>
          </div>

          {hasSocialLinks() ? (
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <SocialLinks
                className="flex gap-4"
                linkClassName="text-neutral-cream hover:text-primary-yellow"
              />
            </div>
          ) : null}
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-gray my-8" />

        {/* Legal & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-gray">
          <p>© {currentYear} {BRAND_NAME}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-neutral-cream">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-neutral-cream">
              Terms of Service
            </Link>
            <Link href="/credits" className="hover:text-neutral-cream">
              Photo credits
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
