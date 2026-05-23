# Part 2 Setup Guide: Supabase & MaxMind GeoIP Configuration

This guide walks through setting up Supabase (PostgreSQL database) and MaxMind GeoIP for the Seasonal Fruit Farm e-commerce platform.

## Prerequisites

- [Supabase account](https://supabase.com/dashboard) (free tier available)
- [MaxMind account](https://www.maxmind.com/en/geolite2/signup) (free GeoLite2 database)
- Node.js 22+ and npm 10+

## Step 1: Create Supabase Project

### 1.1 Sign Up / Log In

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"** (if new) or **Sign In**
3. If new, create a free account using GitHub, Google, or email

### 1.2 Create New Project

1. In the Supabase Dashboard, click **"New Project"**
2. Fill in the form:
   - **Project name**: `seasonal-fruit-farm` (or any name you prefer)
   - **Database password**: Create a strong password (save it somewhere safe)
   - **Region**: Choose a region close to your users (e.g., us-east-1, eu-west-1)
   - **Pricing plan**: Select **Free** tier
3. Click **"Create new project"**
4. Wait for the project to initialize (2-5 minutes)

### 1.3 Get Project Credentials

Once your project is created:

1. Go to **Settings** → **API** in the left sidebar
2. Copy these values:
   - **Project URL** → Paste into `.env.local` as `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon (public) Key** → Paste into `.env.local` as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Go to **Settings** → **API** → **Service Role Secret**
   - **Service Role Secret** → Paste into `.env.local` as `SUPABASE_SERVICE_ROLE_KEY`

**⚠️ Important:** Never commit `.env.local` to git. It's already in `.gitignore`.

### 1.4 Update `.env.local`

Edit `C:\Users\v433521\myProject\eComm\.env.local`:

```bash
# Supabase Configuration (from your dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Step 2: Create Database Schema

### 2.1 Open SQL Editor

1. In your Supabase project dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Paste the entire SQL DDL below into the editor

### 2.2 Run SQL Schema DDL

Copy and paste the following SQL into the Supabase SQL Editor and **click "Run"**:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- site_traffic: Records every page visit with visitor geolocation data
-- ============================================================================
CREATE TABLE IF NOT EXISTS site_traffic (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ip_address VARCHAR(45) NOT NULL,
  user_agent TEXT NOT NULL,
  city VARCHAR(100),
  state VARCHAR(50),
  country_code VARCHAR(2),
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  page_path VARCHAR(255),
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT ip_not_null CHECK (ip_address IS NOT NULL)
);

-- Indexes for traffic analytics queries
CREATE INDEX IF NOT EXISTS idx_site_traffic_visited_at ON site_traffic(visited_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_traffic_city_state ON site_traffic(city, state);
CREATE INDEX IF NOT EXISTS idx_site_traffic_ip ON site_traffic(ip_address);

-- ============================================================================
-- customers: Customer profile data for orders and checkout
-- ============================================================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  address_line_1 VARCHAR(255),
  address_line_2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(10),
  country_code VARCHAR(2) DEFAULT 'US',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT email_not_null CHECK (email IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers(created_at DESC);

-- ============================================================================
-- fruit_orders: Individual orders with items and status
-- ============================================================================
CREATE TABLE IF NOT EXISTS fruit_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  order_status VARCHAR(50) DEFAULT 'pending_approval',
  items JSONB NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  stripe_payment_intent_id VARCHAR(255),
  stripe_charge_id VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT customer_id_not_null CHECK (customer_id IS NOT NULL),
  CONSTRAINT total_price_positive CHECK (total_price > 0)
);

CREATE INDEX IF NOT EXISTS idx_fruit_orders_customer_id ON fruit_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_fruit_orders_status ON fruit_orders(order_status);
CREATE INDEX IF NOT EXISTS idx_fruit_orders_created_at ON fruit_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fruit_orders_stripe_intent ON fruit_orders(stripe_payment_intent_id);

-- ============================================================================
-- order_audit_log: Audit trail for order status changes
-- ============================================================================
CREATE TABLE IF NOT EXISTS order_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES fruit_orders(id) ON DELETE CASCADE,
  previous_status VARCHAR(50),
  new_status VARCHAR(50) NOT NULL,
  changed_by VARCHAR(100),
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_order_audit_order_id ON order_audit_log(order_id);

-- ============================================================================
-- Enable Row-Level Security (RLS) - placeholder for Part 4 auth
-- ============================================================================
ALTER TABLE site_traffic ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE fruit_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_audit_log ENABLE ROW LEVEL SECURITY;

-- Allow public read-only access to site_traffic (analytics view)
CREATE POLICY "Allow public read site_traffic" ON site_traffic
  FOR SELECT USING (true);

-- Restrict customer and order access (Part 4 will add proper auth policies)
CREATE POLICY "No public access to customers" ON customers
  FOR ALL USING (false);

CREATE POLICY "No public access to fruit_orders" ON fruit_orders
  FOR ALL USING (false);

CREATE POLICY "No public access to order_audit_log" ON order_audit_log
  FOR ALL USING (false);
```

### 2.3 Verify Schema Creation

1. Go to **Exploration** (or **Tables**) in the Supabase dashboard
2. You should see four new tables:
   - `site_traffic`
   - `customers`
   - `fruit_orders`
   - `order_audit_log`
3. Click each table to verify columns are created correctly

---

## Step 3: Set Up MaxMind GeoIP Database

### 3.1 Create MaxMind Account

1. Go to [MaxMind GeoLite2 signup](https://www.maxmind.com/en/geolite2/signup)
2. Create a free account (click **"Sign Up"** on the right)
3. Fill in your details and verify your email
4. Log in to your MaxMind account

### 3.2 Download GeoLite2-City Database

1. In your MaxMind account, go to **Download** in the top menu
2. Look for **GeoLite2-City** (free tier)
3. Click **Download** for the `.mmdb` format
4. Extract the ZIP file
5. Find the file named `GeoLite2-City.mmdb` (typically ~100 MB)

### 3.3 Place Database in Project

1. Create the directory if it doesn't exist:
   ```bash
   mkdir -p lib/geoip
   ```

2. Copy `GeoLite2-City.mmdb` into `lib/geoip/` directory:
   ```bash
   cp /path/to/GeoLite2-City.mmdb lib/geoip/
   ```

3. Verify it was placed correctly:
   ```bash
   ls -lh lib/geoip/GeoLite2-City.mmdb
   ```

**Note:** The `.mmdb` file is already added to `.gitignore`, so it won't be committed to git.

---

## Step 4: Verify Local Setup

### 4.1 Check Environment Variables

```bash
# Should show your Supabase URL
echo $NEXT_PUBLIC_SUPABASE_URL

# Should show your Supabase anon key (first 20 chars)
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY | cut -c1-20

# Should show service role key exists (first 20 chars)
echo $SUPABASE_SERVICE_ROLE_KEY | cut -c1-20
```

### 4.2 Verify Database Connection (Manual)

1. Go to **SQL Editor** in Supabase
2. Run this test query:
   ```sql
   SELECT COUNT(*) FROM site_traffic;
   ```
3. Should return `0` (empty table)

---

## Step 5: Local Development

### 5.1 Start Dev Server

```bash
npm run dev
```

The server should start without errors. You should see:
```
▲ Next.js 16.2.6
```

### 5.2 Test Geolocation Logging

1. Visit `http://localhost:3000` in your browser
2. Open **Supabase Dashboard** → **SQL Editor**
3. Run:
   ```sql
   SELECT ip_address, city, state, page_path, visited_at 
   FROM site_traffic 
   ORDER BY visited_at DESC 
   LIMIT 10;
   ```
4. You should see your visits logged with city/state data (e.g., "San Francisco", "CA")

**Note:** If city/state are `NULL`, it means:
- You're on localhost (private IP) → Expected, private IPs return null
- Or MaxMind database isn't loaded correctly → Check `lib/geoip/GeoLite2-City.mmdb` exists

---

## Troubleshooting

### Issue: `.env.local` not loading

**Solution:**
- Make sure `.env.local` is in the project root: `C:\Users\v433521\myProject\eComm\.env.local`
- Restart dev server: `npm run dev`
- Next.js loads `.env.local` automatically on startup

### Issue: "Supabase connection failed"

**Solution:**
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct (check Supabase dashboard → Settings → API)
- Verify `SUPABASE_SERVICE_ROLE_KEY` is the full service role key (not truncated)
- Check that you're not behind a corporate proxy that blocks Supabase; configure npm proxy if needed

### Issue: MaxMind "database not found" error

**Solution:**
- Verify `lib/geoip/GeoLite2-City.mmdb` file exists: `ls lib/geoip/GeoLite2-City.mmdb`
- File size should be ~100 MB: `ls -lh lib/geoip/GeoLite2-City.mmdb`
- File path must be exact: `lib/geoip/GeoLite2-City.mmdb` (not `lib/geoip/GeoLite2-City/GeoLite2-City.mmdb`)

### Issue: localhost requests not logged in Supabase

**Solution:**
- This is expected! Localhost (127.0.0.1) is a private IP and is skipped by the GeoIP resolver.
- To test with a public IP:
  1. Use a VPN to route through a public IP
  2. Or use an online VPN service temporarily
  3. Then visit `http://localhost:3000`

### Issue: Tests fail with "jest.config" errors

**Solution:**
- Run: `npm test` directly
- The jest.config.ts should be correct after Phase 1
- If issues persist, check that `jest.config.ts` has the correct syntax

---

## Next Steps (Parts 3–5)

Once Part 2 is complete:

1. **Part 3: Checkout & Stripe** → Add checkout flow and payment processing
2. **Part 4: Admin Dashboard** → Secure admin route to view/approve orders
3. **Part 5: Order Approval Workflow** → Approve/cancel orders, send emails

All three parts will use the database schema and tables created in Part 2.

---

## Quick Reference: Environment Variables

| Variable | Value | Where to Get | Public/Secret |
|----------|-------|--------------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project-id.supabase.co` | Supabase → Settings → API → Project URL | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` (long string) | Supabase → Settings → API → Anon Key | Public |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` (long string) | Supabase → Settings → API → Service Role Key | **SECRET** |

**Remember:** Never commit `.env.local` to git. It's already in `.gitignore`.
