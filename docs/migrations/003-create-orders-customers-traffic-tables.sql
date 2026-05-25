-- Migration: Create customers, fruit_orders, order_audit_log, site_traffic tables
-- Date: 2026-05-24
-- Description: Core tables needed for checkout, admin order management, and traffic logging

-- ============================================================
-- CUSTOMERS
-- ============================================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  phone VARCHAR(50),
  address_line_1 VARCHAR(255),
  address_line_2 VARCHAR(255),
  city VARCHAR(255),
  state VARCHAR(100),
  zip_code VARCHAR(20),
  country_code VARCHAR(10) DEFAULT 'US',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

-- ============================================================
-- FRUIT ORDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS fruit_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  items JSONB NOT NULL DEFAULT '[]',
  total_price DECIMAL(10, 2) NOT NULL,
  order_status VARCHAR(50) NOT NULL DEFAULT 'pending_approval',
  payment_method VARCHAR(50),
  stripe_payment_intent_id VARCHAR(255),
  stripe_charge_id VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fruit_orders_customer_id ON fruit_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_fruit_orders_order_status ON fruit_orders(order_status);
CREATE INDEX IF NOT EXISTS idx_fruit_orders_created_at ON fruit_orders(created_at DESC);

-- ============================================================
-- ORDER AUDIT LOG
-- ============================================================
CREATE TABLE IF NOT EXISTS order_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES fruit_orders(id) ON DELETE CASCADE,
  previous_status VARCHAR(50),
  new_status VARCHAR(50) NOT NULL,
  changed_by VARCHAR(255),
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_audit_log_order_id ON order_audit_log(order_id);

-- ============================================================
-- SITE TRAFFIC
-- ============================================================
CREATE TABLE IF NOT EXISTS site_traffic (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address VARCHAR(45),
  user_agent TEXT,
  city VARCHAR(255),
  state VARCHAR(100),
  country_code VARCHAR(10),
  page_path VARCHAR(500),
  referrer TEXT,
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_site_traffic_visited_at ON site_traffic(visited_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_traffic_country_code ON site_traffic(country_code);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE fruit_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_traffic ENABLE ROW LEVEL SECURITY;

-- Authenticated users (admin logged in via magic link) can read all records
CREATE POLICY "authenticated_read_customers"
  ON customers FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated_read_fruit_orders"
  ON fruit_orders FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated_update_fruit_orders"
  ON fruit_orders FOR UPDATE TO authenticated USING (true);

CREATE POLICY "authenticated_read_order_audit_log"
  ON order_audit_log FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated_read_site_traffic"
  ON site_traffic FOR SELECT TO authenticated USING (true);

-- Note: INSERT/UPDATE for customers and fruit_orders goes through the server
-- action (supabaseServer / service role key) which bypasses RLS automatically.
