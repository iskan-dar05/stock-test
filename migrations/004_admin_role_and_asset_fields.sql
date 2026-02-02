-- Migration: Add admin role and additional asset fields
-- This migration adds role-based access control and enhances asset management

-- Add role column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'contributor', 'admin'));

-- Add additional fields to assets table
ALTER TABLE assets
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_assets_category ON assets(category);
CREATE INDEX IF NOT EXISTS idx_assets_is_featured ON assets(is_featured);
CREATE INDEX IF NOT EXISTS idx_assets_is_demo ON assets(is_demo);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Create admin settings table for platform configuration
CREATE TABLE IF NOT EXISTS admin_settings (
  id TEXT PRIMARY KEY DEFAULT 'main',
  marketplace_name TEXT DEFAULT 'StocksOcean',
  contact_email TEXT,
  max_upload_size_mb INTEGER DEFAULT 50,
  default_contributor_payout_percent INTEGER DEFAULT 40,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO admin_settings (id, marketplace_name, contact_email, max_upload_size_mb, default_contributor_payout_percent)
VALUES ('main', 'StocksOcean', 'admin@stocksocean.com', 50, 40)
ON CONFLICT (id) DO NOTHING;

-- Add comment for documentation
COMMENT ON COLUMN profiles.role IS 'User role: user, contributor, or admin';
COMMENT ON COLUMN assets.category IS 'Asset category for organization';
COMMENT ON COLUMN assets.is_demo IS 'Whether this is a demo/free asset';
COMMENT ON COLUMN assets.is_featured IS 'Whether this asset is featured on homepage';

