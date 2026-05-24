'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { supabaseClient } from '@/lib/auth/supabaseClient'
import { setCurrentImage, deleteImage } from '@/app/actions/adminFruits'
import type { MangoImage } from '@/app/actions/adminFruits'

interface PhotoGalleryWidgetProps {
  fruitId: string
  currentImageId: string | null
  refreshTrigger: number
}

export function PhotoGalleryWidget({
  fruitId,
  currentImageId,
  refreshTrigger,
}: PhotoGalleryWidgetProps) {
  const [images, setImages] = useState<MangoImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<MangoImage | null>(null)

  useEffect(() => {
    const loadImages = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data, error: err } = await supabaseClient
          .from('mango_images')
          .select('*')
          .eq('mango_id', fruitId)
          .is('deleted_at', null)
          .order('uploaded_at', { ascending: false })

        if (err) throw err
        setImages(data || [])
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load images')
      } finally {
        setLoading(false)
      }
    }

    loadImages()
  }, [fruitId, refreshTrigger])

  function getImageUrl(storagePath: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    return `${baseUrl}/storage/v1/object/public/mango-images/${storagePath}`
  }

  async function refreshImages() {
    setLoading(true)
    setError(null)
    try {
      const { data, error: err } = await supabaseClient
        .from('mango_images')
        .select('*')
        .eq('mango_id', fruitId)
        .is('deleted_at', null)
        .order('uploaded_at', { ascending: false })

      if (err) throw err
      setImages(data || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load images')
    } finally {
      setLoading(false)
    }
  }

  async function handleMakeCurrent(imageId: string) {
    setActionLoading(true)
    try {
      const { success, error: err } = await setCurrentImage(fruitId, imageId)
      if (!success) {
        setError(err || 'Failed to set current image')
      } else {
        // Refresh images to update current status
        await refreshImages()
      }
    } finally {
      setActionLoading(false)
    }
  }

  async function handleDeleteConfirm(image: MangoImage) {
    setActionLoading(true)
    try {
      const { success, error: err } = await deleteImage(image.id)
      if (!success) {
        setError(err || 'Failed to delete image')
      } else {
        await refreshImages()
        setDeleteConfirm(null)
      }
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600 mx-auto mb-2"></div>
          <p className="text-sm text-slate-600">Loading images...</p>
        </div>
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
        <p className="text-slate-600">No images uploaded yet</p>
        <p className="text-sm text-slate-500 mt-1">Upload your first image above</p>
      </div>
    )
  }

  return (
    <>
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {images.map((image) => {
          const isCurrent = image.id === currentImageId
          const imageUrl = getImageUrl(image.storage_path)

          return (
            <div
              key={image.id}
              className={`border-2 rounded-lg overflow-hidden transition-colors ${
                isCurrent ? 'border-amber-600 bg-amber-50' : 'border-slate-200 hover:border-amber-600'
              }`}
            >
              <div className="flex flex-col md:flex-row gap-4 p-4">
                {/* Image Thumbnail */}
                <div className="flex-shrink-0 w-full md:w-32">
                  <Image
                    src={imageUrl}
                    alt={image.file_name}
                    width={128}
                    height={128}
                    className="w-full h-32 object-cover rounded"
                  />
                </div>

                {/* Image Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{image.file_name}</p>
                      <p className="text-xs text-slate-600 mt-1">
                        Uploaded: {new Date(image.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>
                    {isCurrent && (
                      <span className="px-3 py-1 bg-amber-600 text-white text-xs font-semibold rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 md:w-32">
                  {!isCurrent && (
                    <button
                      onClick={() => handleMakeCurrent(image.id)}
                      disabled={actionLoading}
                      className="px-3 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white text-sm font-semibold rounded transition-colors"
                    >
                      {actionLoading ? 'Setting...' : 'Make Current'}
                    </button>
                  )}
                  <button
                    onClick={() => setDeleteConfirm(image)}
                    disabled={actionLoading}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-sm font-semibold rounded transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Delete Image</h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete &quot;{deleteConfirm.file_name}&quot;? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteConfirm(deleteConfirm)}
                disabled={actionLoading}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-2 px-4 rounded-lg"
              >
                {actionLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
