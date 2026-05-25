import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY

// Log for debugging (only warn, don't throw at build time)
if (typeof window === 'undefined') {
  // Server-side
  if (!supabaseSecretKey) console.warn('[Supabase] SUPABASE_SECRET_KEY is missing')
} else {
  // Client-side
  if (!supabasePublishableKey) console.warn('[Supabase] NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is missing')
}

if (!supabaseUrl) throw new Error('[Supabase] NEXT_PUBLIC_SUPABASE_URL is missing')

// Public client for browser-side auth (publishable key)
export const supabaseClient = createClient(
  supabaseUrl || '',
  supabasePublishableKey || ''
)

// Server client for protected operations (secret key)
export const supabaseServer = createClient(
  supabaseUrl || '',
  supabaseSecretKey || ''
)
