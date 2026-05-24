'use client'

import { useState, useMemo } from 'react'
import { updateFruit } from '@/app/actions/adminFruits'
import { ImageUploadWidget } from './ImageUploadWidget'
import { PhotoGalleryWidget } from './PhotoGalleryWidget'
import type { FruitWithImage } from '@/app/actions/adminFruits'

interface EditFruitModalProps {
  fruit: FruitWithImage
  onClose: () => void
  onSuccess: () => void
}

export function EditFruitModal({ fruit, onClose, onSuccess }: EditFruitModalProps) {
  const [name, setName] = useState(fruit.name)
  const [description, setDescription] = useState(fruit.description)
  const [price, setPrice] = useState(fruit.price_per_pound.toString())
  const [available, setAvailable] = useState(fruit.available)
  const [inSeason, setInSeason] = useState(fruit.in_season)
  const [comingSoonDate, setComingSoonDate] = useState(
    fruit.coming_soon_date ? fruit.coming_soon_date.split('T')[0] : ''
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'details' | 'images'>('details')
  const [refreshGallery, setRefreshGallery] = useState(0)

  const formattedComingSoonDate = useMemo(() => {
    if (!comingSoonDate) return null
    return new Date(comingSoonDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }, [comingSoonDate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    // Validation
    if (!name.trim()) {
      setError('Fruit name is required')
      return
    }

    const priceNum = parseFloat(price)
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Price must be greater than 0')
      return
    }

    setLoading(true)
    try {
      const { success, error: err } = await updateFruit(fruit.id, {
        name: name.trim(),
        description: description.trim(),
        price_per_pound: priceNum,
        available,
        in_season: inSeason,
        coming_soon_date: comingSoonDate || null,
      })

      if (!success) {
        setError(err || 'Failed to update fruit')
      } else {
        onSuccess()
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  function handleImageUploadSuccess() {
    // Trigger gallery refresh
    setRefreshGallery((prev) => prev + 1)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-slate-200 sticky top-0 bg-white">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Edit Fruit</h3>
            <p className="text-sm text-slate-600 mt-1">{fruit.name}</p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-2xl text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 bg-slate-50">
          <div className="flex">
            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 px-6 py-4 font-semibold border-b-2 transition-colors ${
                activeTab === 'details'
                  ? 'border-amber-600 text-amber-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('images')}
              className={`flex-1 px-6 py-4 font-semibold border-b-2 transition-colors ${
                activeTab === 'images'
                  ? 'border-amber-600 text-amber-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Images
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
              {error}
            </div>
          )}

          {activeTab === 'details' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Fruit Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Mango"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-slate-900"
                  disabled={loading}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed description of the fruit..."
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-slate-900"
                  disabled={loading}
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Price per Pound ($) <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-slate-900"
                  disabled={loading}
                />
              </div>

              {/* Availability Checkboxes */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={available}
                    onChange={(e) => setAvailable(e.target.checked)}
                    className="w-4 h-4 rounded accent-amber-600"
                    disabled={loading}
                  />
                  <span className="text-sm font-semibold text-slate-900">Available for purchase</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inSeason}
                    onChange={(e) => setInSeason(e.target.checked)}
                    className="w-4 h-4 rounded accent-amber-600"
                    disabled={loading}
                  />
                  <span className="text-sm font-semibold text-slate-900">Currently in season</span>
                </label>
              </div>

              {/* Coming Soon Date */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Coming Soon Date (Optional)
                </label>
                <input
                  type="date"
                  value={comingSoonDate}
                  onChange={(e) => setComingSoonDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-slate-900"
                  disabled={loading}
                />
                {formattedComingSoonDate && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-semibold text-blue-900">
                      Will show as &quot;Coming Soon: {formattedComingSoonDate}&quot;
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 disabled:bg-slate-100 text-slate-900 font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'images' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-slate-900 mb-4">Upload New Image</h4>
                <ImageUploadWidget
                  fruitId={fruit.id}
                  onSuccess={handleImageUploadSuccess}
                />
              </div>

              <div>
                <h4 className="text-lg font-semibold text-slate-900 mb-4">Photo Gallery</h4>
                <PhotoGalleryWidget
                  fruitId={fruit.id}
                  currentImageId={fruit.current_image_id}
                  refreshTrigger={refreshGallery}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
