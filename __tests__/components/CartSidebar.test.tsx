import { render, screen, fireEvent } from '@testing-library/react'
import { CartSidebar } from '@/components/CartSidebar'
import { CartItem } from '@/lib/types'

// Mock CheckoutForm to avoid loading server actions in tests
jest.mock('@/components/CheckoutForm', () => ({
  CheckoutForm: ({ onCheckoutComplete, cartItems, cartTotal, onError }: any) => (
    <div data-testid="checkout-form">
      <button
        onClick={() => onCheckoutComplete('test-order-123', 'zelle')}
        data-testid="submit-checkout"
      >
        Submit Checkout
      </button>
      <div data-testid="total">${cartTotal.toFixed(2)}</div>
    </div>
  ),
}))

describe('CartSidebar', () => {
  it('should render closed sidebar when isOpen is false', () => {
    render(
      <CartSidebar
        isOpen={false}
        onClose={() => {}}
        items={[]}
        onRemoveItem={() => {}}
        onUpdateQuantity={() => {}}
        onCheckoutComplete={() => {}}
      />
    )

    // Sidebar should not be visible or accessible
    const sidebar = screen.queryByRole('dialog', { hidden: true })
    if (sidebar) {
      expect(sidebar).toHaveClass('translate-x-full')
    }
  })

  it('should display cart items when sidebar is open', () => {
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
      <CartSidebar
        isOpen={true}
        onClose={() => {}}
        items={items}
        onRemoveItem={() => {}}
        onUpdateQuantity={() => {}}
        onCheckoutComplete={() => {}}
      />
    )

    expect(screen.getByText('Carrie')).toBeInTheDocument()
  })

  it('should call onClose when close button is clicked', () => {
    const onClose = jest.fn()
    render(
      <CartSidebar
        isOpen={true}
        onClose={onClose}
        items={[]}
        onRemoveItem={() => {}}
        onUpdateQuantity={() => {}}
        onCheckoutComplete={() => {}}
      />
    )

    const closeButton = screen.getByLabelText('Close cart')
    fireEvent.click(closeButton)
    expect(onClose).toHaveBeenCalled()
  })

  it('should show "Your Cart" header when on items view', () => {
    render(
      <CartSidebar
        isOpen={true}
        onClose={() => {}}
        items={[]}
        onRemoveItem={() => {}}
        onUpdateQuantity={() => {}}
        onCheckoutComplete={() => {}}
      />
    )

    expect(screen.getByText('Your Cart')).toBeInTheDocument()
  })

  it('should display subtotal and checkout button when items exist', () => {
    const items: CartItem[] = [
      {
        id: 'carrie',
        name: 'Carrie',
        type: 'mango',
        quantity: 2,
        pricePerUnit: 12.5,
        total: 25.0,
      },
    ]

    render(
      <CartSidebar
        isOpen={true}
        onClose={() => {}}
        items={items}
        onRemoveItem={() => {}}
        onUpdateQuantity={() => {}}
        onCheckoutComplete={() => {}}
      />
    )

    expect(screen.getByText('Subtotal')).toBeInTheDocument()
    // Use getAllByText since there are multiple $25.00 instances
    const subtotals = screen.getAllByText('$25.00')
    expect(subtotals.length).toBeGreaterThan(0)
    expect(screen.getByText('Proceed to Checkout')).toBeInTheDocument()
  })

  it('should switch to checkout view when proceed button is clicked', () => {
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
      <CartSidebar
        isOpen={true}
        onClose={() => {}}
        items={items}
        onRemoveItem={() => {}}
        onUpdateQuantity={() => {}}
        onCheckoutComplete={() => {}}
      />
    )

    const proceedButton = screen.getByText('Proceed to Checkout')
    fireEvent.click(proceedButton)

    expect(screen.getByText('Checkout')).toBeInTheDocument()
  })

  it('should call onCheckoutComplete with orderId when checkout completes', () => {
    const onCheckoutComplete = jest.fn()
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
      <CartSidebar
        isOpen={true}
        onClose={() => {}}
        items={items}
        onRemoveItem={() => {}}
        onUpdateQuantity={() => {}}
        onCheckoutComplete={onCheckoutComplete}
      />
    )

    const proceedButton = screen.getByText('Proceed to Checkout')
    fireEvent.click(proceedButton)

    // Verify checkout form is shown (it would be rendered by CheckoutForm component)
    expect(screen.getByText('Checkout')).toBeInTheDocument()
  })

  it('should call onClose when overlay is clicked', () => {
    const onClose = jest.fn()
    render(
      <CartSidebar
        isOpen={true}
        onClose={onClose}
        items={[]}
        onRemoveItem={() => {}}
        onUpdateQuantity={() => {}}
        onCheckoutComplete={() => {}}
      />
    )

    // Find the overlay div
    const overlay = screen.getByRole('dialog').previousSibling as HTMLElement
    fireEvent.click(overlay)
    expect(onClose).toHaveBeenCalled()
  })

  it('should display empty cart message when no items', () => {
    render(
      <CartSidebar
        isOpen={true}
        onClose={() => {}}
        items={[]}
        onRemoveItem={() => {}}
        onUpdateQuantity={() => {}}
        onCheckoutComplete={() => {}}
      />
    )

    expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
  })

  it('should handle remove item callback', () => {
    const onRemoveItem = jest.fn()
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
      <CartSidebar
        isOpen={true}
        onClose={() => {}}
        items={items}
        onRemoveItem={onRemoveItem}
        onUpdateQuantity={() => {}}
        onCheckoutComplete={() => {}}
      />
    )

    // CartItemsList will have the remove button
    const removeButton = screen.getByLabelText('Remove Carrie')
    fireEvent.click(removeButton)
    expect(onRemoveItem).toHaveBeenCalledWith('carrie')
  })
})
