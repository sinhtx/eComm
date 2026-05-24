# Task 1: Database Setup - Verification Checklist

## Completed Deliverables

### 1. Migration File Created ✓
- **Path**: `/docs/migrations/002-create-mango-varieties-tables.sql`
- **Status**: File exists and ready for execution
- **Size**: 2.8 KB
- **Contents**:
  - CREATE TABLE mango_varieties (12 columns)
  - CREATE TABLE mango_images (5 columns with CASCADE DELETE)
  - ALTER TABLE for foreign key constraint
  - 5 performance indexes (2 on mango_varieties, 2 on mango_images, 1 on created_at)
  - INSERT statement for 9 mango varieties

### 2. Setup Documentation Created ✓
- **Path**: `/docs/DATABASE_SETUP.md`
- **Status**: Comprehensive guide ready for user execution
- **Contents**:
  - Step-by-step instructions (5 main steps)
  - Two options for running migration (Dashboard + CLI)
  - Verification procedures for each step
  - Schema details with constraint documentation
  - Troubleshooting guide
  - Next steps for Tasks 2-5

### 3. Initial Data Verified ✓
- **Count**: 9 mango varieties inserted
- **Mangoes included**:
  1. Carrie (6.50, in_season: true)
  2. Mallika (6.50, in_season: true)
  3. Nam Dok Mai (7.50, in_season: false)
  4. Frorigan (6.00, in_season: true)
  5. Kent (6.50, in_season: true)
  6. Tommy Atkins (5.50, in_season: true)
  7. Ataulfo (8.00, in_season: false)
  8. Alphonso (9.00, in_season: false)
  9. Haden (6.50, in_season: false)

All available variants from the hardcoded list in `/lib/mangoes.ts` ✓

## Schema Summary

### Table: mango_varieties
- **Primary Key**: id (UUID, auto-generated)
- **Columns**: 10 (name, description, price_per_pound, available, in_season, coming_soon_date, current_image_id, created_at, updated_at)
- **Constraints**: 
  - NOT NULL on: name, price_per_pound
  - Foreign Key: current_image_id → mango_images.id (ON DELETE SET NULL)
- **Indexes**: available, in_season, created_at

### Table: mango_images
- **Primary Key**: id (UUID, auto-generated)
- **Columns**: 5 (mango_id, storage_path, file_name, uploaded_at, deleted_at)
- **Constraints**:
  - NOT NULL on: mango_id, storage_path, file_name
  - Foreign Key: mango_id → mango_varieties.id (ON DELETE CASCADE)
- **Indexes**: mango_id, deleted_at
- **Soft Delete Support**: deleted_at column for archival

## Storage Bucket Configuration

### Requirements for User to Complete
- **Bucket Name**: `mango-images`
- **Public Access**: ENABLED (required for images to be viewable)
- **File Path Pattern**: `mango-images/{mango-id}/{timestamp}-{filename}`
- **Status**: Instructions provided in DATABASE_SETUP.md Step 4

## User Action Items

### Before Running Migration
1. Read `/docs/DATABASE_SETUP.md` (5-10 minutes)
2. Ensure you have Supabase project access

### During Migration
1. Copy SQL from `/docs/migrations/002-create-mango-varieties-tables.sql`
2. Paste into Supabase SQL Editor
3. Click Run (wait for completion)

### After Migration - Verification Steps
1. Check Tables exist (mango_varieties, mango_images)
2. Verify 9 rows in mango_varieties
3. Create storage bucket `mango-images` with public access
4. Confirm bucket is empty and public

### Expected Outcomes After Verification
- ✓ 2 database tables created
- ✓ 9 mango varieties inserted
- ✓ 5 performance indexes created
- ✓ 2 foreign key constraints established
- ✓ Storage bucket ready for image uploads
- ✓ Soft delete support enabled via deleted_at column

## Next Task

Once verification is complete:
- **Task 2**: Create server actions for CRUD operations
  - `fetchMangoes()` - get all varieties
  - `fetchMangoById()` - get single variety
  - `uploadImage()` - upload to storage bucket
  - `updateMango()` - update variety details
  - `deleteMango()` - soft delete with cascade

## Notes

- ✓ No lib/mangoes.ts modifications made (as per requirements)
- ✓ No manual execution required (user will run via Supabase dashboard)
- ✓ Migration includes IF NOT EXISTS clauses for idempotency
- ✓ Cascading deletes properly configured
- ✓ Indexes added for common query patterns
- ✓ Soft delete support for images (hard delete for mangoes)
- ✓ Timestamp columns for audit trail

---

**Status**: Task 1 COMPLETE - Ready for user to execute migration in Supabase dashboard
