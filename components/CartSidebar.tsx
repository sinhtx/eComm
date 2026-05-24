'use client'

import { useState } from 'react'
import { CartItem } from '@/lib/types'
import { CartItemsList } from './CartItemsList'
import { CheckoutForm } from './CheckoutForm'

type SidebarView = 'items' | 'checkout'

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  onRemoveItem: (itemId: string) => void
  onCheckoutComplete: (orderId: string, paymentMethod: 'zelle' | 'stripe') => void
}

export function CartSidebar({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onCheckoutComplete,
}: CartSidebarProps) {
  const [view, setView] = useState<SidebarView>('items')
  const [error, setError] = useState<string | null>(null)

  const cartTotal = items.reduce((sum, item) => sum + item.total, 0)

  const handleCheckoutComplete = (orderId: string, paymentMethod: 'zelle' | 'stripe') => {
    onCheckoutComplete(orderId, paymentMethod)
    setView('items')
    setError(null)
    onClose()
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Shopping Cart"
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">
            {view === 'items' ? 'Your Cart' : 'Checkout'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
              {error}
            </div>
          )}

          {view === 'items' ? (
            <>
              <CartItemsList
                items={items}
                onRemoveItem={onRemoveItem}
              />

              {/* Subtotal */}
              {items.length > 0 && (
                <div className="mt-6 pt-4 border-t border-slate-200">
                  <div className="flex justify-between mb-4">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-bold text-slate-900">${cartTotal.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => {
                      setError(null)
                      setView('checkout')
                    }}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <CheckoutForm
                cartItems={items}
                cartTotal={cartTotal}
                onCheckoutComplete={handleCheckoutComplete}
                onError={(err) => setError(err)}
              />
              <button
                onClick={() => {
                  setError(null)
                  setView('items')
                }}
                className="w-full mt-4 text-amber-600 hover:text-amber-700 font-semibold py-2"
              >
                Back to Cart
              </button>
            </>
          )}
        </div>
      </div>
    </>
  )
}
