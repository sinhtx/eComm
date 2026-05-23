'use client'

import { CartItem } from '@/lib/types'

interface CartItemsListProps {
  items: CartItem[]
  onRemoveItem: (itemId: string) => void
  onUpdateQuantity: (itemId: string, quantity: number) => void
}

export function CartItemsList({
  items,
  onRemoveItem,
  onUpdateQuantity,
}: CartItemsListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        Your cart is empty
      </div>
    )
  }

  return (
    <div className="space-y-4 border-b border-slate-200 pb-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between bg-slate-50 p-3 rounded"
        >
          <div className="flex-1">
            <p className="font-semibold text-slate-900">{item.name}</p>
            <p className="text-sm text-slate-600">
              Qty: {item.quantity} × ${item.pricePerUnit.toFixed(2)}
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-slate-900">${item.total.toFixed(2)}</p>
            <button
              onClick={() => onRemoveItem(item.id)}
              className="text-xs text-red-600 hover:text-red-800 mt-1"
              aria-label={`Remove ${item.name}`}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
