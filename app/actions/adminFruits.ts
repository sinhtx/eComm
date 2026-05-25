'use server'

import { supabaseServer } from '@/lib/auth/supabaseClient'

// ============================================================================
// Type Definitions
// ============================================================================

export interface Fruit {
  id: string
  name: string
  description: string
  price_per_pound: number
  available: boolean
  in_season: boolean
  coming_soon_date: string | null
  current_image_id: string | null
  created_at: string
  updated_at: string
}

export interface MangoImage {
  id: string
  mango_id: string
  storage_path: string
  file_name: string
  uploaded_at: string
  deleted_at: string | null
}

export interface FruitWithImage extends Fruit {
  current_image?: {
    id: string
    storage_path: string
    file_name: string
    imageUrl: string
  }
}

export interface CreateFruitInput {
  name: string
  description: string
  price_per_pound: number
  available: boolean
  in_season: boolean
  coming_soon_date?: string
}

export interface UpdateFruitInput {
  name?: string
  description?: string
  price_per_pound?: number
  available?: boolean
  in_season?: boolean
  coming_soon_date?: string | null
}

// ============================================================================
// Helper Functions
// ============================================================================

function getPublicImageUrl(storagePath: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  return `${baseUrl}/storage/v1/object/public/mango-images/${storagePath}`
}

function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
}

// ============================================================================
// Server Actions
// ============================================================================

/**
 * Fetch all fruits with their current images
 * Returns non-deleted fruits (available = true OR coming_soon_date is set)
 */
export async function getFruits(): Promise<{
  data: FruitWithImage[]
  error: string | null
}> {
  try {
    const { data, error } = await supabaseServer
      .from('mango_varieties')
      .select(
        `
        id,
        name,
        description,
        price_per_pound,
        available,
        in_season,
        coming_soon_date,
        current_image_id,
        created_at,
        updated_at,
        current_image:mango_images!current_image_id (
          id,
          storage_path,
          file_name
        )
      `
      )
      .or('available.eq.true,coming_soon_date.not.is.null')
      .order('name', { ascending: true })

    if (error) throw error

    const fruits: FruitWithImage[] = (data || []).map((fruit: unknown) => {
      const fruitData = fruit as Record<string, unknown>
      const currentImg = fruitData.current_image as
        | { id: string; storage_path: string; file_name: string }
        | null
        | undefined

      return {
        id: fruitData.id as string,
        name: fruitData.name as string,
        description: fruitData.description as string,
        price_per_pound: fruitData.price_per_pound as number,
        available: fruitData.available as boolean,
        in_season: fruitData.in_season as boolean,
        coming_soon_date: (fruitData.coming_soon_date as string) || null,
        current_image_id: (fruitData.current_image_id as string) || null,
        created_at: fruitData.created_at as string,
        updated_at: fruitData.updated_at as string,
        current_image: currentImg
          ? {
              ...currentImg,
              imageUrl: getPublicImageUrl(currentImg.storage_path),
            }
          : undefined,
      }
    })

    return {
      data: fruits,
      error: null,
    }
  } catch (error) {
    console.error('Failed to fetch fruits:', error)
    const msg = error instanceof Error
      ? error.message
      : (error as { message?: string })?.message ?? 'Failed to fetch fruits'
    return { data: [], error: msg }
  }
}

/**
 * Create a new fruit
 */
export async function createFruit(input: CreateFruitInput): Promise<{
  data: Fruit | null
  error: string | null
}> {
  try {
    // Validation
    if (!input.name || input.name.trim().length === 0) {
      return {
        data: null,
        error: 'Fruit name is required',
      }
    }

    if (input.price_per_pound <= 0) {
      return {
        data: null,
        error: 'Price must be greater than 0',
      }
    }

    const { data, error } = await supabaseServer
      .from('mango_varieties')
      .insert({
        name: input.name,
        description: input.description,
        price_per_pound: input.price_per_pound,
        available: input.available,
        in_season: input.in_season,
        coming_soon_date: input.coming_soon_date || null,
      })
      .select()
      .single()

    if (error) throw error

    return {
      data: data as Fruit,
      error: null,
    }
  } catch (error) {
    console.error('Failed to create fruit:', error)
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to create fruit',
    }
  }
}

/**
 * Update fruit details
 */
export async function updateFruit(
  fruitId: string,
  input: UpdateFruitInput
): Promise<{
  success: boolean
  error: string | null
}> {
  try {
    // Validation for price if provided
    if (input.price_per_pound !== undefined && input.price_per_pound <= 0) {
      return {
        success: false,
        error: 'Price must be greater than 0',
      }
    }

    // Build update object with only provided fields
    const updateData: Partial<Fruit> & { updated_at: string } = {
      updated_at: new Date().toISOString(),
    }

    if (input.name !== undefined) updateData.name = input.name
    if (input.description !== undefined) updateData.description = input.description
    if (input.price_per_pound !== undefined) updateData.price_per_pound = input.price_per_pound
    if (input.available !== undefined) updateData.available = input.available
    if (input.in_season !== undefined) updateData.in_season = input.in_season
    if (input.coming_soon_date !== undefined) updateData.coming_soon_date = input.coming_soon_date

    const { error } = await supabaseServer
      .from('mango_varieties')
      .update(updateData)
      .eq('id', fruitId)

    if (error) throw error

    return {
      success: true,
      error: null,
    }
  } catch (error) {
    console.error('Failed to update fruit:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update fruit',
    }
  }
}

