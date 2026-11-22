'use client'

import Link from 'next/link'
import { MangoImage } from '@/components/MangoImage'
import { SeasonBadge } from '@/components/SeasonBadge'
import { formatDateOnly } from '@/lib/formatDate'
import { VARIETY_IMAGE_SIZES, varietyImageAlt } from '@/lib/mangoImages'

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
        <MangoImage
          src={imageUrl}
          alt={varietyImageAlt(name)}
          fill
          sizes={VARIETY_IMAGE_SIZES}
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {/* Badge */}
        <div className="absolute top-3 right-3 left-3 flex justify-end">
          {isComingSoon ? (
            <span className="bg-neutral-charcoal text-neutral-cream px-3 py-1 rounded-full text-xs font-semibold">
              Coming Soon
            </span>
          ) : (
            <SeasonBadge inSeason={inSeason} />
          )}
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
              {comingSoonDate ? formatDateOnly(comingSoonDate) : null}
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
