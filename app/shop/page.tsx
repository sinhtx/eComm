'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { getAllMangoes } from '@/lib/mangoes'
import { useCart } from '@/components/CartProvider'
import type { MangoVariety } from '@/lib/types'

type FilterType = 'all' | 'in-season' | 'coming-soon'

export default function ShopPage() {
  const [mangoes, setMangoes] = useState<Array<{ variety: MangoVariety; comingSoonDate: string | null }>>([])
  const [filter, setFilter] = useState<FilterType>('all')
  const [loading, setLoading] = useState(true)
  const { openCart, addMangoToCart } = useCart()

  useEffect(() => {
    const loadMangoes = async () => {
      try {
        const data = await getAllMangoes()
        setMangoes(data)
      } catch (error) {
        console.error('Failed to load mangoes:', error)
      } finally {
        setLoading(false)
      }
    }
    loadMangoes()
  }, [])

  // Filter mangoes based on selected filter
  const filteredMangoes = mangoes.filter((item) => {
    const isComingSoon = item.comingSoonDate && new Date(item.comingSoonDate) > new Date()

    if (filter === 'in-season') return item.variety.inSeason && !isComingSoon
    if (filter === 'coming-soon') return isComingSoon
    return true // 'all'
  })

  const handleAddToCart = (mango: MangoVariety) => {
    addMangoToCart(mango)
    openCart()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-neutral-gray">Loading mangoes...</p>
      </div>
    )
  }

  return (
    <div className="bg-neutral-cream min-h-screen">
      {/* Header */}
      <section className="bg-primary-yellow text-neutral-charcoal py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-h1 mb-2">Our Premium Mangoes</h1>
          <p className="text-lg">Hand-picked tropical varieties, available year-round</p>
        </div>
      </section>

      {/* Filter & Cart Button */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'all'
                  ? 'bg-primary-yellow text-neutral-charcoal'
                  : 'bg-neutral-off-white text-neutral-charcoal hover:bg-primary-orange hover:text-white'
              }`}
            >
              All Varieties
            </button>
            <button
              onClick={() => setFilter('in-season')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'in-season'
                  ? 'bg-accent-pink text-white'
                  : 'bg-neutral-off-white text-neutral-charcoal hover:bg-accent-pink hover:text-white'
              }`}
            >
              In Season
            </button>
            <button
              onClick={() => setFilter('coming-soon')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'coming-soon'
                  ? 'bg-neutral-charcoal text-white'
                  : 'bg-neutral-off-white text-neutral-charcoal hover:bg-neutral-charcoal hover:text-white'
              }`}
            >
              Coming Soon
            </button>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-neutral-gray mb-6">
          Showing {filteredMangoes.length} {filteredMangoes.length === 1 ? 'variety' : 'varieties'}
        </p>

        {/* Mango Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMangoes.map((item) => {
            const isComingSoon = item.comingSoonDate && new Date(item.comingSoonDate) > new Date()
            const mango = item.variety

            return (
              <div key={mango.id} className="card hover:shadow-lg transition-shadow">
                {/* Image */}
                <div className="relative h-48 w-full overflow-hidden bg-neutral-off-white">
                  <Image
                    src={mango.imageUrl}
                    alt={mango.name}
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-300"
                  />

                  {/* Badge */}
                  <div className="absolute top-3 right-3">
                    {isComingSoon ? (
                      <span className="bg-neutral-charcoal text-neutral-cream px-3 py-1 rounded-full text-xs font-semibold">
                        Coming Soon
                      </span>
                    ) : mango.inSeason ? (
                      <span className="bg-accent-pink text-white px-3 py-1 rounded-full text-xs font-semibold">
                        In Season
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-h3 mb-1 text-neutral-charcoal">{mango.name}</h3>
                  <p className="text-small text-neutral-gray mb-3">{mango.description}</p>

                  {/* Price or Coming Soon Date */}
                  <div className="mb-4">
                    {isComingSoon ? (
                      <span className="text-small font-semibold text-secondary-green">
                        Available {item.comingSoonDate}
                      </span>
                    ) : (
                      <span className="text-body font-semibold text-primary-yellow">
                        ${mango.pricePerPound.toFixed(2)}/lb
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  {!isComingSoon && (
                    <button
                      onClick={() => handleAddToCart(mango)}
                      className="w-full bg-primary-yellow hover:bg-primary-orange text-neutral-charcoal font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {filteredMangoes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-neutral-gray text-lg">No mangoes found for this filter.</p>
          </div>
        )}
      </section>
    </div>
  )
}
