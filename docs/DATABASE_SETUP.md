# Database Setup Guide: Mango Varieties & Images

This document provides step-by-step instructions to set up the Supabase database schema for the fruit management system.

## Overview

Two tables are created:
- **mango_varieties**: Stores mango product information (name, description, price, availability, seasonality)
- **mango_images**: Stores image metadata linked to mango varieties (storage path, filename, upload timestamp)

Plus one storage bucket:
- **mango-images**: Public bucket for storing mango product images

## Prerequisites

- Supabase account with an active project
- Access to the Supabase dashboard (https://app.supabase.com)
- Database connection details available in project settings

## Step 1: Run the Migration SQL

### Option A: Using Supabase Dashboard (Recommended for Initial Setup)

1. Go to **https://app.supabase.com** and log in
2. Select your project
3. Navigate to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy the entire contents of `docs/migrations/002-create-mango-varieties-tables.sql`
6. Paste into the SQL editor
7. Click **Run** (or press Ctrl+Enter)
8. Wait for the query to complete successfully

### Option B: Using Supabase CLI

```bash
# Login to Supabase (if not already logged in)
supabase login

# Link to your project
supabase link --project-ref <your-project-ref>

# Execute the migration
supabase db push
```

(Note: The CLI approach requires the migration file to be in `supabase/migrations/` directory. For now, use Option A via the dashboard.)

## Step 2: Verify Tables Were Created

1. In the Supabase dashboard, go to **Database** → **Tables**
2. Confirm you see:
   - ✓ `mango_varieties`
   - ✓ `mango_images`
3. Click on `mango_varieties` and verify columns:
   - id, name, description, price_per_pound, available, in_season, coming_soon_date, current_image_id, created_at, updated_at

## Step 3: Verify Initial Data Was Inserted

1. In the Supabase dashboard, go to **mango_varieties** table
2. You should see **9 rows** with these mango names:
   - Carrie (6.50, in_season: true, available: true)
   - Mallika (6.50, in_season: true, available: true)
   - Nam Dok Mai (7.50, in_season: false, available: true)
   - Frorigan (6.00, in_season: true, available: true)
   - Kent (6.50, in_season: true, available: true)
   - Tommy Atkins (5.50, in_season: true, available: true)
   - Ataulfo (8.00, in_season: false, available: true)
   - Alphonso (9.00, in_season: false, available: true)
   - Haden (6.50, in_season: false, available: true)

## Step 4: Create Storage Bucket for Images

### Via Supabase Dashboard

1. Go to **Storage** (left sidebar)
2. Click **Create new bucket**
3. Enter bucket name: `mango-images`
4. **IMPORTANT**: Toggle **Public bucket** to **ON** (allow public read access)
5. Click **Create bucket**

### Expected File Path Format

Images will be stored with this pattern:
```
mango-images/{mango-id}/{timestamp}-{filename}
```

Example:
```
mango-images/550e8400-e29b-41d4-a716-446655440000/2026-05-23T14-30-45-carrie-mango.jpg
```

## Step 5: Verify Storage Bucket

1. In **Storage**, click the `mango-images` bucket
2. Confirm:
   - ✓ Bucket name is `mango-images`
   - ✓ Public access is enabled (you should see a "Public" badge)
   - ✓ Bucket is empty (no files yet — images will be uploaded via admin UI in Task 3)

## Schema Details

### mango_varieties Table

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, auto-generated | Primary key |
| name | VARCHAR(255) | NOT NULL | Mango variety name |
| description | TEXT | - | Product description |
| price_per_pound | DECIMAL(10,2) | NOT NULL | Price per pound |
| available | BOOLEAN | DEFAULT true | Currently available for sale |
| in_season | BOOLEAN | DEFAULT false | Currently in season |
| coming_soon_date | TIMESTAMP TZ | nullable | When product becomes available |
| current_image_id | UUID | FK → mango_images.id | Latest/primary image |
| created_at | TIMESTAMP TZ | auto-set | Record creation time |
| updated_at | TIMESTAMP TZ | auto-set | Record update time |

**Indexes:**
- `idx_mango_varieties_available` — for filtering available varieties
- `idx_mango_varieties_in_season` — for filtering seasonal varieties
- `idx_mango_varieties_created_at` — for sorting by creation date

### mango_images Table

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, auto-generated | Primary key |
| mango_id | UUID | FK → mango_varieties.id, ON DELETE CASCADE | Link to mango variety |
| storage_path | VARCHAR(255) | NOT NULL | Path in Supabase Storage |
| file_name | VARCHAR(255) | NOT NULL | Original filename |
| uploaded_at | TIMESTAMP TZ | auto-set | Upload timestamp |
| deleted_at | TIMESTAMP TZ | nullable | Soft delete flag |

**Indexes:**
- `idx_mango_images_mango_id` — for querying images by mango variety
- `idx_mango_images_deleted_at` — for soft delete queries

**Foreign Key Constraints:**
- `mango_id` → `mango_varieties.id` with `ON DELETE CASCADE` (if variety is deleted, all images are deleted)
- `current_image_id` (in mango_varieties) → `mango_images.id` with `ON DELETE SET NULL` (if image is deleted, reference is cleared)

## Next Steps

After verification:
1. **Task 2**: Build server actions for CRUD operations on fruits and images
2. **Task 3**: Create admin UI for mango management (upload images, edit details)
3. **Task 4**: Update storefront components to fetch data from database
4. **Task 5**: End-to-end testing

## Troubleshooting

### Migration Fails with "Table Already Exists"

This is normal if you've run the migration before. The SQL includes `IF NOT EXISTS` clauses. If you need to reset:

```sql
-- CAUTION: This deletes all data
DROP TABLE IF EXISTS mango_images CASCADE;
DROP TABLE IF EXISTS mango_varieties CASCADE;

-- Then re-run the migration
```

### No Data Shows Up After Running Migration

1. Verify the SQL executed without errors (check query result in dashboard)
2. Refresh the **mango_varieties** table view
3. If still empty, check the Supabase logs for errors

### Storage Bucket Not Found

Ensure:
- Bucket name is exactly `mango-images` (case-sensitive)
- Public access is enabled
- You're in the correct project

## Environment Variables

The `.env.local` file should already contain:
```
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_key>
```

These are used by the Next.js app to connect to Supabase.

---

**Status**: Ready for Task 2 (Server Actions) after verification.
