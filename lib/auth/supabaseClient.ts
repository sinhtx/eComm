import { createClient } from '@supabase/supabase-js'

let supabaseClientInstance: ReturnType<typeof createClient> | null = null
let supabaseServerInstance: ReturnType<typeof createClient> | null = null

// Only create clients if keys are available (safe for build time)
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
const secretKey = process.env.SUPABASE_SECRET_KEY

try {
  if (url && publishableKey) {
    supabaseClientInstance = createClient(url, publishableKey)
  }
} catch (e) {
  console.warn('Failed to initialize Supabase client:', e)
}

try {
  if (url && secretKey) {
    supabaseServerInstance = createClient(url, secretKey)
  }
} catch (e) {
  console.warn('Failed to initialize Supabase server:', e)
}

// Export with fallback - will use dummy client if env vars missing at build time
export const supabaseClient =
  supabaseClientInstance ||
  createClient('https://dummy.supabase.co', 'dummy-key')

export const supabaseServer =
  supabaseServerInstance ||
  createClient('https://dummy.supabase.co', 'dummy-key')
