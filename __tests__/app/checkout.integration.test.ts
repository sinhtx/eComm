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
import { CartItem } from '@/lib/types'

describe('Checkout Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  describe('Zelle Payment Flow', () => {
    it('should complete full Zelle checkout: customer lookup -> order creation', async () => {
      const email = `zelle-test-${Date.now()}@example.com`
      const newCustomerId = `cust-zelle-${Date.now()}`

      // Step 1: Lookup/create customer - mock lookup returns null (new customer)
      supabaseServer.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      })

      // Step 1: Mock insert new customer
      supabaseServer.from.mockReturnValueOnce({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { id: newCustomerId },
          error: null,
        }),
      })

      const customerResult = await lookupOrCreateCustomer({
        email,
        firstName: 'Alice',
        lastName: 'Zelle',
        phone: '555-0001',
        addressLine1: '123 Zelle St',
        city: 'Portland',
        state: 'OR',
        zipCode: '97201',
      })

      expect(customerResult.success).toBe(true)
      expect(customerResult.customerId).toBe(newCustomerId)
      expect(customerResult.isReturning).toBe(false)

      const customerId = customerResult.customerId!

      // Step 2: Create order with Zelle payment - mock customer lookup
      supabaseServer.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({
          data: { id: customerId },
          error: null,
        }),
      })

      // Step 2: Mock order insert
      const orderId = `order-zelle-${Date.now()}`
      supabaseServer.from.mockReturnValueOnce({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { id: orderId },
          error: null,
        }),
      })

      const cartItems: CartItem[] = [
        {
          id: 'carrie',
          name: 'Carrie',
          type: 'mango',
          quantity: 2,
          pricePerUnit: 12.5,
          total: 25.0,
        },
        {
          id: 'small-mix',
          name: 'Small Mix',
          type: 'mixbox',
          quantity: 1,
          pricePerUnit: 45.0,
          total: 45.0,
        },
      ]

      const orderResult = await createOrder({
        customerId,
        items: cartItems,
        totalPrice: 70.0,
        paymentMethod: 'zelle',
      })

      expect(orderResult.success).toBe(true)
      expect(orderResult.orderId).toBe(orderId)
    })

    it('should return to previous customer for repeat order', async () => {
      const email = `repeat-customer-${Date.now()}@example.com`
      const customerId = `cust-repeat-${Date.now()}`

      // First order - lookup returns null (new customer)
      supabaseServer.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      })

      // First order - insert new customer
      supabaseServer.from.mockReturnValueOnce({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { id: customerId },
          error: null,
        }),
      })

      const first = await lookupOrCreateCustomer({
        email,
        firstName: 'Bob',
        lastName: 'Repeat',
        phone: '555-0002',
        addressLine1: '456 Repeat Ave',
        city: 'Seattle',
        state: 'WA',
        zipCode: '98101',
      })

      expect(first.success).toBe(true)
      expect(first.isReturning).toBe(false)
      expect(first.customerId).toBe(customerId)

      // Second order - lookup returns existing customer
      supabaseServer.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({
          data: { id: customerId },
          error: null,
        }),
      })

      // Second order - update existing customer
      supabaseServer.from.mockReturnValueOnce({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          error: null,
        }),
      })

      const second = await lookupOrCreateCustomer({
        email,
        firstName: 'Bob',
        lastName: 'Repeat',
        phone: '555-0003', // Updated phone
        addressLine1: '789 New St',
        city: 'Tacoma',
        state: 'WA',
        zipCode: '98402',
      })

      expect(second.success).toBe(true)
      expect(second.isReturning).toBe(true)
      expect(second.customerId).toBe(customerId)
    })
  })

  describe('Stripe Payment Flow', () => {
    it('should create order and payment intent for Stripe payment', async () => {
      const email = `stripe-test-${Date.now()}@example.com`
      const customerId = `cust-stripe-${Date.now()}`
      const orderId = `order-stripe-${Date.now()}`
      const paymentIntentId = `pi_test_${Date.now()}`
      const clientSecret = `${paymentIntentId}_secret_abc`

      // Create customer - lookup returns null
      supabaseServer.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      })

      // Create customer - insert new customer
      supabaseServer.from.mockReturnValueOnce({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { id: customerId },
          error: null,
        }),
      })

      const customerResult = await lookupOrCreateCustomer({
        email,
        firstName: 'Charlie',
        lastName: 'Stripe',
        phone: '555-0004',
        addressLine1: '111 Card Lane',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94103',
      })

      expect(customerResult.success).toBe(true)
      expect(customerResult.customerId).toBe(customerId)

      // Create order - customer lookup
      supabaseServer.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({
          data: { id: customerId },
          error: null,
        }),
      })

      // Create order - insert order
      supabaseServer.from.mockReturnValueOnce({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { id: orderId },
          error: null,
        }),
      })

      const orderResult = await createOrder({
        customerId,
        items: [
          {
            id: 'alphonso',
            name: 'Alphonso',
            type: 'mango',
            quantity: 3,
            pricePerUnit: 15.0,
            total: 45.0,
          },
        ],
        totalPrice: 45.0,
        paymentMethod: 'stripe',
      })

      expect(orderResult.success).toBe(true)
      expect(orderResult.orderId).toBe(orderId)

      // Create payment intent - order lookup
      supabaseServer.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({
          data: { id: orderId },
          error: null,
        }),
      })

      // Create payment intent - Stripe API call
      stripe.paymentIntents.create.mockResolvedValue({
        id: paymentIntentId,
        client_secret: clientSecret,
        amount: 4500,
        currency: 'usd',
        capture_method: 'manual',
        status: 'requires_payment_method',
      })

      // Create payment intent - update order with payment intent ID
      supabaseServer.from.mockReturnValueOnce({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          error: null,
        }),
      })

      const piResult = await createPaymentIntent({
        orderId,
        amount: 4500, // $45.00 in cents
        customerEmail: email,
      })

      expect(piResult.success).toBe(true)
      expect(piResult.paymentIntentId).toBe(paymentIntentId)
      expect(piResult.clientSecret).toBe(clientSecret)
    })

    it('should fail to create payment intent if order does not exist', async () => {
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
        amount: 5000,
        customerEmail: 'test@example.com',
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('not found')
    })
  })

  describe('Error Handling', () => {
    it('should handle invalid email during customer lookup', async () => {
      const result = await lookupOrCreateCustomer({
        email: 'not-an-email',
        firstName: 'Dave',
        lastName: 'Invalid',
        phone: '555-0005',
        addressLine1: '222 Error St',
        city: 'Boston',
        state: 'MA',
        zipCode: '02101',
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('email')
    })

    it('should fail to create order if customer does not exist', async () => {
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
        customerId: 'fake-customer-id-12345',
        items: [
          {
            id: 'test',
            name: 'Test',
            type: 'mango',
            quantity: 1,
            pricePerUnit: 10,
            total: 10,
          },
        ],
        totalPrice: 10,
        paymentMethod: 'zelle',
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('not found')
    })

    it('should fail to create order with empty cart', async () => {
      const customerResult = await lookupOrCreateCustomer({
        email: `empty-${Date.now()}@example.com`,
        firstName: 'Eve',
        lastName: 'Empty',
        phone: '555-0006',
        addressLine1: '333 Blank St',
        city: 'Denver',
        state: 'CO',
        zipCode: '80202',
      })

      const result = await createOrder({
        customerId: customerResult.customerId!,
        items: [],
        totalPrice: 0,
        paymentMethod: 'zelle',
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('empty')
    })
  })
})
