'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { FruitsTable } from '@/components/admin/FruitsTable'
import { EditFruitModal } from '@/components/admin/EditFruitModal'
import { AddFruitModal } from '@/components/admin/AddFruitModal'
import { getFruits } from '@/app/actions/adminFruits'
import type { FruitWithImage } from '@/app/actions/adminFruits'

export default function FruitsPage() {
  const [fruits, setFruits] = useState<FruitWithImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedFruit, setSelectedFruit] = useState<FruitWithImage | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddingNew, setIsAddingNew] = useState(false)

  useEffect(() => {
    fetchFruits()
  }, [])

  async function fetchFruits() {
    setLoading(true)
    setError(null)
    const { data, error: err } = await getFruits()
    if (err) {
      setError(err)
    } else {
      setFruits(data)
    }
    setLoading(false)
  }

  function handleOpenEdit(fruit: FruitWithImage) {
    setSelectedFruit(fruit)
    setIsEditModalOpen(true)
  }

  function handleCloseEdit() {
    setIsEditModalOpen(false)
    setSelectedFruit(null)
  }

  function handleOpenAdd() {
    setIsAddingNew(true)
  }

  function handleCloseAdd() {
    setIsAddingNew(false)
  }

  async function handleEditSuccess() {
    await fetchFruits()
    handleCloseEdit()
  }

  async function handleAddSuccess() {
    await fetchFruits()
    handleCloseAdd()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-3"></div>
          <p className="text-slate-600">Loading fruits...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Fruits Management</h2>
        <div className="flex gap-3">
          <button
            onClick={fetchFruits}
            className="px-4 py-2 text-sm font-semibold text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
          >
            Refresh
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 text-sm font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
          >
            Add New Fruit
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
          {error}
        </div>
      )}

      <FruitsTable
        fruits={fruits}
        onEdit={handleOpenEdit}
        onRefresh={fetchFruits}
      />

      {isEditModalOpen && selectedFruit && (
        <EditFruitModal
          fruit={selectedFruit}
          onClose={handleCloseEdit}
          onSuccess={handleEditSuccess}
        />
      )}

      {isAddingNew && (
        <AddFruitModal
          onClose={handleCloseAdd}
          onSuccess={handleAddSuccess}
        />
      )}
    </div>
  )
}
