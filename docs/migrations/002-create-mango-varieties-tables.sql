-- Migration: Create mango_varieties and mango_images tables
-- Date: 2026-05-23
-- Description: Create database schema for fruit management system

-- Create mango_varieties table
CREATE TABLE IF NOT EXISTS mango_varieties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price_per_pound DECIMAL(10, 2) NOT NULL,
  available BOOLEAN DEFAULT true,
  in_season BOOLEAN DEFAULT false,
  coming_soon_date TIMESTAMP WITH TIME ZONE,
  current_image_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create mango_images table
CREATE TABLE IF NOT EXISTS mango_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mango_id UUID NOT NULL REFERENCES mango_varieties(id) ON DELETE CASCADE,
  storage_path VARCHAR(255) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Add foreign key constraint from mango_varieties.current_image_id to mango_images.id
ALTER TABLE mango_varieties
ADD CONSTRAINT fk_mango_varieties_current_image_id
FOREIGN KEY (current_image_id) REFERENCES mango_images(id) ON DELETE SET NULL;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_mango_varieties_available ON mango_varieties(available);
CREATE INDEX IF NOT EXISTS idx_mango_varieties_in_season ON mango_varieties(in_season);
CREATE INDEX IF NOT EXISTS idx_mango_varieties_created_at ON mango_varieties(created_at);
CREATE INDEX IF NOT EXISTS idx_mango_images_mango_id ON mango_images(mango_id);
CREATE INDEX IF NOT EXISTS idx_mango_images_deleted_at ON mango_images(deleted_at);

-- Insert initial data: 9 available mango varieties
INSERT INTO mango_varieties (name, description, price_per_pound, available, in_season)
VALUES
  ('Carrie', 'Sweet, smooth tropical flavor with minimal fiber. Perfect for first-time mango lovers.', 6.50, true, true),
  ('Mallika', 'Rich, creamy texture with balanced sweetness and slight tang. A customer favorite.', 6.50, true, true),
  ('Nam Dok Mai', 'Golden-colored with floral notes and smooth, fiber-free flesh. Premium quality.', 7.50, true, false),
  ('Frorigan', 'Large, vibrant mango with sweet juice and aromatic flavor profile.', 6.00, true, true),
  ('Kent', 'Stringless, creamy flesh with delicate sweetness. Excellent for fresh eating.', 6.50, true, true),
  ('Tommy Atkins', 'Firm texture, good shipping quality, naturally sweet with slight tartness.', 5.50, true, true),
  ('Ataulfo', 'Small but mighty—dense, creamy, and intensely sweet. No fiber.', 8.00, true, false),
  ('Alphonso', 'The King of Mangoes—buttery texture, complex flavor, premium delicacy.', 9.00, true, false),
  ('Haden', 'Classic heritage variety, red-blushed skin, sweet and aromatic.', 6.50, true, false);
