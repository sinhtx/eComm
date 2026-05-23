-- Add payment_method column to fruit_orders table
ALTER TABLE fruit_orders
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'zelle';

-- Create index for payment method queries
CREATE INDEX IF NOT EXISTS idx_fruit_orders_payment_method ON fruit_orders(payment_method);
