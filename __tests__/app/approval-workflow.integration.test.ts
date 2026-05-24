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
      capture: jest.fn(),
      cancel: jest.fn(),
    },
  },
}))

// Mock Email Service before importing the server action
jest.mock('@/lib/email/service', () => ({
  sendApprovalEmail: jest.fn(),
  sendCancellationEmail: jest.fn(),
}))

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { supabaseServer } = require('@/lib/auth/supabaseClient')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { stripe } = require('@/lib/stripe/server')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { sendApprovalEmail, sendCancellationEmail } = require('@/lib/email/service')

import { approveOrder, rejectOrder } from '@/app/actions/adminOrders'

describe('Order Approval Workflow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Approval Flow', () => {
    it('should complete full approval flow: capture -> update status -> send email', async () => {
      const orderId = `order-${Date.now()}`
      const stripePaymentIntentId = `pi_test_${Date.now()}`

      const mockOrder = {
        order_status: 'pending_approval',
        stripe_payment_intent_id: stripePaymentIntentId,
        customer_id: 'cust-123',
        items: [
          { name: 'Carrie', quantity: 2, price: 12.5, total: 25.0 },
          { name: 'Alphonso', quantity: 1, price: 15.0, total: 15.0 },
        ],
        total_price: 40.0,
        created_at: new Date().toISOString(),
        customer: {
          email: 'customer@example.com',
          first_name: 'John',
          last_name: 'Doe',
          phone: '555-1234',
          address_line_1: '123 Main St',
          city: 'Portland',
          state: 'OR',
          zip_code: '97201',
          country_code: 'US',
        },
      }

      // Step 1: Mock fetch order
      supabaseServer.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockOrder,
          error: null,
        }),
      })

      // Step 2: Mock Stripe capture success
      stripe.paymentIntents.capture.mockResolvedValueOnce({
        id: stripePaymentIntentId,
        status: 'succeeded',
      })

      // Step 3: Mock order status update
      supabaseServer.from.mockReturnValueOnce({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          error: null,
        }),
      })

      // Step 4: Mock audit log insert
      supabaseServer.from.mockReturnValueOnce({
        insert: jest.fn().mockResolvedValue({
          error: null,
        }),
      })

      // Step 5: Mock email send
      sendApprovalEmail.mockResolvedValueOnce({ success: true })

      const result = await approveOrder(orderId)

      expect(result.success).toBe(true)
      expect(result.error).toBeNull()
      expect(stripe.paymentIntents.capture).toHaveBeenCalledWith(stripePaymentIntentId)
      expect(sendApprovalEmail).toHaveBeenCalled()
    })

    it('should return error if Stripe capture fails', async () => {
      const orderId = `order-${Date.now()}`
      const stripePaymentIntentId = `pi_test_${Date.now()}`

      const mockOrder = {
        order_status: 'pending_approval',
        stripe_payment_intent_id: stripePaymentIntentId,
        customer_id: 'cust-123',
        items: [{ name: 'Carrie', quantity: 2, price: 12.5, total: 25.0 }],
        total_price: 25.0,
        created_at: new Date().toISOString(),
        customer: {
          email: 'customer@example.com',
          first_name: 'John',
          last_name: 'Doe',
          phone: '555-1234',
          address_line_1: '123 Main St',
          city: 'Portland',
          state: 'OR',
          zip_code: '97201',
          country_code: 'US',
        },
      }

      // Mock fetch order
      supabaseServer.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockOrder,
          error: null,
        }),
      })

      // Mock Stripe capture failure
      stripe.paymentIntents.capture.mockRejectedValueOnce(new Error('Card declined'))

      const result = await approveOrder(orderId)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Failed to capture payment')
      expect(result.error).toContain('Card declined')
      // Email should not be sent if capture fails
      expect(sendApprovalEmail).not.toHaveBeenCalled()
    })

    it('should send email successfully after approval', async () => {
      const orderId = `order-${Date.now()}`
      const stripePaymentIntentId = `pi_test_${Date.now()}`

      const mockOrder = {
        order_status: 'pending_approval',
        stripe_payment_intent_id: stripePaymentIntentId,
        customer_id: 'cust-123',
        items: [{ name: 'Carrie', quantity: 2, price: 12.5, total: 25.0 }],
        total_price: 25.0,
        created_at: new Date().toISOString(),
        customer: {
          email: 'customer@example.com',
          first_name: 'John',
          last_name: 'Doe',
          phone: '555-1234',
          address_line_1: '123 Main St',
          city: 'Portland',
          state: 'OR',
          zip_code: '97201',
          country_code: 'US',
        },
      }

      // Mock fetch order
      supabaseServer.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockOrder,
          error: null,
        }),
      })

      // Mock Stripe capture
      stripe.paymentIntents.capture.mockResolvedValueOnce({
        id: stripePaymentIntentId,
        status: 'succeeded',
      })

      // Mock order status update
      supabaseServer.from.mockReturnValueOnce({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          error: null,
        }),
      })

      // Mock audit log insert
      supabaseServer.from.mockReturnValueOnce({
        insert: jest.fn().mockResolvedValue({
          error: null,
        }),
      })

      // Mock email send
      sendApprovalEmail.mockResolvedValueOnce({ success: true })

      await approveOrder(orderId)

      expect(sendApprovalEmail).toHaveBeenCalledWith(
        'customer@example.com',
        expect.stringContaining('admin'),
        expect.objectContaining({
          customer: mockOrder.customer,
          items: mockOrder.items,
        })
      )
    })

    it('should reject approval if order is not in pending_approval status', async () => {
      const orderId = `order-${Date.now()}`

      const mockOrder = {
        order_status: 'already_approved',
        stripe_payment_intent_id: 'pi_test_123',
        customer_id: 'cust-123',
        items: [],
        total_price: 0,
        created_at: new Date().toISOString(),
        customer: {
          email: 'customer@example.com',
          first_name: 'John',
          last_name: 'Doe',
          phone: '555-1234',
          address_line_1: '123 Main St',
          city: 'Portland',
          state: 'OR',
          zip_code: '97201',
          country_code: 'US',
        },
      }

      // Mock fetch order
      supabaseServer.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockOrder,
          error: null,
        }),
      })

      const result = await approveOrder(orderId)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Cannot approve order')
      expect(stripe.paymentIntents.capture).not.toHaveBeenCalled()
    })

    it('should approve order without Stripe payment if no payment intent', async () => {
      const orderId = `order-${Date.now()}`

      const mockOrder = {
        order_status: 'pending_approval',
        stripe_payment_intent_id: null,
        customer_id: 'cust-123',
        items: [{ name: 'Carrie', quantity: 2, price: 12.5, total: 25.0 }],
        total_price: 25.0,
        created_at: new Date().toISOString(),
        customer: {
          email: 'customer@example.com',
          first_name: 'John',
          last_name: 'Doe',
          phone: '555-1234',
          address_line_1: '123 Main St',
          city: 'Portland',
          state: 'OR',
          zip_code: '97201',
          country_code: 'US',
        },
      }

      // Mock fetch order
      supabaseServer.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockOrder,
          error: null,
        }),
      })

      // Mock order status update (no Stripe call since no payment intent)
      supabaseServer.from.mockReturnValueOnce({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          error: null,
        }),
      })

      // Mock audit log insert
      supabaseServer.from.mockReturnValueOnce({
        insert: jest.fn().mockResolvedValue({
          error: null,
        }),
      })

      // Mock email send
      sendApprovalEmail.mockResolvedValueOnce({ success: true })

      const result = await approveOrder(orderId)

      expect(result.success).toBe(true)
      expect(stripe.paymentIntents.capture).not.toHaveBeenCalled()
    })
  })

  describe('Cancellation Flow', () => {
    it('should complete full cancellation flow: release -> update status -> send email', async () => {
      const orderId = `order-${Date.now()}`
      const stripePaymentIntentId = `pi_test_${Date.now()}`
      const cancelReason = 'Out of stock'

      const mockOrder = {
        order_status: 'pending_approval',
        stripe_payment_intent_id: stripePaymentIntentId,
        customer_id: 'cust-123',
        items: [{ name: 'Carrie', quantity: 2, price: 12.5, total: 25.0 }],
        total_price: 25.0,
        created_at: new Date().toISOString(),
        customer: {
          email: 'customer@example.com',
          first_name: 'John',
          last_name: 'Doe',
          phone: '555-1234',
          address_line_1: '123 Main St',
          city: 'Portland',
          state: 'OR',
          zip_code: '97201',
          country_code: 'US',
        },
      }

      // Step 1: Mock fetch order
      supabaseServer.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockOrder,
          error: null,
        }),
      })

      // Step 2: Mock Stripe cancel success
      stripe.paymentIntents.cancel.mockResolvedValueOnce({
        id: stripePaymentIntentId,
        status: 'canceled',
      })

      // Step 3: Mock order status update
      supabaseServer.from.mockReturnValueOnce({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          error: null,
        }),
      })

      // Step 4: Mock audit log insert
      supabaseServer.from.mockReturnValueOnce({
        insert: jest.fn().mockResolvedValue({
          error: null,
        }),
      })

      // Step 5: Mock email send
      sendCancellationEmail.mockResolvedValueOnce({ success: true })

      const result = await rejectOrder(orderId, cancelReason)

      expect(result.success).toBe(true)
      expect(result.error).toBeNull()
      expect(stripe.paymentIntents.cancel).toHaveBeenCalledWith(stripePaymentIntentId)
      expect(sendCancellationEmail).toHaveBeenCalledWith(
        'customer@example.com',
        expect.stringContaining('admin'),
        expect.any(Object),
        cancelReason
      )
    })

    it('should return error if Stripe cancel fails', async () => {
      const orderId = `order-${Date.now()}`
      const stripePaymentIntentId = `pi_test_${Date.now()}`

      const mockOrder = {
        order_status: 'pending_approval',
        stripe_payment_intent_id: stripePaymentIntentId,
        customer_id: 'cust-123',
        items: [{ name: 'Carrie', quantity: 2, price: 12.5, total: 25.0 }],
        total_price: 25.0,
        created_at: new Date().toISOString(),
        customer: {
          email: 'customer@example.com',
          first_name: 'John',
          last_name: 'Doe',
          phone: '555-1234',
          address_line_1: '123 Main St',
          city: 'Portland',
          state: 'OR',
          zip_code: '97201',
          country_code: 'US',
        },
      }

      // Mock fetch order
      supabaseServer.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockOrder,
          error: null,
        }),
      })

      // Mock Stripe cancel failure
      stripe.paymentIntents.cancel.mockRejectedValueOnce(new Error('Payment already captured'))

      const result = await rejectOrder(orderId, 'Out of stock')

      expect(result.success).toBe(false)
      expect(result.error).toContain('Failed to release payment hold')
      expect(result.error).toContain('Payment already captured')
      // Email should not be sent if cancel fails
      expect(sendCancellationEmail).not.toHaveBeenCalled()
    })

    it('should include rejection reason in email', async () => {
      const orderId = `order-${Date.now()}`
      const stripePaymentIntentId = `pi_test_${Date.now()}`
      const rejectionReason = 'Duplicate order detected'

      const mockOrder = {
        order_status: 'pending_approval',
        stripe_payment_intent_id: stripePaymentIntentId,
        customer_id: 'cust-123',
        items: [{ name: 'Carrie', quantity: 2, price: 12.5, total: 25.0 }],
        total_price: 25.0,
        created_at: new Date().toISOString(),
        customer: {
          email: 'customer@example.com',
          first_name: 'John',
          last_name: 'Doe',
          phone: '555-1234',
          address_line_1: '123 Main St',
          city: 'Portland',
          state: 'OR',
          zip_code: '97201',
          country_code: 'US',
        },
      }

      // Mock fetch order
      supabaseServer.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockOrder,
          error: null,
        }),
      })

      // Mock Stripe cancel
      stripe.paymentIntents.cancel.mockResolvedValueOnce({
        id: stripePaymentIntentId,
        status: 'canceled',
      })

      // Mock order status update
      supabaseServer.from.mockReturnValueOnce({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          error: null,
        }),
      })

      // Mock audit log insert
      supabaseServer.from.mockReturnValueOnce({
        insert: jest.fn().mockResolvedValue({
          error: null,
        }),
      })

      // Mock email send
      sendCancellationEmail.mockResolvedValueOnce({ success: true })

      await rejectOrder(orderId, rejectionReason)

      // Verify rejection reason is passed to email function
      expect(sendCancellationEmail).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.any(Object),
        rejectionReason
      )
    })

    it('should reject cancellation if order is not in pending_approval status', async () => {
      const orderId = `order-${Date.now()}`

      const mockOrder = {
        order_status: 'already_approved',
        stripe_payment_intent_id: 'pi_test_123',
        customer_id: 'cust-123',
        items: [],
        total_price: 0,
        created_at: new Date().toISOString(),
        customer: {
          email: 'customer@example.com',
          first_name: 'John',
          last_name: 'Doe',
          phone: '555-1234',
          address_line_1: '123 Main St',
          city: 'Portland',
          state: 'OR',
          zip_code: '97201',
          country_code: 'US',
        },
      }

      // Mock fetch order
      supabaseServer.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockOrder,
          error: null,
        }),
      })

      const result = await rejectOrder(orderId, 'Out of stock')

      expect(result.success).toBe(false)
      expect(result.error).toContain('Cannot reject order')
      expect(stripe.paymentIntents.cancel).not.toHaveBeenCalled()
    })

    it('should cancel order without Stripe if no payment intent', async () => {
      const orderId = `order-${Date.now()}`
      const reason = 'Out of stock'

      const mockOrder = {
        order_status: 'pending_approval',
        stripe_payment_intent_id: null,
        customer_id: 'cust-123',
        items: [{ name: 'Carrie', quantity: 2, price: 12.5, total: 25.0 }],
        total_price: 25.0,
        created_at: new Date().toISOString(),
        customer: {
          email: 'customer@example.com',
          first_name: 'John',
          last_name: 'Doe',
          phone: '555-1234',
          address_line_1: '123 Main St',
          city: 'Portland',
          state: 'OR',
          zip_code: '97201',
          country_code: 'US',
        },
      }

      // Mock fetch order
      supabaseServer.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockOrder,
          error: null,
        }),
      })

      // Mock order status update (no Stripe call since no payment intent)
      supabaseServer.from.mockReturnValueOnce({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          error: null,
        }),
      })

      // Mock audit log insert
      supabaseServer.from.mockReturnValueOnce({
        insert: jest.fn().mockResolvedValue({
          error: null,
        }),
      })

      // Mock email send
      sendCancellationEmail.mockResolvedValueOnce({ success: true })

      const result = await rejectOrder(orderId, reason)

      expect(result.success).toBe(true)
      expect(stripe.paymentIntents.cancel).not.toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('should block approval if Stripe capture fails', async () => {
      const orderId = `order-${Date.now()}`
      const stripePaymentIntentId = `pi_test_${Date.now()}`

      const mockOrder = {
        order_status: 'pending_approval',
        stripe_payment_intent_id: stripePaymentIntentId,
        customer_id: 'cust-123',
        items: [{ name: 'Carrie', quantity: 2, price: 12.5, total: 25.0 }],
        total_price: 25.0,
        created_at: new Date().toISOString(),
        customer: {
          email: 'customer@example.com',
          first_name: 'John',
          last_name: 'Doe',
          phone: '555-1234',
          address_line_1: '123 Main St',
          city: 'Portland',
          state: 'OR',
          zip_code: '97201',
          country_code: 'US',
        },
      }

      // Mock fetch order
      supabaseServer.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockOrder,
          error: null,
        }),
      })

      // Mock Stripe capture failure
      stripe.paymentIntents.capture.mockRejectedValueOnce(new Error('Insufficient funds'))

      const result = await approveOrder(orderId)

      // Approval should be blocked
      expect(result.success).toBe(false)
      expect(result.error).toBeTruthy()
      // Order status should not be updated
      expect(supabaseServer.from).toHaveBeenCalledTimes(1)
    })

    it('should approve order even if email fails', async () => {
      const orderId = `order-${Date.now()}`
      const stripePaymentIntentId = `pi_test_${Date.now()}`

      const mockOrder = {
        order_status: 'pending_approval',
        stripe_payment_intent_id: stripePaymentIntentId,
        customer_id: 'cust-123',
        items: [{ name: 'Carrie', quantity: 2, price: 12.5, total: 25.0 }],
        total_price: 25.0,
        created_at: new Date().toISOString(),
        customer: {
          email: 'customer@example.com',
          first_name: 'John',
          last_name: 'Doe',
          phone: '555-1234',
          address_line_1: '123 Main St',
          city: 'Portland',
          state: 'OR',
          zip_code: '97201',
          country_code: 'US',
        },
      }

      // Mock fetch order
      supabaseServer.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockOrder,
          error: null,
        }),
      })

      // Mock Stripe capture
      stripe.paymentIntents.capture.mockResolvedValueOnce({
        id: stripePaymentIntentId,
        status: 'succeeded',
      })

      // Mock order status update
      supabaseServer.from.mockReturnValueOnce({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          error: null,
        }),
      })

      // Mock audit log insert
      supabaseServer.from.mockReturnValueOnce({
        insert: jest.fn().mockResolvedValue({
          error: null,
        }),
      })

      // Mock email send failure
      sendApprovalEmail.mockResolvedValueOnce({
        success: false,
        error: 'Email service temporarily unavailable',
      })

      const result = await approveOrder(orderId)

      // Approval should still succeed even though email failed
      expect(result.success).toBe(true)
      expect(result.error).toBeNull()
    })

    it('should cancel order even if email fails', async () => {
      const orderId = `order-${Date.now()}`
      const stripePaymentIntentId = `pi_test_${Date.now()}`

      const mockOrder = {
        order_status: 'pending_approval',
        stripe_payment_intent_id: stripePaymentIntentId,
        customer_id: 'cust-123',
        items: [{ name: 'Carrie', quantity: 2, price: 12.5, total: 25.0 }],
        total_price: 25.0,
        created_at: new Date().toISOString(),
        customer: {
          email: 'customer@example.com',
          first_name: 'John',
          last_name: 'Doe',
          phone: '555-1234',
          address_line_1: '123 Main St',
          city: 'Portland',
          state: 'OR',
          zip_code: '97201',
          country_code: 'US',
        },
      }

      // Mock fetch order
      supabaseServer.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockOrder,
          error: null,
        }),
      })

      // Mock Stripe cancel
      stripe.paymentIntents.cancel.mockResolvedValueOnce({
        id: stripePaymentIntentId,
        status: 'canceled',
      })

      // Mock order status update
      supabaseServer.from.mockReturnValueOnce({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          error: null,
        }),
      })

      // Mock audit log insert
      supabaseServer.from.mockReturnValueOnce({
        insert: jest.fn().mockResolvedValue({
          error: null,
        }),
      })

      // Mock email send failure
      sendCancellationEmail.mockResolvedValueOnce({
        success: false,
        error: 'Email service down',
      })

      const result = await rejectOrder(orderId, 'Out of stock')

      // Rejection should still succeed even though email failed
      expect(result.success).toBe(true)
      expect(result.error).toBeNull()
    })

    it('should handle order not found error', async () => {
      const orderId = 'nonexistent-order'

      // Mock fetch order returns null
      supabaseServer.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      })

      const result = await approveOrder(orderId)

      expect(result.success).toBe(false)
      expect(result.error).toContain('not found')
    })

    it('should handle Supabase database errors', async () => {
      const orderId = `order-${Date.now()}`

      // Mock fetch order with error
      supabaseServer.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database connection failed' },
        }),
      })

      const result = await approveOrder(orderId)

      expect(result.success).toBe(false)
      expect(result.error).toBeTruthy()
    })
  })

  describe('Audit Logging', () => {
    it('should create audit log entry on approval', async () => {
      const orderId = `order-${Date.now()}`
      const stripePaymentIntentId = `pi_test_${Date.now()}`
      const notes = 'Approved after verification'

      const mockOrder = {
        order_status: 'pending_approval',
        stripe_payment_intent_id: stripePaymentIntentId,
        customer_id: 'cust-123',
        items: [{ name: 'Carrie', quantity: 2, price: 12.5, total: 25.0 }],
        total_price: 25.0,
        created_at: new Date().toISOString(),
        customer: {
          email: 'customer@example.com',
          first_name: 'John',
          last_name: 'Doe',
          phone: '555-1234',
          address_line_1: '123 Main St',
          city: 'Portland',
          state: 'OR',
          zip_code: '97201',
          country_code: 'US',
        },
      }

      // Mock fetch order
      supabaseServer.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockOrder,
          error: null,
        }),
      })

      // Mock Stripe capture
      stripe.paymentIntents.capture.mockResolvedValueOnce({
        id: stripePaymentIntentId,
        status: 'succeeded',
      })

      // Mock order status update
      supabaseServer.from.mockReturnValueOnce({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          error: null,
        }),
      })

      // Mock audit log insert
      const auditLogMock = jest.fn().mockResolvedValue({ error: null })
      supabaseServer.from.mockReturnValueOnce({
        insert: auditLogMock,
      })

      // Mock email send
      sendApprovalEmail.mockResolvedValueOnce({ success: true })

      await approveOrder(orderId, notes)

      expect(auditLogMock).toHaveBeenCalledWith(
        expect.objectContaining({
          order_id: orderId,
          previous_status: 'pending_approval',
          new_status: 'approved',
          changed_by: 'admin',
          reason: notes,
        })
      )
    })

    it('should create audit log entry on rejection with reason', async () => {
      const orderId = `order-${Date.now()}`
      const stripePaymentIntentId = `pi_test_${Date.now()}`
      const rejectionReason = 'Customer requested cancellation'

      const mockOrder = {
        order_status: 'pending_approval',
        stripe_payment_intent_id: stripePaymentIntentId,
        customer_id: 'cust-123',
        items: [{ name: 'Carrie', quantity: 2, price: 12.5, total: 25.0 }],
        total_price: 25.0,
        created_at: new Date().toISOString(),
        customer: {
          email: 'customer@example.com',
          first_name: 'John',
          last_name: 'Doe',
          phone: '555-1234',
          address_line_1: '123 Main St',
          city: 'Portland',
          state: 'OR',
          zip_code: '97201',
          country_code: 'US',
        },
      }

      // Mock fetch order
      supabaseServer.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockOrder,
          error: null,
        }),
      })

      // Mock Stripe cancel
      stripe.paymentIntents.cancel.mockResolvedValueOnce({
        id: stripePaymentIntentId,
        status: 'canceled',
      })

      // Mock order status update
      supabaseServer.from.mockReturnValueOnce({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          error: null,
        }),
      })

      // Mock audit log insert
      const auditLogMock = jest.fn().mockResolvedValue({ error: null })
      supabaseServer.from.mockReturnValueOnce({
        insert: auditLogMock,
      })

      // Mock email send
      sendCancellationEmail.mockResolvedValueOnce({ success: true })

      await rejectOrder(orderId, rejectionReason)

      expect(auditLogMock).toHaveBeenCalledWith(
        expect.objectContaining({
          order_id: orderId,
          previous_status: 'pending_approval',
          new_status: 'cancelled',
          changed_by: 'admin',
          reason: rejectionReason,
        })
      )
    })
  })
})
