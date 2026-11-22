'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { preferVarietyPhoto, varietySvgFallback } from '@/lib/mangoImages'

type MangoImageProps = {
  src: string
  alt: string
  className?: string
  fill?: boolean
  width?: number
  height?: number
  priority?: boolean
  sizes?: string
}

function isLocalRaster(src: string): boolean {
  return src.startsWith('/') && /\.(jpe?g|png|gif|webp)$/i.test(src)
}

function isVarietyPhoto(src: string): boolean {
  return varietySvgFallback(src) !== null
}

/**
 * Variety photos use next/image. If the JPG fails, the matching SVG is shown.
 * Other missing local photos stay unoptimized so the /images rewrite can
 * answer with a mango-colored placeholder instead of an optimizer error.
 */
export function MangoImage({
  src,
  alt,
  className,
  fill,
  width,
  height,
  priority,
  sizes,
}: MangoImageProps) {
  const [current, setCurrent] = useState(() => preferVarietyPhoto(src))
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setCurrent(preferVarietyPhoto(src))
    setFailed(false)
  }, [src])

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`bg-[#E8943A] ${fill ? 'absolute inset-0' : ''} ${className ?? ''}`}
        style={!fill && width && height ? { width, height } : undefined}
      />
    )
  }

  const svgFallback = varietySvgFallback(current)

  return (
    <Image
      src={current}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      priority={priority}
      sizes={sizes}
      className={className}
      unoptimized={current.endsWith('.svg') || (isLocalRaster(current) && !isVarietyPhoto(current))}
      onError={() => {
        if (svgFallback && current !== svgFallback) {
          setCurrent(svgFallback)
          return
        }
        setFailed(true)
      }}
    />
  )
}
