'use client'

import { useState, useEffect } from 'react'
import { supabaseClient } from './supabaseClient'
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js'

export function useAdminAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check current auth state
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabaseClient.auth.getUser()
        if (error) {
          setError(error.message)
          setUser(null)
        } else {
          setUser(user)
          setError(null)
        }
      } catch (err) {
        console.error('Auth check failed:', err)
        setError(err instanceof Error ? err.message : 'Auth check failed')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Listen for auth state changes
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          setError(null)
        }
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  return { user, loading, error }
}
