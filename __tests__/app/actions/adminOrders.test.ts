import { getPendingOrders, approveOrder, rejectOrder } from '@/app/actions/adminOrders'

// Mock Supabase
jest.mock('@/lib/auth/supabaseClient', () => ({
  supabaseServer: {
    from: jest.fn(),
  },
}))

// Mock Stripe
jest.mock('@/lib/stripe/server', () => ({
  stripe: {
    paymentIntents: {
      capture: jest.fn(),
    },
  },
}))

// Mock email service
jest.mock('@/lib/email/service', () => ({
  sendApprovalEmail: jest.fn(),
}))

describe('Admin Orders Server Actions (Part 4 - Admin Dashboard)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getPendingOrders', () => {
    it('should fetch pending orders with customer details', async () => {
      const mockOrders = [
        {
          id: 'order-1',
          order_status: 'pending_approval',
          total_price: 100,
          customer: { email: 'test@example.com', first_name: 'John' },
        },
      ]

      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { supabaseServer } = require('@/lib/auth/supabaseClient')
      supabaseServer.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: mockOrders, error: null }),
      })

      const { data, error } = await getPendingOrders()

      expect(error).toBeNull()
      expect(data).toEqual(mockOrders)
    })

    it('should handle errors gracefully', async () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { supabaseServer } = require('@/lib/auth/supabaseClient')
      const mockError = new Error('Database error')

      supabaseServer.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: null, error: mockError }),
      })

      const { data, error } = await getPendingOrders()

      expect(error).toBeTruthy()
      expect(data).toEqual([])
    })
  })

  describe('approveOrder', () => {
    it('should approve an order and create audit log', async () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { supabaseServer } = require('@/lib/auth/supabaseClient')
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { sendApprovalEmail } = require('@/lib/email/service')

      // Mock get order
      supabaseServer.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: {
            order_status: 'pending_approval',
            stripe_payment_intent_id: null,
            customer: { email: 'test@example.com' },
          },
          error: null,
        }),
      })

      // Mock update order
      supabaseServer.from.mockReturnValueOnce({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ error: null }),
      })

      // Mock insert audit log
      supabaseServer.from.mockReturnValueOnce({
        insert: jest.fn().mockResolvedValue({ error: null }),
      })

      sendApprovalEmail.mockResolvedValue({ success: true })

      const { success, error } = await approveOrder('order-1', 'Approved')

      expect(error).toBeNull()
      expect(success).toBe(true)
    })

    it('should return error if order is not pending', async () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { supabaseServer } = require('@/lib/auth/supabaseClient')

      supabaseServer.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { order_status: 'approved' },
          error: null,
        }),
      })

      const { success, error } = await approveOrder('order-1')

      expect(success).toBe(false)
      expect(error).toContain('Cannot approve order')
    })

    it('should capture Stripe payment when approving order', async () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { supabaseServer } = require('@/lib/auth/supabaseClient')
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { stripe } = require('@/lib/stripe/server')

      // Mock get order with Stripe payment intent
      supabaseServer.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: {
            order_status: 'pending_approval',
            stripe_payment_intent_id: 'pi_test123',
            customer_id: 'cust-1',
            items: [],
            total_price: 100,
            customer: { email: 'test@example.com' },
          },
          error: null,
        }),
      })

      // Mock Stripe capture
      stripe.paymentIntents.capture.mockResolvedValue({ id: 'pi_test123', status: 'succeeded' })

      // Mock update order
      supabaseServer.from.mockReturnValueOnce({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ error: null }),
      })

      // Mock insert audit log
      supabaseServer.from.mockReturnValueOnce({
        insert: jest.fn().mockResolvedValue({ error: null }),
      })

      // Mock send email
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { sendApprovalEmail } = require('@/lib/email/service')
      sendApprovalEmail.mockResolvedValue({ success: true })

      const { success, error } = await approveOrder('order-1')

      expect(success).toBe(true)
      expect(error).toBeNull()
      expect(stripe.paymentIntents.capture).toHaveBeenCalledWith('pi_test123')
    })

    it('should update order status to approved after successful Stripe capture', async () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { supabaseServer } = require('@/lib/auth/supabaseClient')
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { stripe } = require('@/lib/stripe/server')

      // Mock get order
      supabaseServer.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: {
            order_status: 'pending_approval',
            stripe_payment_intent_id: 'pi_test123',
            customer_id: 'cust-1',
            items: [],
            total_price: 100,
            customer: { email: 'test@example.com' },
          },
          error: null,
        }),
      })

      // Mock Stripe capture
      stripe.paymentIntents.capture.mockResolvedValue({ id: 'pi_test123', status: 'succeeded' })

      // Mock update order
      const updateMock = jest.fn().mockReturnThis()
      const eqMock = jest.fn().mockResolvedValue({ error: null })
      supabaseServer.from.mockReturnValueOnce({
        update: updateMock,
        eq: eqMock,
      })

      // Mock insert audit log
      supabaseServer.from.mockReturnValueOnce({
        insert: jest.fn().mockResolvedValue({ error: null }),
      })

      // Mock send email
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { sendApprovalEmail } = require('@/lib/email/service')
      sendApprovalEmail.mockResolvedValue({ success: true })

      await approveOrder('order-1')

      expect(updateMock).toHaveBeenCalledWith(
        expect.objectContaining({
          order_status: 'approved',
        })
      )
    })

    it('should send approval email after order status update', async () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { supabaseServer } = require('@/lib/auth/supabaseClient')
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { stripe } = require('@/lib/stripe/server')
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { sendApprovalEmail } = require('@/lib/email/service')

      // Mock get order
      supabaseServer.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: {
            order_status: 'pending_approval',
            stripe_payment_intent_id: 'pi_test123',
            customer_id: 'cust-1',
            items: [{ name: 'Mango', quantity: 1, price: 50, total: 50 }],
            total_price: 100,
            customer: { email: 'customer@example.com' },
          },
          error: null,
        }),
      })

      // Mock Stripe capture
      stripe.paymentIntents.capture.mockResolvedValue({ id: 'pi_test123', status: 'succeeded' })

      // Mock update order
      supabaseServer.from.mockReturnValueOnce({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ error: null }),
      })

      // Mock insert audit log
      supabaseServer.from.mockReturnValueOnce({
        insert: jest.fn().mockResolvedValue({ error: null }),
      })

      sendApprovalEmail.mockResolvedValue({ success: true })

      await approveOrder('order-1')

      expect(sendApprovalEmail).toHaveBeenCalledWith(
        'customer@example.com',
        expect.any(String),
        expect.objectContaining({
          customer_id: 'cust-1',
        })
      )
    })

    it('should return error if Stripe capture fails', async () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { supabaseServer } = require('@/lib/auth/supabaseClient')
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { stripe } = require('@/lib/stripe/server')

      // Mock get order
      supabaseServer.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: {
            order_status: 'pending_approval',
            stripe_payment_intent_id: 'pi_test123',
            customer_id: 'cust-1',
            items: [],
            total_price: 100,
            customer: { email: 'test@example.com' },
          },
          error: null,
        }),
      })

      // Mock Stripe capture failure
      stripe.paymentIntents.capture.mockRejectedValue(new Error('Card declined'))

      const { success, error } = await approveOrder('order-1')

      expect(success).toBe(false)
      expect(error).toContain('Failed to capture payment')
    })
  })

  describe('rejectOrder', () => {
    it('should reject an order and create audit log', async () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { supabaseServer } = require('@/lib/auth/supabaseClient')

      // Mock get order
      supabaseServer.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: { order_status: 'pending_approval' },
          error: null,
        }),
      })

      // Mock update order
      supabaseServer.from.mockReturnValueOnce({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ error: null }),
      })

      // Mock insert audit log
      supabaseServer.from.mockReturnValueOnce({
        insert: jest.fn().mockResolvedValue({ error: null }),
      })

      const { success, error } = await rejectOrder('order-1', 'Out of stock')

      expect(error).toBeNull()
      expect(success).toBe(true)
    })
  })
})
