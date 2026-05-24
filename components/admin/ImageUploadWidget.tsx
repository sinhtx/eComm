'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { uploadFruitImage } from '@/app/actions/adminFruits'

interface ImageUploadWidgetProps {
  fruitId: string
  onSuccess: () => void
}

export function ImageUploadWidget({ fruitId, onSuccess }: ImageUploadWidgetProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function validateFile(file: File): string | null {
    const validMimeTypes = ['image/jpeg', 'image/png']
    if (!validMimeTypes.includes(file.type)) {
      return 'File must be JPG or PNG'
    }

    const maxSizeBytes = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSizeBytes) {
      return 'File size must not exceed 5MB'
    }

    return null
  }

  function handleFileSelect(file: File) {
    setError(null)
    setSuccess(null)

    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setSelectedFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setIsDragOver(true)
  }

  function handleDragLeave() {
    setIsDragOver(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragOver(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  async function handleUpload() {
    if (!selectedFile) {
      setError('Please select a file first')
      return
    }

    setUploading(true)
    setError(null)
    try {
      const { data, error: err } = await uploadFruitImage(fruitId, selectedFile)
      if (!data) {
        setError(err || 'Failed to upload image')
      } else {
        setSuccess('Image uploaded successfully!')
        setSelectedFile(null)
        setPreview(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        onSuccess()
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred')
    } finally {
      setUploading(false)
    }
  }

  function handleClear() {
    setSelectedFile(null)
    setPreview(null)
    setError(null)
    setSuccess(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg">
          {success}
        </div>
      )}

      {/* Drag & Drop Zone */}
      {!preview ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver
              ? 'border-amber-600 bg-amber-50'
              : 'border-slate-300 bg-slate-50 hover:border-amber-600'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleInputChange}
            className="hidden"
            disabled={uploading}
          />
          <div className="space-y-2">
            <div className="text-4xl">📸</div>
            <p className="font-semibold text-slate-900">Drag and drop your image here</p>
            <p className="text-sm text-slate-600">Or click to select a file</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="mt-4 px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-semibold rounded-lg transition-colors"
            >
              Browse Files
            </button>
            <p className="text-xs text-slate-500 mt-4">JPG or PNG, up to 5MB</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Preview */}
          <div className="relative border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
            {preview && (
              <Image
                src={preview}
                alt="Preview"
                width={500}
                height={400}
                className="w-full h-auto max-h-96 object-contain"
              />
            )}
          </div>

          {/* File Info */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-sm text-slate-600">
              <span className="font-semibold">File:</span> {selectedFile?.name}
            </p>
            <p className="text-sm text-slate-600 mt-1">
              <span className="font-semibold">Size:</span>{' '}
              {((selectedFile?.size || 0) / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClear}
              disabled={uploading}
              className="flex-1 px-4 py-2 bg-slate-200 hover:bg-slate-300 disabled:bg-slate-100 text-slate-900 font-semibold rounded-lg transition-colors"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-semibold rounded-lg transition-colors"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
