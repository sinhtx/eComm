# Part 3: Checkout & Stripe Pre-Authorization Design

**Date:** May 23, 2026  
**Status:** Approved  
**Scope:** Implement shopping cart sidebar, checkout form, customer management, and Stripe payment integration with manual capture mode

---

## 1. Overview

This feature enables customers to:
1. Add items (mangoes or mix boxes) to a cart
2. Proceed through checkout in a sidebar modal
3. Enter shipping info and choose payment method
4. Pay via Zelle (default, manual) or Stripe card (optional)
5. Submit orders to Supabase with `pending_approval` status for admin review

Key design decision: **Zelle is the default; Stripe is optional.** This allows the farm to scale gradually without managing credit card processing initially.

---

## 2. User Experience & UI Flow

### Cart Sidebar Component

**When user clicks "Add to Cart":**
- Sidebar slides in from right
- Shows cart items:
  - Individual mangoes with quantity selector + ability to remove
  - Mix boxes with quantity selector + ability to remove
  - Subtotal calculation
- "Proceed to Checkout" button at bottom

**Progressive Form Reveal:**
- Clicking "Proceed to Checkout" expands the form within the same sidebar (no full-page redirect)
- Customer stays in context of the product page

### Checkout Form (Multi-Step, Single Sidebar)

**Step 1: Email Entry & Customer Lookup**
- Email input field
- On blur/submit: Look up customer in Supabase
- Display: "Returning customer?" message if found, ready to prefill
- If new: Show empty form for next step

**Step 2: Shipping Information**
- First Name, Last Name
- Phone number
- Address line 1, Address line 2 (optional)
- City, State, ZIP code
- Country code (default to "US")
- Pre-filled if returning customer

**Step 3: Payment Method Selection**
- Default selected: **"Manual Payment (Zelle)"**
  - Shows static Zelle instructions: Account name, email, amount
  - No form fields needed
- Optional: **"Pay with Card"** (radio/toggle)
  - When selected, reveals Stripe card input element below
  - Card field managed by Stripe.js

**Step 4: Submit**
- Single "Complete Order" button
- Validates all shipping fields
- If Stripe selected: validates card with Stripe.js before submit
- Disables button during submission

### Success State
- Clear modal
- Show order confirmation page or banner with:
  - Order ID
  - Total amount
  - If Zelle: "Payment instructions: Transfer via Zelle to [account]. Manager will review and ship."
  - If Stripe: "Payment processing. Your order is pending admin approval."

---

## 3. Data Architecture

### Updated Order Data Structure

**Cart item format (in-memory, client state):**
```typescript
interface CartItem {
  id: string              // Product ID (mango variety or mix box)
  name: string            // "Carrie" or "Small Mix"
  type: 'mango' | 'mixbox'
  quantity: number
  pricePerUnit: number
  total: number           // quantity * pricePerUnit
}
```

