'use client'

import Image from 'next/image'
import Link from 'next/link'

interface ProductCardProps {
  id: string
  name: string
  imageUrl: string
  pricePerPound: number
  description: string
  inSeason: boolean
  comingSoonDate?: string | null
  onClick?: () => void
}

export function ProductCard({
  id,
  name,
  imageUrl,
  pricePerPound,
  description,
  inSeason,
  comingSoonDate,
  onClick,
}: ProductCardProps) {
  const isComingSoon = comingSoonDate && new Date(comingSoonDate) > new Date()

  return (
    <div
      className="card group cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-lg"
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-neutral-off-white">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {/* Badge */}
        <div className="absolute top-3 right-3">
          {isComingSoon ? (
            <span className="bg-neutral-charcoal text-neutral-cream px-3 py-1 rounded-full text-xs font-semibold">
              Coming Soon
            </span>
          ) : inSeason ? (
            <span className="bg-accent-pink text-white px-3 py-1 rounded-full text-xs font-semibold">
              In Season
            </span>
          ) : null}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-h3 mb-1 text-neutral-charcoal">{name}</h3>
        <p className="text-small text-neutral-gray mb-3 line-clamp-1">
          {description}
        </p>

        {/* Price or Coming Soon Date */}
        <div className="flex items-center justify-between">
          {isComingSoon ? (
            <span className="text-small font-semibold text-secondary-green">
              Available {comingSoonDate}
            </span>
          ) : (
            <span className="text-body font-semibold text-primary-yellow">
              ${pricePerPound.toFixed(2)}/lb
            </span>
          )}
        </div>

        {/* CTA */}
        {!isComingSoon && (
          <Link
            href={`/shop?variety=${id}`}
            className="text-primary-yellow hover:text-primary-orange text-sm font-semibold mt-3 inline-block"
          >
            View Details →
          </Link>
        )}
      </div>
    </div>
  )
}
