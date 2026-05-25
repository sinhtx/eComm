import { createClient } from '@supabase/supabase-js'

let supabaseClientInstance: ReturnType<typeof createClient> | null = null
let supabaseServerInstance: ReturnType<typeof createClient> | null = null

// Lazy initialization - creates client on first access, not at module load time
export const supabaseClient = new Proxy(
  {},
  {
    get: (target, prop) => {
      if (!supabaseClientInstance) {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL
        const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

        if (!url || !key) {
          throw new Error(
            'Supabase client key missing. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are set.'
          )
        }

        supabaseClientInstance = createClient(url, key)
      }

      return (supabaseClientInstance as any)[prop]
    },
  }
) as ReturnType<typeof createClient>

export const supabaseServer = new Proxy(
  {},
  {
    get: (target, prop) => {
      if (!supabaseServerInstance) {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL
        const key = process.env.SUPABASE_SECRET_KEY

        if (!url || !key) {
          throw new Error(
            'Supabase server key missing. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY are set.'
          )
        }

        supabaseServerInstance = createClient(url, key)
      }

      return (supabaseServerInstance as any)[prop]
    },
  }
) as ReturnType<typeof createClient>
