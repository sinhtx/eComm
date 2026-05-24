# Part 5: Order Approval Workflow Design

**Date:** May 23, 2026  
**Status:** Approved  
**Scope:** Implement order approval/cancellation workflow with Stripe payment capture/release and email notifications

---

## 1. Overview

This feature enables the farm manager to:
1. **Approve pending orders** → Capture Stripe payment → Send confirmation email to customer + admin
2. **Cancel pending orders** → Release Stripe hold → Send cancellation email to customer + admin with reason
3. **Both operations create audit log entries** for order history tracking

Key design decision: **Email failures don't block order status updates.** If Stripe succeeds but email fails, the order is approved/cancelled and the failure is logged. Stripe failures ARE blocking and prevent order status changes.

---

## 2. Architecture

### Three Components

#### 2.1 Email Service (`lib/email/service.ts`)
- Handles all email composition and delivery via Resend API
- Takes customer email, admin email, order data as input
- Returns success/failure status
- **Does not throw on email failures** — returns error object instead
- Two functions:
  - `sendApprovalEmail(customer, admin, order)` → sends confirmation
  - `sendCancellationEmail(customer, admin, order, reason)` → sends cancellation with reason

#### 2.2 Modified Server Actions (`app/actions/adminOrders.ts`)
- **`approveOrder(orderId: string)`** 
  1. Fetch order from Supabase
  2. Call `stripe.paymentIntents.capture(stripe_payment_intent_id)` 
  3. **If Stripe fails:** return error, stop
  4. Update order status to `approved` in Supabase
  5. Create audit log entry: `pending_approval` → `approved`
  6. Call email service (`sendApprovalEmail`)
  7. Return success (even if email fails)

- **`rejectOrder(orderId: string, reason: string)`**
  1. Fetch order from Supabase
  2. Call `stripe.paymentIntents.cancel(stripe_payment_intent_id)`
  3. **If Stripe fails:** return error, stop
  4. Update order status to `cancelled` in Supabase
  5. Create audit log entry: `pending_approval` → `cancelled` with reason
  6. Call email service (`sendCancellationEmail` with reason)
  7. Return success (even if email fails)

#### 2.3 Admin UI Updates (`components/admin/OrdersList.tsx`)
- **Approve button:**
  - Shows confirmation dialog: "Capture $[amount]?"
  - On confirm: calls `approveOrder(orderId)`
  - Displays result (success or Stripe error)
  - Refreshes order list on success

- **Cancel button:**
  1. Shows prompt: "Enter rejection reason:"
  2. If user enters reason: shows confirmation dialog: "Release hold and notify customer?"
  3. On confirm: calls `rejectOrder(orderId, reason)`
  4. Displays result (success or Stripe error)
  5. Refreshes order list on success

---

## 3. Email Templates

### Approval Email
**To:** customer email + admin email (sinhtx@gmail.com)  
**Subject:** Your Seasonal Fruit Farm Order #[ORDER_ID] Approved  
**Body (HTML):**
- Order ID & approval date/time
- Itemized order breakdown:
  - Product name, quantity, unit price, line total
  - Subtotal
  - **Total amount charged**
- Shipping address (formatted: name, address, city, state, zip)
- Expected delivery timeline ("Ships within 24 hours")
- Message: "Thank you for your order! We'll ship your fresh mangoes as soon as possible."
- Contact info: "Questions? Reply to this email"

