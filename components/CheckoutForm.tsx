'use client'

import { useState } from 'react'
import { CartItem, CheckoutFormData } from '@/lib/types'
import {
  lookupOrCreateCustomer,
  createOrder,
  createPaymentIntent,
} from '@/app/actions/checkout'

type CheckoutStep = 'email' | 'shipping' | 'payment' | 'complete'

interface CheckoutFormProps {
  cartItems: CartItem[]
  cartTotal: number
  onCheckoutComplete: (orderId: string, paymentMethod: 'zelle' | 'stripe') => void
  onError: (error: string) => void
}

export function CheckoutForm({
  cartItems,
  cartTotal,
  onCheckoutComplete,
  onError,
}: CheckoutFormProps) {
  const [step, setStep] = useState<CheckoutStep>('email')
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [customerId, setCustomerId] = useState<string | null>(null)

  const [formData, setFormData] = useState<CheckoutFormData>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    addressLine1: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'zelle',
  })

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      onError('Email is required')
      return
    }

    setIsLoading(true)
    try {
      const result = await lookupOrCreateCustomer({
        email,
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        phone: formData.phone || '',
        addressLine1: formData.addressLine1 || '',
        addressLine2: formData.addressLine2,
        city: formData.city || '',
        state: formData.state || '',
        zipCode: formData.zipCode || '',
        countryCode: 'US',
      })

      if (!result.success) {
        onError(result.error || 'Failed to process email')
        return
      }

      setCustomerId(result.customerId!)
      setFormData((prev) => ({ ...prev, email }))
      setStep('shipping')
    } catch (error) {
      onError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.addressLine1 ||
      !formData.city ||
      !formData.state ||
      !formData.zipCode
    ) {
      onError('Please fill in all required shipping fields')
      return
    }

    setStep('payment')
  }

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerId) {
      onError('Customer information not found')
      return
    }

    setIsLoading(true)
    try {
      // Create order
      const orderResult = await createOrder({
        customerId,
        items: cartItems,
        totalPrice: cartTotal,
        paymentMethod: formData.paymentMethod,
      })

      if (!orderResult.success) {
        onError(orderResult.error || 'Failed to create order')
        return
      }

      const orderId = orderResult.orderId!

      // If Stripe, create payment intent
      if (formData.paymentMethod === 'stripe') {
        const piResult = await createPaymentIntent({
          orderId,
          amount: Math.round(cartTotal * 100), // Convert to cents
          customerEmail: formData.email,
        })

        if (!piResult.success) {
          onError(piResult.error || 'Failed to create payment')
          return
        }

        // TODO: In next task, call Stripe.js to confirm card payment
        // For now, just mark as complete for Stripe
        onCheckoutComplete(orderId, 'stripe')
      } else {
        onCheckoutComplete(orderId, 'zelle')
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (step === 'email') {
    return (
      <form onSubmit={handleEmailSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
        >
          {isLoading ? 'Looking up...' : 'Continue'}
        </button>
      </form>
    )
  }

  if (step === 'shipping') {
    return (
      <form onSubmit={handleShippingSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="First Name"
            required
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="px-3 py-2 border border-slate-300 rounded-md text-slate-900"
          />
          <input
            type="text"
            placeholder="Last Name"
            required
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="px-3 py-2 border border-slate-300 rounded-md text-slate-900"
          />
        </div>

        <input
          type="tel"
          placeholder="Phone Number"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900"
        />

        <input
          type="text"
          placeholder="Address Line 1"
          required
          value={formData.addressLine1}
          onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900"
        />

        <input
          type="text"
          placeholder="Address Line 2 (Optional)"
          value={formData.addressLine2 || ''}
          onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900"
        />

        <div className="grid grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="City"
            required
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="px-3 py-2 border border-slate-300 rounded-md text-slate-900"
          />
          <input
            type="text"
            placeholder="State"
            required
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            className="px-3 py-2 border border-slate-300 rounded-md text-slate-900"
          />
          <input
            type="text"
            placeholder="ZIP"
            required
            value={formData.zipCode}
            onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
            className="px-3 py-2 border border-slate-300 rounded-md text-slate-900"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setStep('email')}
            className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-2 px-4 rounded-lg"
          >
            Back
          </button>
          <button
            type="submit"
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Continue to Payment
          </button>
        </div>
      </form>
    )
  }

  if (step === 'payment') {
    return (
      <form onSubmit={handleCheckoutSubmit} className="space-y-6">
        <div className="bg-slate-50 p-4 rounded-lg space-y-3">
          <label className="flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="zelle"
              checked={formData.paymentMethod === 'zelle'}
              onChange={() => setFormData({ ...formData, paymentMethod: 'zelle' })}
              className="mr-3"
            />
            <div>
              <p className="font-semibold text-slate-900">Manual Payment (Zelle)</p>
              <p className="text-sm text-slate-600">
                Transfer ${cartTotal.toFixed(2)} via Zelle to the farm. Account: Seasonal Fruit Farm
              </p>
            </div>
          </label>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg">
          <label className="flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="stripe"
              checked={formData.paymentMethod === 'stripe'}
              onChange={() => setFormData({ ...formData, paymentMethod: 'stripe' })}
              className="mr-3"
            />
            <p className="font-semibold text-slate-900">Pay with Card</p>
          </label>
        </div>

        {formData.paymentMethod === 'stripe' && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900">
              Stripe integration ready. Card input will be mounted here in production.
            </p>
            <p className="text-xs text-blue-700 mt-2">
              Test card: 4242 4242 4242 4242 (any future date, any CVC)
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setStep('shipping')}
            className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-2 px-4 rounded-lg"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Complete Order'}
          </button>
        </div>
      </form>
    )
  }

  return null
}
