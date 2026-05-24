'use client'

import Image from 'next/image'
import Link from 'next/link'

interface StoryBeatProps {
  title: string
  subtitle: string
  body: string
  imageUrl: string
  imageAlt: string
  ctaText?: string
  ctaLink?: string
  imagePosition?: 'left' | 'right'
  backgroundColor?: 'cream' | 'off-white'
}

export function StoryBeat({
  title,
  subtitle,
  body,
  imageUrl,
  imageAlt,
  ctaText,
  ctaLink,
  imagePosition = 'left',
  backgroundColor = 'cream',
}: StoryBeatProps) {
  const bgClass =
    backgroundColor === 'cream' ? 'bg-neutral-cream' : 'bg-neutral-off-white'

  const imageCol = (
    <div className="relative h-96 md:h-full rounded-lg overflow-hidden">
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        className="object-cover"
      />
    </div>
  )

  const contentCol = (
    <div className="flex flex-col justify-center space-y-4">
      <div>
        <h2 className="text-h2 mb-2 text-neutral-charcoal">{title}</h2>
        <p className="text-lg text-neutral-gray font-semibold mb-4">
          {subtitle}
        </p>
        <p className="text-body text-neutral-charcoal leading-relaxed">
          {body}
        </p>
      </div>

      {ctaText && ctaLink && (
        <div className="pt-4">
          <Link
            href={ctaLink}
            className="text-primary-yellow hover:text-primary-orange font-semibold text-lg transition-colors duration-200 inline-flex items-center gap-2"
          >
            {ctaText} →
          </Link>
        </div>
      )}
    </div>
  )

  return (
    <section className={`${bgClass} py-16 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {imagePosition === 'left' ? (
            <>
              {imageCol}
              {contentCol}
            </>
          ) : (
            <>
              {contentCol}
              {imageCol}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
