import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CheckoutForm } from '@/components/CheckoutForm'
import { CartItem } from '@/lib/types'

// Mock the server actions
jest.mock('@/app/actions/checkout', () => ({
  lookupOrCreateCustomer: jest.fn(),
  createOrder: jest.fn(),
  createPaymentIntent: jest.fn(),
}))

import * as checkoutActions from '@/app/actions/checkout'

const { lookupOrCreateCustomer, createOrder, createPaymentIntent } = checkoutActions as unknown as {
  lookupOrCreateCustomer: jest.Mock
  createOrder: jest.Mock
  createPaymentIntent: jest.Mock
}

describe('CheckoutForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Email Step', () => {
    it('should render email input field initially', () => {
      const mockOnComplete = jest.fn()
      const mockOnError = jest.fn()

      render(
        <CheckoutForm
          cartItems={[]}
          cartTotal={0}
          onCheckoutComplete={mockOnComplete}
          onError={mockOnError}
        />
      )

      const emailInput = screen.getByLabelText(/email/i)
      expect(emailInput).toBeInTheDocument()
      expect(emailInput).toHaveAttribute('type', 'email')
    })

    it('should show error if email is empty on submit', () => {
      const mockOnError = jest.fn()

      render(
        <CheckoutForm
          cartItems={[]}
          cartTotal={0}
          onCheckoutComplete={jest.fn()}
          onError={mockOnError}
        />
      )

      const form = screen.getByRole('button', { name: /continue/i }).closest('form')
      fireEvent.submit(form!)

      expect(mockOnError).toHaveBeenCalledWith('Email is required')
    })

    it('should call lookupOrCreateCustomer on email submit', async () => {
      lookupOrCreateCustomer.mockResolvedValueOnce({
        success: true,
        customerId: 'cust-123',
        isReturning: false,
      })

      const mockOnComplete = jest.fn()
      const mockOnError = jest.fn()

      render(
        <CheckoutForm
          cartItems={[]}
          cartTotal={0}
          onCheckoutComplete={mockOnComplete}
          onError={mockOnError}
        />
      )

      const emailInput = screen.getByLabelText(/email/i)
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })

      const submitButton = screen.getByRole('button', { name: /continue/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(lookupOrCreateCustomer).toHaveBeenCalled()
      })
    })

    it('should move to shipping step on successful email lookup', async () => {
      lookupOrCreateCustomer.mockResolvedValueOnce({
        success: true,
        customerId: 'cust-123',
        isReturning: false,
      })

      render(
        <CheckoutForm
          cartItems={[]}
          cartTotal={0}
          onCheckoutComplete={jest.fn()}
          onError={jest.fn()}
        />
      )

      const emailInput = screen.getByLabelText(/email/i)
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })

      const submitButton = screen.getByRole('button', { name: /continue/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument()
      })
    })

    it('should call onError if lookupOrCreateCustomer fails', async () => {
      lookupOrCreateCustomer.mockResolvedValueOnce({
        success: false,
        error: 'Database error',
      })

      const mockOnError = jest.fn()

      render(
        <CheckoutForm
          cartItems={[]}
          cartTotal={0}
          onCheckoutComplete={jest.fn()}
          onError={mockOnError}
        />
      )

      const emailInput = screen.getByLabelText(/email/i)
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })

      const submitButton = screen.getByRole('button', { name: /continue/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith('Database error')
      })
    })
  })

  describe('Shipping Step', () => {
    it('should require all shipping fields', async () => {
      lookupOrCreateCustomer.mockResolvedValueOnce({
        success: true,
        customerId: 'cust-123',
        isReturning: false,
      })

      const mockOnError = jest.fn()

      render(
        <CheckoutForm
          cartItems={[]}
          cartTotal={0}
          onCheckoutComplete={jest.fn()}
          onError={mockOnError}
        />
      )

      // Move to shipping step
      const emailInput = screen.getByLabelText(/email/i)
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.click(screen.getByRole('button', { name: /continue/i }))

      await waitFor(() => {
        expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument()
      })

      // Try to submit without filling fields - use form submit to bypass HTML5 validation
      const form = screen.getByRole('button', { name: /continue to payment/i }).closest('form')
      fireEvent.submit(form!)

      expect(mockOnError).toHaveBeenCalledWith('Please fill in all required shipping fields')
    })

    it('should move to payment step when shipping is valid', async () => {
      lookupOrCreateCustomer.mockResolvedValueOnce({
        success: true,
        customerId: 'cust-123',
        isReturning: false,
      })

      render(
        <CheckoutForm
          cartItems={[]}
          cartTotal={0}
          onCheckoutComplete={jest.fn()}
          onError={jest.fn()}
        />
      )

      // Move to shipping
      const emailInput = screen.getByLabelText(/email/i)
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.click(screen.getByRole('button', { name: /continue/i }))

      await waitFor(() => {
        expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument()
      })

      // Fill shipping fields
      fireEvent.change(screen.getByPlaceholderText('First Name'), {
        target: { value: 'John' },
      })
      fireEvent.change(screen.getByPlaceholderText('Last Name'), {
        target: { value: 'Doe' },
      })
      fireEvent.change(screen.getByPlaceholderText('Phone Number'), {
        target: { value: '555-1234' },
      })
      fireEvent.change(screen.getByPlaceholderText('Address Line 1'), {
        target: { value: '123 Main St' },
      })
      fireEvent.change(screen.getByPlaceholderText('City'), {
        target: { value: 'Springfield' },
      })
      fireEvent.change(screen.getByPlaceholderText('State'), {
        target: { value: 'IL' },
      })
      fireEvent.change(screen.getByPlaceholderText('ZIP'), {
        target: { value: '62701' },
      })

      // Submit
      fireEvent.click(screen.getByRole('button', { name: /continue to payment/i }))

      await waitFor(() => {
        // Should show payment options
        expect(screen.getByText(/manual payment/i)).toBeInTheDocument()
      })
    })

    it('should go back to email step', async () => {
      lookupOrCreateCustomer.mockResolvedValueOnce({
        success: true,
        customerId: 'cust-123',
        isReturning: false,
      })

      render(
        <CheckoutForm
          cartItems={[]}
          cartTotal={0}
          onCheckoutComplete={jest.fn()}
          onError={jest.fn()}
        />
      )

      // Move to shipping
      const emailInput = screen.getByLabelText(/email/i)
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.click(screen.getByRole('button', { name: /continue/i }))

      await waitFor(() => {
        expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument()
      })

      // Click back
      fireEvent.click(screen.getByRole('button', { name: /back/i }))

      await waitFor(() => {
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      })
    })
  })

  describe('Payment Step', () => {
    it('should show Zelle as default payment method', async () => {
      lookupOrCreateCustomer.mockResolvedValueOnce({
        success: true,
        customerId: 'cust-123',
        isReturning: false,
      })

      render(
        <CheckoutForm
          cartItems={[]}
          cartTotal={50}
          onCheckoutComplete={jest.fn()}
          onError={jest.fn()}
        />
      )

      // Move through form to payment
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      })
      fireEvent.click(screen.getByRole('button', { name: /continue/i }))

      await waitFor(() => {
        expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument()
      })

      // Fill and submit shipping
      fireEvent.change(screen.getByPlaceholderText('First Name'), {
        target: { value: 'John' },
      })
      fireEvent.change(screen.getByPlaceholderText('Last Name'), {
        target: { value: 'Doe' },
      })
      fireEvent.change(screen.getByPlaceholderText('Phone Number'), {
        target: { value: '555-1234' },
      })
      fireEvent.change(screen.getByPlaceholderText('Address Line 1'), {
        target: { value: '123 Main St' },
      })
      fireEvent.change(screen.getByPlaceholderText('City'), {
        target: { value: 'Springfield' },
      })
      fireEvent.change(screen.getByPlaceholderText('State'), {
        target: { value: 'IL' },
      })
      fireEvent.change(screen.getByPlaceholderText('ZIP'), {
        target: { value: '62701' },
      })
      fireEvent.click(screen.getByRole('button', { name: /continue to payment/i }))

      await waitFor(() => {
        const zelleRadio = screen.getByRole('radio', { name: /manual payment/i })
        expect(zelleRadio).toBeChecked()
      })
    })

    it('should allow switching to Stripe payment', async () => {
      lookupOrCreateCustomer.mockResolvedValueOnce({
        success: true,
        customerId: 'cust-123',
        isReturning: false,
      })

      render(
        <CheckoutForm
          cartItems={[]}
          cartTotal={50}
          onCheckoutComplete={jest.fn()}
          onError={jest.fn()}
        />
      )

      // Move to payment
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      })
      fireEvent.click(screen.getByRole('button', { name: /continue/i }))

      await waitFor(() => {
        expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument()
      })

      fireEvent.change(screen.getByPlaceholderText('First Name'), {
        target: { value: 'John' },
      })
      fireEvent.change(screen.getByPlaceholderText('Last Name'), {
        target: { value: 'Doe' },
      })
      fireEvent.change(screen.getByPlaceholderText('Phone Number'), {
        target: { value: '555-1234' },
      })
      fireEvent.change(screen.getByPlaceholderText('Address Line 1'), {
        target: { value: '123 Main St' },
      })
      fireEvent.change(screen.getByPlaceholderText('City'), {
        target: { value: 'Springfield' },
      })
      fireEvent.change(screen.getByPlaceholderText('State'), {
        target: { value: 'IL' },
      })
      fireEvent.change(screen.getByPlaceholderText('ZIP'), {
        target: { value: '62701' },
      })
      fireEvent.click(screen.getByRole('button', { name: /continue to payment/i }))

      await waitFor(() => {
        const stripeRadio = screen.getByRole('radio', { name: /pay with card/i })
        fireEvent.click(stripeRadio)
        expect(stripeRadio).toBeChecked()
      })
    })

    it('should call createOrder and createPaymentIntent for Stripe payment', async () => {
      const mockOnComplete = jest.fn()

      lookupOrCreateCustomer.mockResolvedValueOnce({
        success: true,
        customerId: 'cust-123',
        isReturning: false,
      })
      createOrder.mockResolvedValueOnce({
        success: true,
        orderId: 'order-123',
      })
      createPaymentIntent.mockResolvedValueOnce({
        success: true,
        clientSecret: 'pi_test_secret',
      })

      const cartItems: CartItem[] = [
        {
          id: 'carrie',
          name: 'Carrie',
          type: 'mango',
          quantity: 1,
          pricePerUnit: 50,
          total: 50,
        },
      ]

      render(
        <CheckoutForm
          cartItems={cartItems}
          cartTotal={50}
          onCheckoutComplete={mockOnComplete}
          onError={jest.fn()}
        />
      )

      // Move to payment
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      })
      fireEvent.click(screen.getByRole('button', { name: /continue/i }))

      await waitFor(() => {
        expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument()
      })

      fireEvent.change(screen.getByPlaceholderText('First Name'), {
        target: { value: 'John' },
      })
      fireEvent.change(screen.getByPlaceholderText('Last Name'), {
        target: { value: 'Doe' },
      })
      fireEvent.change(screen.getByPlaceholderText('Phone Number'), {
        target: { value: '555-1234' },
      })
      fireEvent.change(screen.getByPlaceholderText('Address Line 1'), {
        target: { value: '123 Main St' },
      })
      fireEvent.change(screen.getByPlaceholderText('City'), {
        target: { value: 'Springfield' },
      })
      fireEvent.change(screen.getByPlaceholderText('State'), {
        target: { value: 'IL' },
      })
      fireEvent.change(screen.getByPlaceholderText('ZIP'), {
        target: { value: '62701' },
      })
      fireEvent.click(screen.getByRole('button', { name: /continue to payment/i }))

      await waitFor(() => {
        expect(screen.getByRole('radio', { name: /manual payment/i })).toBeInTheDocument()
      })

      // Switch to Stripe
      fireEvent.click(screen.getByRole('radio', { name: /pay with card/i }))

      // Submit
      fireEvent.click(screen.getByRole('button', { name: /complete order/i }))

      await waitFor(() => {
        expect(createOrder).toHaveBeenCalled()
        expect(createPaymentIntent).toHaveBeenCalled()
        expect(mockOnComplete).toHaveBeenCalledWith('order-123', 'stripe')
      })
    })

    it('should call createOrder only for Zelle payment', async () => {
      const mockOnComplete = jest.fn()

      lookupOrCreateCustomer.mockResolvedValueOnce({
        success: true,
        customerId: 'cust-123',
        isReturning: false,
      })
      createOrder.mockResolvedValueOnce({
        success: true,
        orderId: 'order-456',
      })

      const cartItems: CartItem[] = [
        {
          id: 'carrie',
          name: 'Carrie',
          type: 'mango',
          quantity: 1,
          pricePerUnit: 50,
          total: 50,
        },
      ]

      render(
        <CheckoutForm
          cartItems={cartItems}
          cartTotal={50}
          onCheckoutComplete={mockOnComplete}
          onError={jest.fn()}
        />
      )

      // Move to payment
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      })
      fireEvent.click(screen.getByRole('button', { name: /continue/i }))

      await waitFor(() => {
        expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument()
      })

      fireEvent.change(screen.getByPlaceholderText('First Name'), {
        target: { value: 'John' },
      })
      fireEvent.change(screen.getByPlaceholderText('Last Name'), {
        target: { value: 'Doe' },
      })
      fireEvent.change(screen.getByPlaceholderText('Phone Number'), {
        target: { value: '555-1234' },
      })
      fireEvent.change(screen.getByPlaceholderText('Address Line 1'), {
        target: { value: '123 Main St' },
      })
      fireEvent.change(screen.getByPlaceholderText('City'), {
        target: { value: 'Springfield' },
      })
      fireEvent.change(screen.getByPlaceholderText('State'), {
        target: { value: 'IL' },
      })
      fireEvent.change(screen.getByPlaceholderText('ZIP'), {
        target: { value: '62701' },
      })
      fireEvent.click(screen.getByRole('button', { name: /continue to payment/i }))

      await waitFor(() => {
        expect(screen.getByRole('radio', { name: /manual payment/i })).toBeInTheDocument()
      })

      // Keep Zelle selected (default), submit
      fireEvent.click(screen.getByRole('button', { name: /complete order/i }))

      await waitFor(() => {
        expect(createOrder).toHaveBeenCalled()
        expect(createPaymentIntent).not.toHaveBeenCalled()
        expect(mockOnComplete).toHaveBeenCalledWith('order-456', 'zelle')
      })
    })
  })
})
