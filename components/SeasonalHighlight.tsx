'use client'

import Image from 'next/image'
import Link from 'next/link'

interface SeasonalHighlightProps {
  mangoName: string
  story: string
  availabilityText: string
  imageUrl: string
  ctaLink: string
}

export function SeasonalHighlight({
  mangoName,
  story,
  availabilityText,
  imageUrl,
  ctaLink,
}: SeasonalHighlightProps) {
  return (
    <section className="bg-gradient-to-r from-neutral-cream to-neutral-off-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Image */}
          <div className="relative h-96 md:h-full rounded-lg overflow-hidden">
            <Image
              src={imageUrl}
              alt={mangoName}
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div>
              <h2 className="text-h2 mb-2 text-neutral-charcoal">
                This Season&apos;s Star: {mangoName}
              </h2>
              <p className="text-body text-neutral-charcoal leading-relaxed">
                {story}
              </p>
            </div>

            {/* Availability Badge */}
            <div className="bg-primary-yellow/20 border-2 border-primary-yellow rounded-lg p-4">
              <p className="text-center font-semibold text-primary-yellow text-lg">
                {availabilityText}
              </p>
            </div>

            {/* CTA */}
            <Link
              href={ctaLink}
              className="btn-primary inline-block"
            >
              Order Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
