import { createClient } from '@supabase/supabase-js'

// Debug: Log environment variables
console.log('[Supabase Debug] NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ SET' : '✗ MISSING')
console.log('[Supabase Debug] NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:', process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ? '✓ SET' : '✗ MISSING')
console.log('[Supabase Debug] SUPABASE_SECRET_KEY:', process.env.SUPABASE_SECRET_KEY ? '✓ SET' : '✗ MISSING')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY

if (!supabaseUrl) throw new Error('[Supabase] NEXT_PUBLIC_SUPABASE_URL is missing')
if (!supabasePublishableKey) throw new Error('[Supabase] NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is missing')
if (!supabaseSecretKey) throw new Error('[Supabase] SUPABASE_SECRET_KEY is missing')

// Public client for browser-side auth (publishable key)
export const supabaseClient = createClient(supabaseUrl, supabasePublishableKey)

// Server client for protected operations (secret key)
export const supabaseServer = createClient(supabaseUrl, supabaseSecretKey)
