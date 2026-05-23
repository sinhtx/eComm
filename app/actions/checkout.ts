'use server'

import { supabaseServer } from '@/lib/auth/supabaseClient'
import { CartItem } from '@/lib/types'

// Email validation helper
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export interface LookupOrCreateCustomerInput {
  email: string
  firstName: string
  lastName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  zipCode: string
  countryCode?: string
}

export interface LookupOrCreateCustomerResult {
  success: boolean
  customerId?: string
  isReturning?: boolean
  error?: string
}

export async function lookupOrCreateCustomer(
  input: LookupOrCreateCustomerInput
): Promise<LookupOrCreateCustomerResult> {
  try {
    // Validate email
    if (!isValidEmail(input.email)) {
      return {
        success: false,
        error: 'Invalid email address',
      }
    }

    // Lookup existing customer
    const { data: existingCustomer, error: lookupError } = await supabaseServer
      .from('customers')
      .select('id')
      .eq('email', input.email)
      .maybeSingle()

    if (lookupError && lookupError.code !== 'PGRST116') {
      throw lookupError
    }

    // If customer exists, update and return
    if (existingCustomer) {
      const { error: updateError } = await supabaseServer
        .from('customers')
        .update({
          first_name: input.firstName,
          last_name: input.lastName,
          phone: input.phone,
          address_line_1: input.addressLine1,
          address_line_2: input.addressLine2 || null,
          city: input.city,
          state: input.state,
          zip_code: input.zipCode,
          country_code: input.countryCode || 'US',
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingCustomer.id)

      if (updateError) throw updateError

      return {
        success: true,
        customerId: existingCustomer.id,
        isReturning: true,
      }
    }

    // Create new customer
    const { data: newCustomer, error: createError } = await supabaseServer
      .from('customers')
      .insert({
        email: input.email,
        first_name: input.firstName,
        last_name: input.lastName,
        phone: input.phone,
        address_line_1: input.addressLine1,
        address_line_2: input.addressLine2 || null,
        city: input.city,
        state: input.state,
        zip_code: input.zipCode,
        country_code: input.countryCode || 'US',
      })
      .select('id')
      .single()

    if (createError) throw createError

    return {
      success: true,
      customerId: newCustomer.id,
      isReturning: false,
    }
  } catch (error) {
    console.error('lookupOrCreateCustomer error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process customer',
    }
  }
}

export interface CreateOrderInput {
  customerId: string
  items: CartItem[]
  totalPrice: number
  paymentMethod: 'zelle' | 'stripe'
}

export interface CreateOrderResult {
  success: boolean
  orderId?: string
  error?: string
}

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  try {
    // Validate cart is not empty
    if (!input.items || input.items.length === 0) {
      return {
        success: false,
        error: 'Cart is empty',
      }
    }

    // Validate total price
    if (input.totalPrice <= 0) {
      return {
        success: false,
        error: 'Total price must be greater than 0',
      }
    }

    // Verify customer exists
    const { data: customer, error: customerError } = await supabaseServer
      .from('customers')
      .select('id')
      .eq('id', input.customerId)
      .maybeSingle()

    if (customerError) throw customerError
    if (!customer) {
      return {
        success: false,
        error: 'Customer not found',
      }
    }

    // Create order
    const { data: order, error: insertError } = await supabaseServer
      .from('fruit_orders')
      .insert({
        customer_id: input.customerId,
        items: input.items,
        total_price: input.totalPrice,
        order_status: 'pending_approval',
        payment_method: input.paymentMethod,
      })
      .select('id')
      .single()

    if (insertError) throw insertError

    return {
      success: true,
      orderId: order.id,
    }
  } catch (error) {
    console.error('createOrder error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create order',
    }
  }
}
