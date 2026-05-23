import { Resend } from 'resend'
import type { OrderWithCustomer, OrderItem, Customer } from '@/app/actions/adminOrders'

const resend = new Resend(process.env.RESEND_API_KEY)
// ADMIN_EMAIL is used as fallback when adminEmail parameter is not provided
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@seasonalfruitfarm.com'

interface EmailResult {
  success: boolean
  error?: string
}

function formatOrderItems(items: OrderItem[]): string {
  return items
    .map((item) => `${item.name} x${item.quantity} @ $${item.price.toFixed(2)} = $${item.total.toFixed(2)}`)
    .join('<br />')
}

function formatAddress(customer: Customer): string {
  return `${customer.first_name} ${customer.last_name}<br />${customer.address_line_1}<br />${customer.city}, ${customer.state} ${customer.zip_code}`
}

export async function sendApprovalEmail(
  customerEmail: string,
  adminEmail: string,
  order: OrderWithCustomer
): Promise<EmailResult> {
  try {
    const itemsHtml = formatOrderItems(order.items)
    const addressHtml = formatAddress(order.customer)

    const emailHtml = `
      <h2>Order Approved!</h2>
      <p>Thank you for your order. We've received your payment and will ship your order within 24 hours.</p>

      <h3>Order Details</h3>
      <p><strong>Order ID:</strong> ${order.id}</p>
      <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleDateString()}</p>

      <h3>Items</h3>
      <p>${itemsHtml}</p>

      <h3>Total</h3>
      <p><strong>$${order.total_price.toFixed(2)}</strong></p>

      <h3>Shipping Address</h3>
      <p>${addressHtml}</p>

      <p>Questions? Reply to this email.</p>
    `

    const result = await resend.emails.send({
      from: 'orders@seasonalfruitfarm.com',
      to: [customerEmail, adminEmail || ADMIN_EMAIL],
      subject: `Your Seasonal Fruit Farm Order #${order.id} Approved`,
      html: emailHtml,
    })

    if (result.error) {
      console.error('Email send error:', result.error)
      return {
        success: false,
        error: result.error.message || 'Failed to send email',
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Email service error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown email error',
    }
  }
}

export async function sendCancellationEmail(
  customerEmail: string,
  adminEmail: string,
  order: OrderWithCustomer,
  reason: string
): Promise<EmailResult> {
  try {
    const itemsHtml = formatOrderItems(order.items)

    const emailHtml = `
      <h2>Order Cancelled</h2>
      <p>Your order has been cancelled. Your payment hold has been released and will appear back in your account within 3-5 business days.</p>

      <h3>Cancellation Details</h3>
      <p><strong>Order ID:</strong> ${order.id}</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>

      <h3>Items</h3>
      <p>${itemsHtml}</p>

      <h3>Refund Amount</h3>
      <p><strong>$${order.total_price.toFixed(2)}</strong></p>

      <p>Questions? Reply to this email.</p>
    `

    const result = await resend.emails.send({
      from: 'orders@seasonalfruitfarm.com',
      to: [customerEmail, adminEmail || ADMIN_EMAIL],
      subject: `Your Seasonal Fruit Farm Order #${order.id} Cancelled`,
      html: emailHtml,
    })

    if (result.error) {
      console.error('Email send error:', result.error)
      return {
        success: false,
        error: result.error.message || 'Failed to send email',
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Email service error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown email error',
    }
  }
}
