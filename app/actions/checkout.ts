'use server'

import { supabaseServer } from '@/lib/auth/supabaseClient'

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
