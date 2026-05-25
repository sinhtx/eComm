import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let supabaseClientInstance: SupabaseClient | null = null
let supabaseServerInstance: SupabaseClient | null = null

function getSupabaseClient(): SupabaseClient {
  if (!supabaseClientInstance) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

    if (!url || !key) {
      throw new Error(
        'Supabase client not initialized. Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'
      )
    }

    supabaseClientInstance = createClient(url, key)
  }
  return supabaseClientInstance
}

function getSupabaseServer(): SupabaseClient {
  if (!supabaseServerInstance) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SECRET_KEY

    if (!url || !key) {
      throw new Error(
        'Supabase server not initialized. Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY'
      )
    }

    supabaseServerInstance = createClient(url, key)
  }
  return supabaseServerInstance
}

// Export functions for direct use
export { getSupabaseClient, getSupabaseServer }

// Lazy getters - initialize only when accessed
export const supabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop: string | symbol) {
    const client = getSupabaseClient()
    return Reflect.get(client as unknown as Record<string | symbol, unknown>, prop)
  },
}) as SupabaseClient

export const supabaseServer = new Proxy({} as SupabaseClient, {
  get(_target, prop: string | symbol) {
    const client = getSupabaseServer()
    return Reflect.get(client as unknown as Record<string | symbol, unknown>, prop)
  },
}) as SupabaseClient
