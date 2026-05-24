'use client'

import { useState, useEffect } from 'react'
import { HeroSection } from '@/components/HeroSection'
import { ProductCard } from '@/components/ProductCard'
import { StoryBeat } from '@/components/StoryBeat'
import { ValuePropositions } from '@/components/ValueProposition'
import { SeasonalHighlight } from '@/components/SeasonalHighlight'
import { Testimonials } from '@/components/TestimonialCard'
import { NewsletterSignup } from '@/components/NewsletterSignup'
import { Footer } from '@/components/Footer'
import { getAvailableMangoes, getAllMangoes } from '@/lib/mangoes'
import { testimonials } from '@/lib/constants/testimonials'
import { MangoVariety } from '@/lib/types'

export default function Home() {
  const [mangoes, setMangoes] = useState<MangoVariety[]>([])
  const [mangoesMeta, setMangoesMeta] = useState<Array<{ variety: MangoVariety; comingSoonDate: string | null }>>([])
  const [loading, setLoading] = useState(true)
  const [selectedMango, setSelectedMango] = useState<MangoVariety | null>(null)

  useEffect(() => {
    const loadMangoes = async () => {
      try {
        const availableData = await getAvailableMangoes()
        setMangoes(availableData)

        // For product grid, use getAllMangoes to get coming soon metadata
        const allMeta = await getAllMangoes()
        setMangoesMeta(allMeta)

        // Set featured mango as first in-season variety
        const featured = availableData.find((m) => m.inSeason)
        if (featured) setSelectedMango(featured)
      } catch (error) {
        console.error('Failed to load mangoes:', error)
      } finally {
        setLoading(false)
      }
    }
    loadMangoes()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-neutral-gray">Loading your mangoes...</p>
      </div>
    )
  }

  const valueProps = [
    {
      icon: '🌱',
      title: 'Organic Philosophy',
      description:
        'Grown without formal certification, but with the same rigorous standards we\'d use for our own family.',
    },
    {
      icon: '🚜',
      title: 'Woman-Owned & Operated',
      description:
        'Supporting a woman entrepreneur committed to sustainable farming and community.',
    },
    {
      icon: '⛰️',
      title: 'Built to Resilience',
      description:
        'Recovering from Hurricane Ian. Every mango you buy supports our multi-year restoration.',
    },
  ]

  return (
    <div>
      {/* Section 1: Hero */}
      <HeroSection
        backgroundImage="/images/hero-mango-field.jpg"
        headline="Fresh Mangoes from Pine Island, SW Florida"
        subheading="Picked at peak ripeness. Organic. Small-batch."
        ctaText="Shop Now"
        ctaLink="/shop"
        height="tall"
      />

      {/* Section 2: Featured Products Grid */}
      <section className="bg-neutral-cream py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-h2 mb-2 text-neutral-charcoal">
              Our Premium Mangoes
            </h2>
            <p className="text-lg text-neutral-gray">
              Hand-picked varieties in season now
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mangoesMeta.slice(0, 6).map((item) => (
              <ProductCard
                key={item.variety.id}
                {...item.variety}
                comingSoonDate={item.comingSoonDate}
                onClick={() => setSelectedMango(item.variety)}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="/shop"
              className="btn-primary inline-block"
            >
              View All Varieties
            </a>
          </div>
        </div>
      </section>

      {/* Section 3: Meet the Farmer */}
      <StoryBeat
        title="From Philadelphia to Pine Island"
        subtitle="How a passion for mangoes led to organic farming in SW Florida"
        body="After 20+ years in tech, I followed my dream to southwest Florida to take over Mango Tango Farm. What started as a passion project has become a mission to grow the most delicious, organic mangoes while supporting our community through resilience and sustainable practices."
        imageUrl="/images/farmer-in-field.jpg"
        imageAlt="Farmer at work"
        ctaText="Read My Full Story"
        ctaLink="/about"
      />

      {/* Section 4: Why Choose Our Mangoes */}
      <ValuePropositions
        title="Why Choose Our Mangoes?"
        subtitle="Values that matter to us"
        cards={valueProps}
      />

      {/* Section 5: This Season's Star */}
      {selectedMango && (
        <SeasonalHighlight
          mangoName={selectedMango.name}
          story={selectedMango.description}
          availabilityText="Available June - August 2026"
          imageUrl={selectedMango.imageUrl}
          ctaLink="/shop"
        />
      )}

      {/* Section 6: Testimonials */}
      <Testimonials testimonials={testimonials} />

      {/* Section 7: Newsletter */}
      <NewsletterSignup />

      {/* Section 8: Footer */}
      <Footer />
    </div>
  )
}