**Order record in Supabase (fruit_orders table):**
```
id: UUID
customer_id: UUID (FK to customers)
order_status: VARCHAR(50) = 'pending_approval'
items: JSONB = [{name, id, quantity, price, total}, ...]
total_price: DECIMAL(10, 2)
stripe_payment_intent_id: VARCHAR(255) | NULL
stripe_charge_id: VARCHAR(255) | NULL
payment_method: VARCHAR(50) = 'zelle' | 'stripe'  [NEW FIELD]
notes: TEXT (optional)
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

**Customer record (customers table, existing schema):**
- Already supports: email, first_name, last_name, phone, address_line_1, address_line_2, city, state, zip_code, country_code, created_at, updated_at
- Upsert on email to handle returning customers

---

## 4. Server Actions (Backend)

### Action 1: `lookupOrCreateCustomer`

**Input:**
- `email: string`
- `firstName?: string`
- `lastName?: string`
- `phone?: string`
- `addressLine1?: string`
- `addressLine2?: string`
- `city?: string`
- `state?: string`
- `zipCode?: string`
- `countryCode?: string = 'US'`

**Logic:**
1. Query `customers` table by email
2. If found: Update any non-null fields, return customer ID + `isReturning: true`
3. If not found: Insert new customer, return customer ID + `isReturning: false`

**Output:**
```typescript
{
  success: boolean
  customerId?: string
  isReturning?: boolean
  error?: string
}
```

**Error handling:**
- Email validation before query
- Race condition (duplicate email): Fetch existing on constraint violation
- Database errors: Return error message

---

### Action 2: `createOrder`

**Input:**
- `customerId: string`
- `items: CartItem[]` (cart contents)
- `totalPrice: number`
- `paymentMethod: 'zelle' | 'stripe'`

**Logic:**
1. Validate cart items (non-empty, prices match current data)
2. Insert into `fruit_orders` with:
   - `customer_id: customerId`
   - `items: items` (as JSONB)
   - `total_price: totalPrice`
   - `payment_method: paymentMethod`
   - `order_status: 'pending_approval'`
3. Return order ID

**Output:**
```typescript
{
  success: boolean
  orderId?: string
  error?: string
}
```

**Error handling:**
- Invalid customer ID: Return error
- Cart validation fails: Return specific error
- Database insert fails: Return error message

---

### Action 3: `createPaymentIntent` (Stripe only)

**Input:**
- `orderId: string`
- `amount: number` (in cents, e.g., $45.00 = 4500)
- `customerEmail: string`

**Logic:**
1. Call Stripe API: `stripe.paymentIntents.create({amount, currency: 'usd', capture_method: 'manual', receipt_email: customerEmail})`
2. Store `stripe_payment_intent_id` in order record
3. Return client secret + payment intent ID

**Output:**
```typescript
{
  success: boolean
  clientSecret?: string
  paymentIntentId?: string
  error?: string
}
```

**Note:** Payment intent is created but NOT confirmed by this action. Client-side Stripe.js will confirm with card details.

**Error handling:**
- Stripe API errors: Return error message
- Order update fails: Log error, return user-friendly message

---

## 5. Client-Side Flow (React Component)

### CartSidebar Component

**State:**
- `cart: CartItem[]`
- `isCheckoutOpen: boolean`
- `checkoutStep: 'items' | 'email' | 'shipping' | 'payment'`
- `customerEmail: string`
- `customerData: {firstName, lastName, phone, address1, address2, city, state, zip}`
- `paymentMethod: 'zelle' | 'stripe'`
- `isLoading: boolean`
- `error: string | null`

**Actions:**
1. **Add to Cart** → Append to cart array, open sidebar
2. **Email lookup** → Call `lookupOrCreateCustomer(email)` → Auto-fill if returning
3. **Proceed to checkout** → Validate shipping → Call `createOrder()`
4. If Stripe selected → Call `createPaymentIntent()` → Mount card element → Call `confirmCardPayment()`
5. On success → Show confirmation, clear cart

**Stripe Integration:**
- Import `@stripe/react-stripe-js` and `@stripe/stripe-js`
- Load public key from env: `NEXT_PUBLIC_STRIPE_PUBLIC_KEY`
- Lazy-load Stripe elements only if customer selects "Pay with Card"
- Use `confirmCardPayment()` to process with client secret

---

## 6. Error Handling & Edge Cases

| Scenario | Handling |
|----------|----------|
| Email lookup fails (network) | Show retry button, preserve form state |
| Customer insert race condition | Gracefully handle duplicate key, fetch existing |
| Cart item price mismatch | Show warning, refresh cart from server, allow user to re-add |
| Stripe payment fails | Show error message, preserve order (admin can manually process later) |
| Invalid shipping address | Form validation before submit; show inline errors |
| Order insert fails | Return error, don't proceed to payment |
| Stripe timeout | Show timeout message, order may still be created; user can retry payment later |

---

## 7. Environment Variables

Add to `.env.local`:

```bash
# Stripe (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

**Note:** Keys are test keys; no real charges will be processed.

---

## 8. Database Schema Changes

### Add `payment_method` column to `fruit_orders`:

```sql
ALTER TABLE fruit_orders 
ADD COLUMN payment_method VARCHAR(50) DEFAULT 'zelle';
```

**Existing columns already support the flow:**
- `stripe_payment_intent_id` (for Stripe orders)
- `stripe_charge_id` (populated during approval in Part 5)

---

## 9. Testing Strategy

### Unit Tests

1. **`lookupOrCreateCustomer` action:**
   - New customer creation
   - Returning customer lookup and update
   - Invalid email handling

2. **`createOrder` action:**
   - Order creation with valid cart
   - Order creation with invalid customer ID
   - Cart validation (non-empty, price matching)

3. **`createPaymentIntent` action (Stripe):**
   - Payment intent created successfully
   - Stripe error handling

### Integration Tests

1. **Full Zelle checkout:**
   - Add items to cart → Fill shipping → Select Zelle → Submit
   - Verify order in Supabase with `payment_method: 'zelle'`
   - Verify order status is `pending_approval`

2. **Full Stripe checkout (test mode):**
   - Add items → Fill shipping → Select Stripe → Enter test card `4242 4242 4242 4242`
   - Verify payment intent created with `capture_method: 'manual'`
   - Verify order in Supabase with `stripe_payment_intent_id` populated
   - Verify order status is `pending_approval`

3. **Returning customer:**
   - First order with email + shipping
   - Second order with same email → Verify auto-filled fields

---

## 10. Success Criteria

- ✅ Cart sidebar opens on "Add to Cart" click
- ✅ Checkout form progresses through all steps within sidebar
- ✅ Email lookup finds returning customers and pre-fills info
- ✅ Zelle is default payment method with instructions shown
- ✅ Stripe option reveals card input when selected (test mode only)
- ✅ Order created in Supabase with `pending_approval` status
- ✅ Customer created/updated correctly
- ✅ Stripe payment intent created with `capture_method: 'manual'`
- ✅ Integration tests pass for both Zelle and Stripe flows
- ✅ Error handling gracefully shows user-friendly messages
- ✅ Returning customers see pre-filled shipping info

---

## 11. Out of Scope (Part 4 & 5)

- Admin approval/rejection workflow
- Stripe payment capture (done in Part 5)
- Email confirmations
- Order tracking page for customers
- Inventory management