/**
 * Upload a fruit image to Supabase Storage and create mango_images record
 */
export async function uploadFruitImage(
  fruitId: string,
  file: File
): Promise<{
  data: MangoImage | null
  error: string | null
}> {
  try {
    // 1. Validate file
    const validMimeTypes = ['image/jpeg', 'image/png']
    if (!validMimeTypes.includes(file.type)) {
      return {
        data: null,
        error: 'File must be JPG or PNG',
      }
    }

    const maxSizeBytes = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSizeBytes) {
      return {
        data: null,
        error: 'File size must not exceed 5MB',
      }
    }

    // 2. Upload to Supabase Storage
    const sanitizedFileName = sanitizeFileName(file.name)
    const timestamp = Date.now()
    const storagePath = `${fruitId}/${timestamp}-${sanitizedFileName}`

    const { error: uploadError } = await supabaseServer.storage
      .from('mango-images')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) throw uploadError

    // 3. Create mango_images record
    const { data: imageRecord, error: dbError } = await supabaseServer
      .from('mango_images')
      .insert({
        mango_id: fruitId,
        storage_path: storagePath,
        file_name: file.name,
      })
      .select()
      .single()

    if (dbError) throw dbError

    // 4. If this is the first image for the fruit, set it as current
    const { data: fruit, error: fruitError } = await supabaseServer
      .from('mango_varieties')
      .select('current_image_id')
      .eq('id', fruitId)
      .single()

    if (fruitError) throw fruitError

    if (!fruit.current_image_id) {
      const { error: updateError } = await supabaseServer
        .from('mango_varieties')
        .update({ current_image_id: imageRecord.id })
        .eq('id', fruitId)

      if (updateError) throw updateError
    }

    return {
      data: imageRecord as MangoImage,
      error: null,
    }
  } catch (error) {
    console.error('Failed to upload fruit image:', error)
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to upload image',
    }
  }
}

/**
 * Set the current image for a fruit
 */
export async function setCurrentImage(
  fruitId: string,
  imageId: string
): Promise<{
  success: boolean
  error: string | null
}> {
  try {
    // 1. Verify imageId belongs to fruitId
    const { data: image, error: imageError } = await supabaseServer
      .from('mango_images')
      .select('mango_id')
      .eq('id', imageId)
      .single()

    if (imageError) throw imageError

    if (!image || image.mango_id !== fruitId) {
      return {
        success: false,
        error: 'Image does not belong to this fruit',
      }
    }

    // 2. Update mango_varieties.current_image_id
    const { error: updateError } = await supabaseServer
      .from('mango_varieties')
      .update({
        current_image_id: imageId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', fruitId)

    if (updateError) throw updateError

    return {
      success: true,
      error: null,
    }
  } catch (error) {
    console.error('Failed to set current image:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to set current image',
    }
  }
}

/**
 * Soft delete an image by setting deleted_at timestamp
 */
export async function deleteImage(imageId: string): Promise<{
  success: boolean
  error: string | null
}> {
  try {
    // 1. Get image details
    const { data: image, error: getError } = await supabaseServer
      .from('mango_images')
      .select('id, mango_id')
      .eq('id', imageId)
      .single()

    if (getError) throw getError

    // 2. Soft delete the image
    const { error: deleteError } = await supabaseServer
      .from('mango_images')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', imageId)

    if (deleteError) throw deleteError

    // 3. Check if this was the current_image
    const { data: fruit, error: fruitError } = await supabaseServer
      .from('mango_varieties')
      .select('current_image_id')
      .eq('id', image.mango_id)
      .single()

    if (fruitError) throw fruitError

    if (fruit.current_image_id === imageId) {
      // 4. Find next non-deleted image
      const { data: nextImage, error: nextError } = await supabaseServer
        .from('mango_images')
        .select('id')
        .eq('mango_id', image.mango_id)
        .is('deleted_at', null)
        .order('uploaded_at', { ascending: false })
        .limit(1)
        .single()

      if (nextError && nextError.code !== 'PGRST116') {
        throw nextError
      }

      // 5. Update current_image_id
      const newImageId = nextImage?.id || null
      const { error: updateError } = await supabaseServer
        .from('mango_varieties')
        .update({
          current_image_id: newImageId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', image.mango_id)

      if (updateError) throw updateError
    }

    return {
      success: true,
      error: null,
    }
  } catch (error) {
    console.error('Failed to delete image:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete image',
    }
  }
}

/**
 * Soft delete a fruit by setting available to false
 */
export async function deleteFruit(fruitId: string): Promise<{
  success: boolean
  error: string | null
}> {
  try {
    const { error } = await supabaseServer
      .from('mango_varieties')
      .update({
        available: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', fruitId)

    if (error) throw error

    return {
      success: true,
      error: null,
    }
  } catch (error) {
    console.error('Failed to delete fruit:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete fruit',
    }
  }
}
