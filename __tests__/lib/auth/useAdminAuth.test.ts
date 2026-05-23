import { renderHook, waitFor } from '@testing-library/react'
import { useAdminAuth } from '@/lib/auth/useAdminAuth'

// Mock Supabase client
jest.mock('@/lib/auth/supabaseClient', () => ({
  supabaseClient: {
    auth: {
      getUser: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
  },
}))

describe('useAdminAuth hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with loading state', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { supabaseClient } = require('@/lib/auth/supabaseClient')
    supabaseClient.auth.getUser.mockResolvedValue({ data: { user: null }, error: null })
    supabaseClient.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: null },
    })

    const { result } = renderHook(() => useAdminAuth())

    expect(result.current.loading).toBe(true)
  })

  it('should return user and loading states', async () => {
    const mockUser = { id: 'test-id', email: 'test@example.com' }
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { supabaseClient } = require('@/lib/auth/supabaseClient')

    supabaseClient.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })
    supabaseClient.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: null },
    })

    const { result } = renderHook(() => useAdminAuth())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.user).toEqual(mockUser)
    expect(result.current.error).toBeNull()
  })

  it('should handle auth errors gracefully', async () => {
    const mockError = new Error('Auth failed')
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { supabaseClient } = require('@/lib/auth/supabaseClient')

    supabaseClient.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: mockError,
    })
    supabaseClient.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: null },
    })

    const { result } = renderHook(() => useAdminAuth())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.user).toBeNull()
    expect(result.current.error).toBe(mockError.message)
  })
})
