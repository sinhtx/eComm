'use client'

import Image from 'next/image'
import Link from 'next/link'

interface HeroSectionProps {
  backgroundImage: string
  headline: string
  subheading: string
  ctaText: string
  ctaLink: string
  height?: 'short' | 'medium' | 'tall'
}

export function HeroSection({
  backgroundImage,
  headline,
  subheading,
  ctaText,
  ctaLink,
  height = 'medium',
}: HeroSectionProps) {
  const heightClass = {
    short: 'h-96',
    medium: 'h-screen md:h-[70vh]',
    tall: 'h-[80vh]',
  }[height]

  return (
    <div className={`relative ${heightClass} w-full overflow-hidden`}>
      {/* Background Image */}
      <Image
        src={backgroundImage}
        alt="Hero background"
        fill
        className="object-cover"
        priority
      />

      {/* Warm Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-yellow/20 to-primary-orange/10 mix-blend-multiply" />

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-3xl">
          <h1 className="text-h1 text-white font-bold mb-4 drop-shadow-lg">
            {headline}
          </h1>
          <p className="text-lg md:text-xl text-white drop-shadow-lg mb-8 bg-text-dark/30 inline-block px-6 py-3 rounded-lg backdrop-blur-sm">
            {subheading}
          </p>
          <Link
            href={ctaLink}
            className="btn-primary inline-block"
          >
            {ctaText}
          </Link>
        </div>
      </div>
    </div>
  )
}
