import { createClient } from '@supabase/supabase-js'

let supabaseClientInstance: any = null
let supabaseServerInstance: any = null

function getSupabaseClient() {
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

function getSupabaseServer() {
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
export const supabaseClient = new Proxy(
  {},
  {
    get: (target, prop: string) => {
      const client = getSupabaseClient()
      return (client as any)[prop]
    },
  }
) as any

export const supabaseServer = new Proxy(
  {},
  {
    get: (target, prop: string) => {
      const client = getSupabaseServer()
      return (client as any)[prop]
    },
  }
) as any
