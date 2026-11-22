import type { Metadata } from 'next'
import { IMAGE_CREDITS } from '@/lib/imageCredits'
import { BRAND_NAME, pageMetadata } from '@/lib/site'

export const metadata: Metadata = pageMetadata({
  title: `Photo credits | ${BRAND_NAME}`,
  description: `Photographers and Creative Commons licenses for the mango variety photos on ${BRAND_NAME}.`,
  path: '/credits',
})

export default function CreditsPage() {
  return (
    <div className="bg-neutral-cream min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-h1 mb-4 text-neutral-charcoal">Photo credits</h1>
        <p className="text-body text-neutral-charcoal mb-8 leading-relaxed">
          The variety photos on this site are used under Creative Commons
          Attribution-ShareAlike licenses. Each photo was cropped to a square
          and resized. Adapted works stay under the same license as the
          original.
        </p>

        <ul className="space-y-8">
          {IMAGE_CREDITS.map((credit) => (
            <li key={credit.file} className="border-b border-neutral-off-white pb-8">
              <h2 className="text-h3 text-neutral-charcoal mb-2">{credit.variety}</h2>
              <p className="text-body text-neutral-charcoal leading-relaxed">
                “{credit.title}” by {credit.author},{' '}
                <a
                  href={credit.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-yellow hover:text-primary-orange font-semibold"
                >
                  Wikimedia Commons
                </a>
                ,{' '}
                <a
                  href={credit.licenseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-yellow hover:text-primary-orange font-semibold"
                >
                  {credit.licenseName}
                </a>
                . Cropped and resized.
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
