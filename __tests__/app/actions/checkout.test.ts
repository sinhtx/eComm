// Mock Supabase before importing the server action
jest.mock('@/lib/auth/supabaseClient', () => ({
  supabaseServer: {
    from: jest.fn(),
  },
}))

// Mock Stripe before importing the server action
jest.mock('@/lib/stripe/server', () => ({
  stripe: {
    paymentIntents: {
      create: jest.fn(),
    },
  },
}))

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { supabaseServer } = require('@/lib/auth/supabaseClient')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { stripe } = require('@/lib/stripe/server')
import { lookupOrCreateCustomer, createOrder, createPaymentIntent } from '@/app/actions/checkout'

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

describe('createOrder', () => {
  it('should create order with valid customer and items', async () => {
    const customerId = 'cust-order-test-123'

    // Mock: customer lookup returns existing customer
    supabaseServer.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockResolvedValue({
        data: { id: customerId },
        error: null,
      }),
    })

    // Mock: order insert
    supabaseServer.from.mockReturnValueOnce({
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { id: 'order-123' },
        error: null,
      }),
    })

    const result = await createOrder({
      customerId,
      items: [
        {
          id: 'carrie',
          name: 'Carrie',
          type: 'mango',
          quantity: 2,
          pricePerUnit: 12.5,
          total: 25.0,
        },
      ],
      totalPrice: 25.0,
      paymentMethod: 'zelle',
    })

    expect(result.success).toBe(true)
    expect(result.orderId).toBe('order-123')
  })

  it('should fail if customer ID is invalid', async () => {
    // Mock: customer lookup returns no customer
    supabaseServer.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockResolvedValue({
        data: null,
        error: null,
      }),
    })

    const result = await createOrder({
      customerId: 'invalid-uuid-12345',
      items: [
        {
          id: 'carrie',
          name: 'Carrie',
          type: 'mango',
          quantity: 1,
          pricePerUnit: 12.5,
          total: 12.5,
        },
      ],
      totalPrice: 12.5,
      paymentMethod: 'zelle',
    })

    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
  })

  it('should fail if cart is empty', async () => {
    const customerId = 'cust-empty-test-123'

    const result = await createOrder({
      customerId,
      items: [],
      totalPrice: 0,
      paymentMethod: 'zelle',
    })

    expect(result.success).toBe(false)
    expect(result.error).toContain('empty')
  })
})

describe('createPaymentIntent', () => {
  it('should create Stripe payment intent with manual capture mode', async () => {
    const orderId = 'test-order-id-123'
    const amount = 4500
    const customerEmail = 'stripe-test@example.com'
    const paymentIntentId = 'pi_test_123'
    const clientSecret = 'pi_test_123_secret_abc'

    // Mock: order lookup returns existing order
    supabaseServer.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockResolvedValue({
        data: { id: orderId },
        error: null,
      }),
    })

    // Mock: Stripe payment intent creation
    stripe.paymentIntents.create.mockResolvedValue({
      id: paymentIntentId,
      client_secret: clientSecret,
      amount,
      currency: 'usd',
      capture_method: 'manual',
      status: 'requires_payment_method',
    })

    // Mock: order update with payment intent ID
    supabaseServer.from.mockReturnValueOnce({
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({
        error: null,
      }),
    })

    const result = await createPaymentIntent({
      orderId,
      amount,
      customerEmail,
    })

    expect(result.success).toBe(true)
    expect(result.clientSecret).toBe(clientSecret)
    expect(result.paymentIntentId).toBe(paymentIntentId)
  })

  it('should fail if amount is not greater than 0', async () => {
    const result = await createPaymentIntent({
      orderId: 'test-order-id-123',
      amount: 0,
      customerEmail: 'test@example.com',
    })

    expect(result.success).toBe(false)
    expect(result.error).toContain('greater than 0')
  })

  it('should fail if order does not exist', async () => {
    // Mock: order lookup returns no order
    supabaseServer.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockResolvedValue({
        data: null,
        error: null,
      }),
    })

    const result = await createPaymentIntent({
      orderId: 'nonexistent-order-id',
      amount: 4500,
      customerEmail: 'test@example.com',
    })

    expect(result.success).toBe(false)
    expect(result.error).toContain('not found')
  })
})
