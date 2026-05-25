import { createClient } from '@supabase/supabase-js'

let supabaseClientInstance: any = null
let supabaseServerInstance: any = null

function getSupabaseClient() {
  if (!supabaseClientInstance) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

    if (!url || !key) {
      console.warn('Supabase client not initialized - keys missing')
      return null
    }

    supabaseClientInstance = createClient(url, key)
  }
  return supabaseClientInstance
}

function getSupabaseServer() {
  if (!supabaseServerInstance) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SECRET_KEY

    if (!url || !key) {
      console.warn('Supabase server not initialized - keys missing')
      return null
    }

    supabaseServerInstance = createClient(url, key)
  }
  return supabaseServerInstance
}

// Lazy getters - initialize only when accessed
export const supabaseClient = {
  get auth() {
    return getSupabaseClient()?.auth
  },
  get storage() {
    return getSupabaseClient()?.storage
  },
  get rpc() {
    return getSupabaseClient()?.rpc
  },
  from(table: string) {
    return getSupabaseClient()?.from(table)
  },
} as any

export const supabaseServer = {
  get auth() {
    return getSupabaseServer()?.auth
  },
  get storage() {
    return getSupabaseServer()?.storage
  },
  get rpc() {
    return getSupabaseServer()?.rpc
  },
  from(table: string) {
    return getSupabaseServer()?.from(table)
  },
} as any
