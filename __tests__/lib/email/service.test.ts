import { sendApprovalEmail, sendCancellationEmail } from '@/lib/email/service'
import type { OrderWithCustomer } from '@/app/actions/adminOrders'

let mockSend: jest.Mock

// Mock Resend
jest.mock('resend', () => ({
  Resend: jest.fn(() => ({
    emails: {
      send: jest.fn((args) => mockSend(args)),
    },
  })),
}))

describe('Email Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockSend = jest.fn().mockResolvedValue({ error: null })
  })

  describe('sendApprovalEmail', () => {
    it('should send approval email with correct subject and content', async () => {
      const mockOrder: OrderWithCustomer = {
        id: 'order-1',
        customer_id: 'cust-1',
        order_status: 'approved',
        items: [
          {
            name: 'Carrie',
            id: 'carrie',
            quantity: 2,
            price: 12.5,
            total: 25.0,
          },
        ],
        total_price: 25.0,
        created_at: '2026-05-23T00:00:00Z',
        updated_at: '2026-05-23T00:00:00Z',
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

      const result = await sendApprovalEmail('customer@example.com', 'admin@example.com', mockOrder)

      expect(result.success).toBe(true)
    })

    it('should return error if email sending fails', async () => {
      const mockOrder: OrderWithCustomer = {
        id: 'order-1',
        customer_id: 'cust-1',
        order_status: 'approved',
        items: [],
        total_price: 0,
        created_at: '2026-05-23T00:00:00Z',
        updated_at: '2026-05-23T00:00:00Z',
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

      // Mock Resend failure
      mockSend.mockResolvedValue({ error: new Error('Send failed') })

      const result = await sendApprovalEmail('customer@example.com', 'admin@example.com', mockOrder)

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('sendCancellationEmail', () => {
    it('should send cancellation email with reason', async () => {
      const mockOrder: OrderWithCustomer = {
        id: 'order-1',
        customer_id: 'cust-1',
        order_status: 'cancelled',
        items: [
          {
            name: 'Alphonso',
            id: 'alphonso',
            quantity: 3,
            price: 15.0,
            total: 45.0,
          },
        ],
        total_price: 45.0,
        created_at: '2026-05-23T00:00:00Z',
        updated_at: '2026-05-23T00:00:00Z',
        customer: {
          email: 'customer@example.com',
          first_name: 'Jane',
          last_name: 'Smith',
          phone: '555-5678',
          address_line_1: '456 Oak Ave',
          city: 'Seattle',
          state: 'WA',
          zip_code: '98101',
          country_code: 'US',
        },
      }

      const result = await sendCancellationEmail('customer@example.com', 'admin@example.com', mockOrder, 'Out of stock')

      expect(result.success).toBe(true)
    })
  })
})
