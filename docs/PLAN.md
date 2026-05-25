# Project Plan (Detailed)

This plan is the single source of truth for the Seasonal Fruit Farm MVP. Each part includes a checklist, tests, and success criteria.

## Part 1: Project Setup & Professional Product Catalog Page ✅ COMPLETE

### What Was Built

**Core Setup**
- ✅ Next.js 16.2 with TypeScript, Tailwind CSS v4, App Router
- ✅ Jest + React Testing Library configured with full test suite
- ✅ Professional agricultural-themed design (slate + amber colors)

**Data Architecture**
- ✅ **10 Premium Mango Varieties** with admin-controlled availability and seasonality flags:
  - Carrie, Mallika, Nam Dok Mai, Frorigan, Kent, Tommy Atkins, Ataulfo, Alphonso, Haden, Francis
  - Each variety has: name, description, image, price/lb, available flag, inSeason flag
  - Admin can enable/disable varieties or mark as in/out of season via `lib/mangoes.ts`
- ✅ **3 Predefined Mix Boxes** (curated, not customizable):
  - Small Mix (8 lbs, $45 - Carrie, Mallika, Kent)
  - Large Mix (18 lbs, $85 - 5 varieties)
  - Premium Selection (10 lbs, $75 - Alphonso, Ataulfo, Nam Dok Mai, Carrie)
  - Admin controls mix contents via `lib/mixBoxes.ts`

**UI Components** (4 new + 1 updated)
- ✅ `MangoCard.tsx` - Individual variety card with image, in-season badge, price
- ✅ `MangoVarietyGrid.tsx` - Responsive grid (5 cols desktop, 2 cols tablet, 1 col mobile)
- ✅ `MixBoxSelector.tsx` - Mix box showcase with prices and weights
- ✅ Updated `PricingToggle.tsx` - Now accepts `mangoName` and `pricePerPound` props for per-variety pricing
- ✅ Refactored `app/page.tsx` - Interactive state-based UI with selection panels

**Product Images**
- ✅ 13 custom SVG product illustrations in `public/images/mangoes/`
  - 10 mango varieties with gradient coloring
  - 3 mix box promotional images
- All images include fallback error handling (inline SVG placeholders)

**Comprehensive Testing** (30 tests, all passing)
- ✅ MangoCard: 8 tests (rendering, badges, pricing, interactivity)
- ✅ MangoVarietyGrid: 4 tests (filtering, grid display, callbacks)
- ✅ MixBoxSelector: 4 tests (rendering, pricing, selection)
- ✅ PricingToggle: 9 tests (pricing tiers, quantities, calculations)
- ✅ Home Page: 6 tests (layout, content, sections)

**Key Features**
- ✅ Click any mango → detail panel shows with pricing options (by pound, small box, large box)
- ✅ Click any mix box → detail panel shows fixed price + weight
- ✅ In-season mangoes display prominent "In Season" badge
- ✅ Unavailable varieties hidden from customer view (Francis excluded)
- ✅ Professional "Why Choose Us?" section highlighting organic, fresh delivery, seasonal excellence
- ✅ Responsive design works perfectly on mobile, tablet, desktop
- ✅ Admin controls catalog in **Supabase / admin UI**; public site reads via `lib/mangoes.ts` with **static fallback** when DB is unavailable (see `lib/mangoCatalogFallback.ts`).

### Files Created/Modified

**New Files (13)**
```
lib/
  ├── types.ts                    # MangoVariety, MixBox interfaces
  ├── mangoes.ts                  # 10 varieties with data + getAvailableMangoes()
  └── mixBoxes.ts                 # 3 mix boxes + getMixBoxById()

components/
  ├── MangoCard.tsx               # Single variety card
  ├── MangoVarietyGrid.tsx        # Responsive variety grid
  └── MixBoxSelector.tsx          # Mix box options

public/images/mangoes/            # 13 SVG files
  ├── carrie.svg, mallika.svg, nam-dok-mai.svg, etc.
  └── mix-box-small.svg, mix-box-large.svg, mix-box-premium.svg

__tests__/components/
  ├── MangoCard.test.tsx
  ├── MangoVarietyGrid.test.tsx
  └── MixBoxSelector.test.tsx
```

**Modified Files (3)**
```
app/page.tsx                       # Complete redesign with state-based UI
components/PricingToggle.tsx       # Added props for per-variety pricing
__tests__/app/page.test.tsx       # Updated for new page structure
```

**Test Results: 30/30 PASSING** ✅
- All components tested with real data (no mocks)
- Tests verify user interactions, filtering, rendering
- Tests confirm pricing calculations and state management

### Success Criteria Met
- ✅ Professional, enterprise-grade e-commerce UI (not "high school project")
- ✅ 10 mango varieties with images, descriptions, individual pricing
- ✅ Admin controls availability and seasonality via code
- ✅ Customers can select single variety OR predefined mix box
- ✅ Interactive detail panels show pricing and "Add to Cart" button
- ✅ All 30 tests pass
- ✅ Dev server runs without errors
- ✅ Responsive mobile-first design
- ✅ Custom SVG product imagery for all varieties and mixes

## Part 2: Database Schema & Geolocation Tracking — **DONE IN CODEBASE** *(verify your Supabase project)*

Checklist

- [x] Foundational SQL migrations documented under **`docs/migrations/`** (`PART2_SETUP.md`).
- [x] **`middleware.ts`** records client IP (`x-forwarded-for` → **`x-visitor-ip`** header).
- [x] **`app/actions/logTraffic.ts`** persists IP, UA, referrer, geo (when **`lib/geoip/GeoLite2-City.mmdb`** exists).
- [x] **`components/TrafficLogger.tsx`** invokes **`logTraffic`** on navigation (skips **`/admin`**, **`/api`**).

Operational note: Rows only appear once **`SUPABASE_SECRET_KEY`** (server) matches your app env and **`site_traffic`** RLS/policy allow inserts — confirm in Supabase.

Tests | Unit-level pieces covered; DB integration optional without live credentials.

Success criteria — [x] **When configured**, visits create **`site_traffic`** rows via the logger + middleware IP chain.

---

## Part 3: Checkout & Stripe Pre-Authorization — **DONE IN CODEBASE**

Checkout lives in **`app/actions/checkout.ts`** with Stripe manual capture patterns; orders land in **`fruit_orders`** as designed. Confirm with **`npm test`** targeting checkout integration suites.

---

## Part 4: Admin Dashboard & Authentication — **DONE IN CODEBASE**

- [x] **`/admin`** + **`/admin/login`** with Supabase auth gate in **`app/admin/layout.tsx`**.
- [x] Orders + **`/admin/fruits`** catalog wired to **`mango_varieties`** (migration 002).
- [x] Routing tests — **`__tests__/app/admin/admin-routing.test.ts`**.

---

## Part 5: Order Approval Workflow — **DONE IN CODEBASE**

- [x] Approve / cancel in **`app/actions/adminOrders.ts`** (Stripe capture/release + Resend messaging).
- [x] Integration coverage — **`__tests__/app/approval-workflow.integration.test.ts`**.

