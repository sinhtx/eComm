'use client'

import { MangoVariety } from './types'
import { getFruits, type FruitWithImage } from '@/app/actions/adminFruits'
import {
  getFallbackAvailableMangoes,
  getFallbackMangoesWithMeta,
} from '@/lib/mangoCatalogFallback'

// Cache management for database fruits
let cachedFruits: FruitWithImage[] | null = null
let cacheTime = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

/**
 * Fetch available mangoes from Supabase database.
 * Filters: available = true AND (no coming_soon_date OR coming_soon_date <= now)
 * Now fetches from Supabase database instead of hardcoded data.
 * Implements client-side caching (5 minute TTL) to avoid excessive DB calls.
 */
export async function getAvailableMangoes(): Promise<MangoVariety[]> {
  try {
    // Use cache if fresh
    if (cachedFruits && Date.now() - cacheTime < CACHE_DURATION) {
      return convertFruitsToMangoVarietiesWithMeta(cachedFruits).map(
        (m) => m.variety
      )
    }

    const { data, error } = await getFruits()
    if (error) {
      console.error('Failed to fetch fruits:', error)
      return getFallbackAvailableMangoes()
    }
    if (!data?.length) {
      return getFallbackAvailableMangoes()
    }

    // Update cache
    cachedFruits = data
    cacheTime = Date.now()

    // Filter: available AND not coming soon (coming_soon_date is null or passed)
    const availableFruits = data.filter((fruit) => {
      // Must be available
      if (!fruit.available) return false

      // If no coming_soon_date, include it
      if (!fruit.coming_soon_date) return true

      // If coming_soon_date exists, only include if it's in the past
      const comingSoonDate = new Date(fruit.coming_soon_date)
      return comingSoonDate <= new Date()
    })

    return convertFruitsToMangoVarieties(availableFruits)
  } catch (e) {
    console.error('getAvailableMangoes failed:', e)
    return getFallbackAvailableMangoes()
  }
}

/**
 * Fetch all mangoes including coming soon items.
 * Returns fruits with coming_soon_date metadata for UI to display Coming Soon overlay.
 */
export async function getAllMangoes(): Promise<
  Array<{ variety: MangoVariety; comingSoonDate: string | null }>
> {
  try {
    // Use cache if fresh
    if (cachedFruits && Date.now() - cacheTime < CACHE_DURATION) {
      return convertFruitsToMangoVarietiesWithMeta(cachedFruits)
    }

    const { data, error } = await getFruits()
    if (error) {
      console.error('Failed to fetch fruits:', error)
      return getFallbackMangoesWithMeta()
    }
    if (!data?.length) {
      return getFallbackMangoesWithMeta()
    }

    // Update cache
    cachedFruits = data
    cacheTime = Date.now()

    // Include all available fruits (with or without coming_soon_date)
    const availableFruits = data.filter((f) => f.available)

    return convertFruitsToMangoVarietiesWithMeta(availableFruits)
  } catch (e) {
    console.error('getAllMangoes failed:', e)
    return getFallbackMangoesWithMeta()
  }
}

/**
 * Get a single mango by ID from cache or database.
 * Falls back to fresh DB fetch if not in cache.
 */
export async function getMangoById(id: string): Promise<MangoVariety | undefined> {
  try {
    let fruits = cachedFruits

    // If cache is empty or stale, fetch fresh data
    if (!fruits || Date.now() - cacheTime >= CACHE_DURATION) {
      const { data, error } = await getFruits()
      if (error || !data?.length) {
        if (error) console.error('Failed to fetch fruits:', error)
        return getFallbackMangoesWithMeta().find((r) => r.variety.id === id)
          ?.variety
      }
      fruits = data
      cachedFruits = data
      cacheTime = Date.now()
    }

    const fruit = fruits.find((f) => f.id === id)
    if (!fruit) {
      return getFallbackMangoesWithMeta().find((r) => r.variety.id === id)
        ?.variety
    }

    return convertFruitToMangoVariety(fruit)
  } catch (e) {
    console.error('getMangoById failed:', e)
    return getFallbackMangoesWithMeta().find((r) => r.variety.id === id)
      ?.variety
  }
}

/**
 * Convert FruitWithImage from database to MangoVariety interface.
 */
function convertFruitToMangoVariety(fruit: FruitWithImage): MangoVariety {
  const imageUrl =
    fruit.current_image?.imageUrl || getPlaceholderImageUrl(fruit.name)

  return {
    id: fruit.id,
    name: fruit.name,
    description: fruit.description,
    imageUrl,
    available: fruit.available,
    inSeason: fruit.in_season,
    pricePerPound: fruit.price_per_pound,
  }
}

/**
 * Convert array of fruits to MangoVariety[].
 */
function convertFruitsToMangoVarieties(fruits: FruitWithImage[]): MangoVariety[] {
  return fruits.map(convertFruitToMangoVariety)
}

/**
 * Convert array of fruits to MangoVariety[] with coming_soon_date metadata.
 */
function convertFruitsToMangoVarietiesWithMeta(
  fruits: FruitWithImage[]
): Array<{ variety: MangoVariety; comingSoonDate: string | null }> {
  return fruits.map((fruit) => ({
    variety: convertFruitToMangoVariety(fruit),
    comingSoonDate: fruit.coming_soon_date,
  }))
}

/**
 * Generate placeholder image URL for a fruit variety.
 * Uses lowercase mango name with .svg extension.
 * Falls back to generic SVG if specific variety image not found.
 */
function getPlaceholderImageUrl(fruitName: string): string {
  const sanitized = fruitName.toLowerCase().replace(/\s+/g, '-')
  return `/images/mangoes/${sanitized}.svg`
}
