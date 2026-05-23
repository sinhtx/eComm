'use server'

import { supabaseServer } from '@/lib/auth/supabaseClient'
import { stripe } from '@/lib/stripe/server'
import { sendApprovalEmail } from '@/lib/email/service'

export interface OrderItem {
  name?: string
  id?: string
  quantity?: number
  price?: number
  total?: number
}

export interface Customer {
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  address_line_1?: string
  address_line_2?: string
  city?: string
  state?: string
  zip_code?: string
  country_code?: string
}

export interface OrderWithCustomer {
  id: string
  customer_id: string
  order_status: string
  items: OrderItem[]
  total_price: number
  created_at: string
  updated_at: string
  stripe_payment_intent_id?: string
  stripe_charge_id?: string
  notes?: string
  customer: Customer
}

export interface AuditLogEntry {
  id: string
  order_id: string
  previous_status?: string
  new_status: string
  changed_by?: string
  reason?: string
  created_at: string
}

// Get all pending orders with customer details
export async function getPendingOrders(): Promise<{
  data: OrderWithCustomer[]
  error: string | null
}> {
  try {
    const { data, error } = await supabaseServer
      .from('fruit_orders')
      .select(
        `
        id,
        customer_id,
        order_status,
        items,
        total_price,
        created_at,
        updated_at,
        stripe_payment_intent_id,
        stripe_charge_id,
        notes,
        customer:customers (
          email,
          first_name,
          last_name,
          phone,
          address_line_1,
          address_line_2,
          city,
          state,
          zip_code,
          country_code
        )
      `
      )
      .eq('order_status', 'pending_approval')
      .order('created_at', { ascending: false })

    if (error) throw error

    return {
      data: (data as unknown as OrderWithCustomer[]) || [],
      error: null,
    }
  } catch (error) {
    console.error('Failed to fetch pending orders:', error)
    return {
      data: [],
      error: error instanceof Error ? error.message : 'Failed to fetch orders',
    }
  }
}

// Get order details with audit log
export async function getOrderDetails(orderId: string): Promise<{
  data: { order: OrderWithCustomer; auditLog: AuditLogEntry[] } | null
  error: string | null
}> {
  try {
    const { data: order, error: orderError } = await supabaseServer
      .from('fruit_orders')
      .select(
        `
        *,
        customer:customers (*)
      `
      )
      .eq('id', orderId)
      .single()

    if (orderError) throw orderError

    const { data: auditLog, error: auditError } = await supabaseServer
      .from('order_audit_log')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: true })

    if (auditError) throw auditError

    return {
      data: {
        order: order as unknown as OrderWithCustomer,
        auditLog: (auditLog as unknown as AuditLogEntry[]) || [],
      },
      error: null,
    }
  } catch (error) {
    console.error('Failed to fetch order details:', error)
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch order details',
    }
  }
}

// Approve an order
export async function approveOrder(
  orderId: string,
  notes?: string
): Promise<{
  success: boolean
  error: string | null
}> {
  try {
    // Get order first to fetch Stripe payment intent ID
    const { data: order, error: getError } = await supabaseServer
      .from('fruit_orders')
      .select(
        `
        order_status,
        stripe_payment_intent_id,
        customer_id,
        items,
        total_price,
        created_at,
        customer:customers (
          email,
          first_name,
          last_name,
          phone,
          address_line_1,
          address_line_2,
          city,
          state,
          zip_code,
          country_code
        )
      `
      )
      .eq('id', orderId)
      .single()

    if (getError) throw getError
    if (!order) {
      return {
        success: false,
        error: 'Order not found',
      }
    }

    if (order.order_status !== 'pending_approval') {
      return {
        success: false,
        error: `Cannot approve order with status: ${order.order_status}`,
      }
    }

    // Capture Stripe payment if payment intent exists
    if (order.stripe_payment_intent_id) {
      try {
        const captureResult = await stripe.paymentIntents.capture(order.stripe_payment_intent_id)
        if (captureResult.status !== 'succeeded') {
          return {
            success: false,
            error: `Stripe capture failed with status: ${captureResult.status}`,
          }
        }
      } catch (stripeError) {
        const errorMessage = stripeError instanceof Error ? stripeError.message : 'Stripe capture failed'
        return {
          success: false,
          error: `Failed to capture payment: ${errorMessage}`,
        }
      }
    }

    // Update order status
    const { error: updateError } = await supabaseServer
      .from('fruit_orders')
      .update({
        order_status: 'approved',
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)

    if (updateError) throw updateError

    // Log audit entry
    const { error: auditError } = await supabaseServer.from('order_audit_log').insert({
      order_id: orderId,
      previous_status: 'pending_approval',
      new_status: 'approved',
      changed_by: 'admin',
      reason: notes || 'Approved by admin',
    })

    if (auditError) throw auditError

    // Send approval email (non-blocking - failures logged but don't fail the operation)
    if (order.customer) {
      const emailResult = await sendApprovalEmail(
        order.customer.email,
        process.env.ADMIN_EMAIL || 'admin@seasonalfruitfarm.com',
        order as OrderWithCustomer
      )
      if (!emailResult.success) {
        console.warn(`Email failed for order ${orderId}: ${emailResult.error}`)
        // Don't return error - order is already approved
      }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error('Failed to approve order:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to approve order',
    }
  }
}

// Reject an order
export async function rejectOrder(
  orderId: string,
  reason: string
): Promise<{
  success: boolean
  error: string | null
}> {
  try {
    // Get order
    const { data: order, error: getError } = await supabaseServer
      .from('fruit_orders')
      .select('order_status')
      .eq('id', orderId)
      .single()

    if (getError) throw getError
    if (order.order_status !== 'pending_approval') {
      throw new Error(`Cannot reject order with status: ${order.order_status}`)
    }

    // Update order status
    const { error: updateError } = await supabaseServer
      .from('fruit_orders')
      .update({
        order_status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)

    if (updateError) throw updateError

    // Log audit entry
    const { error: auditError } = await supabaseServer.from('order_audit_log').insert({
      order_id: orderId,
      previous_status: 'pending_approval',
      new_status: 'cancelled',
      changed_by: 'admin',
      reason: reason || 'Rejected by admin',
    })

    if (auditError) throw auditError

    return { success: true, error: null }
  } catch (error) {
    console.error('Failed to reject order:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reject order',
    }
  }
}
