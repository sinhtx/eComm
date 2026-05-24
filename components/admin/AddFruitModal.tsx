'use client'

import { useState, useMemo } from 'react'
import { createFruit } from '@/app/actions/adminFruits'

interface AddFruitModalProps {
  onClose: () => void
  onSuccess: () => void
}

export function AddFruitModal({ onClose, onSuccess }: AddFruitModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [available, setAvailable] = useState(true)
  const [inSeason, setInSeason] = useState(false)
  const [comingSoonDate, setComingSoonDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      const { data, error: err } = await createFruit({
        name: name.trim(),
        description: description.trim(),
        price_per_pound: priceNum,
        available,
        in_season: inSeason,
        coming_soon_date: comingSoonDate || undefined,
      })

      if (!data) {
        setError(err || 'Failed to create fruit')
      } else {
        onSuccess()
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-slate-200 sticky top-0 bg-white">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Add New Fruit</h3>
            <p className="text-sm text-slate-600 mt-1">Create a new fruit variety</p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-2xl text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
              {error}
            </div>
          )}

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
                placeholder="e.g., Mango, Avocado, Peach"
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
                placeholder="Detailed description of the fruit variety..."
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
                {loading ? 'Creating...' : 'Create Fruit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
