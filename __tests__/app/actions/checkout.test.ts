// Mock Supabase before importing the server action
jest.mock('@/lib/auth/supabaseClient', () => ({
  supabaseServer: {
    from: jest.fn(),
  },
}))

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { supabaseServer } = require('@/lib/auth/supabaseClient')
import { lookupOrCreateCustomer } from '@/app/actions/checkout'

describe('lookupOrCreateCustomer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return error if email is invalid', async () => {
    const result = await lookupOrCreateCustomer({
      email: 'invalid-email',
      firstName: 'John',
      lastName: 'Doe',
      phone: '555-1234',
      addressLine1: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94103',
    })

    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
  })

  it('should create new customer if email does not exist', async () => {
    const newCustomerId = 'cust-new-123'
    const email = 'newcustomer@example.com'

    // Mock: email lookup returns null (no existing customer)
    supabaseServer.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockResolvedValue({
        data: null,
        error: null,
      }),
    })

    // Mock: insert new customer
    supabaseServer.from.mockReturnValueOnce({
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { id: newCustomerId },
        error: null,
      }),
    })

    const result = await lookupOrCreateCustomer({
      email,
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '555-5678',
      addressLine1: '456 Oak Ave',
      city: 'Portland',
      state: 'OR',
      zipCode: '97201',
      countryCode: 'US',
    })

    expect(result.success).toBe(true)
    expect(result.customerId).toBe(newCustomerId)
    expect(result.isReturning).toBe(false)
  })

  it('should update and return existing customer if email exists', async () => {
    const customerId = 'cust-existing-123'
    const email = 'existing@example.com'

    // First call: lookup returns existing customer
    supabaseServer.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockResolvedValue({
        data: { id: customerId },
        error: null,
      }),
    })

    // First call: update existing customer
    supabaseServer.from.mockReturnValueOnce({
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({
        error: null,
      }),
    })

    const first = await lookupOrCreateCustomer({
      email,
      firstName: 'John',
      lastName: 'Doe',
      phone: '555-1111',
      addressLine1: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94103',
    })

    expect(first.success).toBe(true)
    expect(first.customerId).toBe(customerId)
    expect(first.isReturning).toBe(true)

    // Second call: lookup returns existing customer
    supabaseServer.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockResolvedValue({
        data: { id: customerId },
        error: null,
      }),
    })

    // Second call: update existing customer with new info
    supabaseServer.from.mockReturnValueOnce({
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({
        error: null,
      }),
    })

    const second = await lookupOrCreateCustomer({
      email,
      firstName: 'Johnny',
      lastName: 'Doe',
      phone: '555-2222',
      addressLine1: '789 Elm St',
      city: 'Oakland',
      state: 'CA',
      zipCode: '94607',
    })

    expect(second.success).toBe(true)
    expect(second.customerId).toBe(customerId)
    expect(second.isReturning).toBe(true)
  })
})
