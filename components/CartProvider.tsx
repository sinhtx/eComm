'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import type { CartItem, MangoVariety } from '@/lib/types'
import { CartSidebar } from '@/components/CartSidebar'

interface CartContextValue {
  items: CartItem[]
  itemCount: number
  openCart: () => void
  closeCart: () => void
  addMangoToCart: (mango: MangoVariety) => void
  removeFromCart: (itemId: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider')
  }
  return ctx
}

/** Optional hook for shells that render outside CartProvider (should not happen in this app). */
export function useCartOptional(): CartContextValue | null {
  return useContext(CartContext)
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  )

  const addMangoToCart = useCallback((mango: MangoVariety) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === mango.id)
      if (existing) {
        return prev.map((item) =>
          item.id === mango.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                total: (item.quantity + 1) * item.pricePerUnit,
              }
            : item
        )
      }
      return [
        ...prev,
        {
          id: mango.id,
          name: mango.name,
          type: 'mango' as const,
          quantity: 1,
          pricePerUnit: mango.pricePerPound,
          total: mango.pricePerPound,
        },
      ]
    })
  }, [])

  const removeFromCart = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const handleCheckoutComplete = useCallback(
    (..._args: [string, 'zelle' | 'stripe']) => {
      void _args
      clearCart()
      setIsOpen(false)
    },
    [clearCart]
  )

  const value = useMemo(
    () => ({
      items,
      itemCount,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addMangoToCart,
      removeFromCart,
      clearCart,
    }),
    [
      items,
      itemCount,
      addMangoToCart,
      removeFromCart,
      clearCart,
    ]
  )

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartSidebar
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        items={items}
        onRemoveItem={removeFromCart}
        onCheckoutComplete={handleCheckoutComplete}
      />
    </CartContext.Provider>
  )
}