### Cancellation Email
**To:** customer email + admin email (sinhtx@gmail.com)  
**Subject:** Your Seasonal Fruit Farm Order #[ORDER_ID] Cancelled  
**Body (HTML):**
- Order ID & cancellation date/time
- **Reason for cancellation:** [admin's reason]
- Items that were ordered (name, quantity, price)
- **Refund amount** (total)
- Refund timeline: "Refund will appear in your account within 3-5 business days"
- Contact info: "If you have questions about this cancellation, please reply to this email"

---

## 4. Stripe Integration

### Payment Capture (Approve Flow)

```
Order Status: pending_approval
Stripe Intent Status: requires_payment_method (no funds captured yet)
                        ↓
Admin clicks "Approve Order"
                        ↓
Dialog: "Capture $[amount]?"
                        ↓
Admin confirms
                        ↓
Server action calls: stripe.paymentIntents.capture(paymentIntentId)
                        ↓
Success: Funds captured, held in Stripe account
  → Update order status: pending_approval → approved
  → Create audit log entry
  → Send approval email
  → Return success
  
Failure: Stripe error (card declined, invalid intent, etc.)
  → Order remains pending_approval
  → Return error to admin UI
  → No audit log entry, no email sent
```

### Payment Hold Release (Cancel Flow)

```
Order Status: pending_approval
Stripe Intent Status: requires_action (authorization hold placed)
                        ↓
Admin clicks "Cancel Order"
                        ↓
Prompt: "Enter rejection reason:"
                        ↓
Admin enters reason (e.g., "Out of stock", "Customer requested")
                        ↓
Dialog: "Release hold and notify customer?"
                        ↓
Admin confirms
                        ↓
Server action calls: stripe.paymentIntents.cancel(paymentIntentId)
                        ↓
Success: Hold released, funds freed
  → Update order status: pending_approval → cancelled
  → Create audit log entry with reason
  → Send cancellation email with reason
  → Return success
  
Failure: Stripe error
  → Order remains pending_approval
  → Return error to admin UI
  → No audit log entry, no email sent
```

---

## 5. Error Handling & Resilience

### Stripe Errors (BLOCKING)
- Any Stripe API error blocks the operation
- Order status is NOT updated
- Audit log entry is NOT created
- Email is NOT sent
- Admin sees specific error message: "Failed to capture payment: [Stripe error detail]"
- Order remains `pending_approval` for retry

### Email Service Errors (NON-BLOCKING)
- If Resend API fails, order status update and audit log are already complete
- Email failure is logged to console/error tracking
- Admin sees success message (order approved/cancelled)
- Order status is correct even though email didn't send
- Admin can manually send email later if needed

### Database Errors (BLOCKING)
- If order update or audit log insert fails, operation is aborted
- Stripe operation is already completed (can't undo)
- Admin sees error and should contact support
- Funds are captured/released but order status is inconsistent (needs manual intervention)

---

## 6. Data Model

### Order Status Values
- `pending_approval` — Order created, payment authorized but not captured, awaiting admin review
- `approved` — Admin approved, Stripe payment captured, order ready to ship
- `cancelled` — Admin rejected, Stripe hold released, customer notified

### Audit Log Entry
When order is approved or cancelled, create entry in `order_audit_log`:
```
{
  id: UUID (auto-generated),
  order_id: UUID (from order),
  previous_status: 'pending_approval',
  new_status: 'approved' | 'cancelled',
  changed_by: 'admin',
  reason: '[rejection reason]' (only for cancellations, else null),
  created_at: ISO timestamp
}
```

---

## 7. Environment Variables

Add to `.env.local`:

```bash
# Resend Email Service (Test Mode)
RESEND_API_KEY=re_test_...
ADMIN_EMAIL=sinhtx@gmail.com
```

---

## 8. Testing Strategy

### Unit Tests
1. **Email service tests** (`__tests__/lib/email/service.test.ts`)
   - Approval email composition (correct variables, proper formatting)
   - Cancellation email composition (includes reason)
   - Mock Resend API, verify correct payload sent
   - Test error handling (Resend failure returns error object)

2. **Server action tests** (`__tests__/app/actions/adminOrders.test.ts`)
   - `approveOrder`: succeeds when Stripe succeeds
   - `approveOrder`: fails gracefully when Stripe fails
   - `rejectOrder`: succeeds when Stripe succeeds
   - `rejectOrder`: fails gracefully when Stripe fails
   - Audit log entries created correctly
   - Email service called with correct parameters

### Integration Tests
1. **Full approval flow** (`__tests__/app/approval-workflow.integration.test.ts`)
   - Create test order in Supabase
   - Create Stripe payment intent (test mode)
   - Call `approveOrder` server action
   - Verify: Stripe payment captured, order status updated, audit log created, email queued

2. **Full cancellation flow**
   - Create test order in Supabase
   - Create Stripe payment intent (test mode)
   - Call `rejectOrder` server action with reason
   - Verify: Stripe hold released, order status updated, audit log created with reason, email queued

3. **Error handling**
   - Stripe failure: order stays pending, email not sent
   - Email failure: order updated, email failure logged
   - Invalid order ID: graceful error

---

## 9. Out of Scope (Future)

- Stripe webhook handlers (for real-time payment status sync)
- Email retry logic (currently send once, fail silently)
- Partial refunds (full refund only)
- Automatic approval rules based on order type/customer
- SMS notifications

---

## 10. Success Criteria

- ✅ Admin can approve pending order with confirmation dialog
- ✅ Admin can cancel pending order with reason + confirmation
- ✅ Stripe payment captured on approve, hold released on cancel
- ✅ Order status updates to `approved` or `cancelled`
- ✅ Audit log entries created for both operations
- ✅ Confirmation email sent to customer + admin on approve
- ✅ Cancellation email sent to customer + admin with reason on cancel
- ✅ Email failures don't block order status updates
- ✅ Stripe failures prevent order status updates
- ✅ All tests pass (unit + integration)
- ✅ No Stripe test payments left uncaptured/unreleased

