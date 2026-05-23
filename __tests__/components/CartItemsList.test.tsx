import { render, screen, fireEvent } from '@testing-library/react'
import { CartItemsList } from '@/components/CartItemsList'
import { CartItem } from '@/lib/types'

describe('CartItemsList', () => {
  it('should display cart items with quantities and totals', () => {
    const items: CartItem[] = [
      {
        id: 'carrie',
        name: 'Carrie',
        type: 'mango',
        quantity: 2,
        pricePerUnit: 12.5,
        total: 25.0,
      },
      {
        id: 'small-mix',
        name: 'Small Mix',
        type: 'mixbox',
        quantity: 1,
        pricePerUnit: 45.0,
        total: 45.0,
      },
    ]

    render(
      <CartItemsList
        items={items}
        onRemoveItem={() => {}}
        onUpdateQuantity={() => {}}
      />
    )

    expect(screen.getByText('Carrie')).toBeInTheDocument()
    expect(screen.getByText('Small Mix')).toBeInTheDocument()
    expect(screen.getByText('Qty: 2 × $12.50')).toBeInTheDocument()
    expect(screen.getByText('$25.00')).toBeInTheDocument()
  })

  it('should call onRemoveItem when remove button is clicked', () => {
    const mockRemove = jest.fn()
    const items: CartItem[] = [
      {
        id: 'carrie',
        name: 'Carrie',
        type: 'mango',
        quantity: 1,
        pricePerUnit: 12.5,
        total: 12.5,
      },
    ]

    render(
      <CartItemsList
        items={items}
        onRemoveItem={mockRemove}
        onUpdateQuantity={() => {}}
      />
    )

    const removeButton = screen.getByRole('button', { name: /remove/i })
    fireEvent.click(removeButton)

    expect(mockRemove).toHaveBeenCalledWith('carrie')
  })

  it('should display empty cart message when no items', () => {
    render(
      <CartItemsList
        items={[]}
        onRemoveItem={() => {}}
        onUpdateQuantity={() => {}}
      />
    )

    expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
  })
})
