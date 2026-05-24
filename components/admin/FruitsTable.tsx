'use client'

import { useState } from 'react'
import { deleteFruit } from '@/app/actions/adminFruits'
import type { FruitWithImage } from '@/app/actions/adminFruits'

interface FruitsTableProps {
  fruits: FruitWithImage[]
  onEdit: (fruit: FruitWithImage) => void
  onRefresh: () => Promise<void>
}

export function FruitsTable({ fruits, onEdit, onRefresh }: FruitsTableProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<FruitWithImage | null>(null)
  const [deleting, setDeleting] = useState(false)

  function getStatusBadge(fruit: FruitWithImage) {
    const now = new Date()
    const comingSoonDate = fruit.coming_soon_date ? new Date(fruit.coming_soon_date) : null

    // Coming Soon takes priority
    if (comingSoonDate && comingSoonDate > now) {
      const formatted = comingSoonDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
      return (
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
          Coming Soon: {formatted}
        </span>
      )
    }

    if (fruit.in_season) {
      return (
        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
          In Season
        </span>
      )
    }

    if (fruit.available) {
      return (
        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">
          Available
        </span>
      )
    }

    return (
      <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
        Sold Out
      </span>
    )
  }

  async function handleConfirmDelete(fruit: FruitWithImage) {
    setDeleting(true)
    try {
      const { success, error } = await deleteFruit(fruit.id)
      if (success) {
        await onRefresh()
      } else {
        alert(`Failed to delete fruit: ${error}`)
      }
    } finally {
      setDeleting(false)
      setDeleteConfirm(null)
    }
  }

  if (fruits.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <p className="text-lg text-slate-600 mb-2">No fruits found</p>
        <p className="text-sm text-slate-500">Create your first fruit to get started</p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-slate-900">Name</th>
                <th className="text-right px-6 py-4 font-semibold text-slate-900">Price</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-900">Status</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {fruits.map((fruit) => (
                <tr key={fruit.id} className="hover:bg-slate-50 transition-colors">
                  <td
                    className="px-6 py-4 text-slate-900 font-semibold cursor-pointer hover:text-amber-600"
                    onClick={() => onEdit(fruit)}
                  >
                    {fruit.name}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-900 font-semibold">
                    ${fruit.price_per_pound.toFixed(2)}/lb
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(fruit)}</td>
                  <td className="px-6 py-4 space-x-2 flex flex-wrap gap-2">
                    <button
                      onClick={() => onEdit(fruit)}
                      className="text-amber-600 hover:text-amber-700 font-semibold text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(fruit)}
                      className="text-red-600 hover:text-red-700 font-semibold text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Delete Fruit</h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete &quot;{deleteConfirm.name}&quot;? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmDelete(deleteConfirm)}
                disabled={deleting}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-2 px-4 rounded-lg"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
