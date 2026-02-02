-- Migration: Add subscriptions and contributor levels
-- Run this in Supabase SQL Editor

-- Add subscription plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  original_price_monthly DECIMAL(10, 2) NOT NULL,
  original_price_yearly DECIMAL(10, 2),
  first_month_discount_percent INTEGER DEFAULT 0,
  features JSONB DEFAULT '[]'::jsonb,
  is_popular BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add contributor levels table
CREATE TABLE IF NOT EXISTS contributor_levels (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  min_assets INTEGER DEFAULT 0,
  min_earnings DECIMAL(10, 2) DEFAULT 0,
  revenue_share_percent INTEGER NOT NULL,
  benefits JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add contributor_status to profiles (or create profiles table if it doesn't exist)
DO $$ 
BEGIN
  -- Check if profiles table exists, if not create it
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
    CREATE TABLE profiles (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      username TEXT,
      avatar_url TEXT,
      contributor_status TEXT DEFAULT 'pending' CHECK (contributor_status IN ('pending', 'approved', 'rejected')),
      contributor_level_id TEXT REFERENCES contributor_levels(id),
      total_earnings DECIMAL(10, 2) DEFAULT 0,
      total_assets INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  ELSE
    -- Add columns if profiles table exists
    ALTER TABLE profiles 
    ADD COLUMN IF NOT EXISTS contributor_status TEXT DEFAULT 'pending' CHECK (contributor_status IN ('pending', 'approved', 'rejected')),
    ADD COLUMN IF NOT EXISTS contributor_level_id TEXT REFERENCES contributor_levels(id),
    ADD COLUMN IF NOT EXISTS total_earnings DECIMAL(10, 2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS total_assets INTEGER DEFAULT 0;
  END IF;
END $$;

-- Update subscriptions table to include plan_id
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS plan_id TEXT REFERENCES subscription_plans(id),
ADD COLUMN IF NOT EXISTS first_month_discount_applied BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS discount_end_date TIMESTAMPTZ;

-- Insert default subscription plans
INSERT INTO subscription_plans (id, name, description, original_price_monthly, original_price_yearly, first_month_discount_percent, features, is_popular) VALUES
('bronze', 'Bronze', 'Perfect for individuals and small projects', 15.00, 150.00, 33, 
 '["Access to images, videos, 3D objects", "High-res downloads", "Commercial license", "Standard support"]'::jsonb, 
 false),
('silver', 'Silver', 'Best for professionals and growing teams', 25.00, 250.00, 20,
 '["Everything in Bronze", "Unlimited downloads", "Team management", "Secure storage", "Priority support"]'::jsonb,
 true),
('gold', 'Gold', 'For agencies and large teams', 50.00, 500.00, 20,
 '["Everything in Silver", "Featured listing", "Newsletter exposure", "API access", "Priority support"]'::jsonb,
 false),
('enterprise', 'Enterprise', 'Custom solutions for large organizations', 0, 0, 0,
 '["Everything in Gold", "Legal rights", "SSO integration", "Dedicated support", "Custom SLA"]'::jsonb,
 false)
ON CONFLICT (id) DO NOTHING;

-- Insert contributor levels
INSERT INTO contributor_levels (id, name, min_assets, min_earnings, revenue_share_percent, benefits) VALUES
('bronze', 'Bronze', 0, 0, 40, 
 '["Badge only", "Optional homepage listing"]'::jsonb),
('silver', 'Silver', 21, 500, 45,
 '["Badge", "Homepage feature"]'::jsonb),
('gold', 'Gold', 51, 2000, 50,
 '["Badge", "Newsletter feature", "Homepage feature"]'::jsonb),
('platinum', 'Platinum', 100, 5000, 55,
 '["Badge", "Personal account manager", "Featured carousel", "Newsletter feature"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Create function to update contributor level based on assets and earnings
CREATE OR REPLACE FUNCTION update_contributor_level()
RETURNS TRIGGER AS $$
DECLARE
  new_level_id TEXT;
  asset_count INTEGER;
  total_earned DECIMAL(10, 2);
BEGIN
  -- Get contributor stats
  SELECT 
    COUNT(*)::INTEGER,
    COALESCE(SUM(price), 0)
  INTO asset_count, total_earned
  FROM assets
  WHERE contributor_id = NEW.contributor_id AND status = 'approved';
  
  -- Find appropriate level
  SELECT id INTO new_level_id
  FROM contributor_levels
  WHERE (min_assets <= asset_count OR min_assets = 0)
    AND (min_earnings <= total_earned OR min_earnings = 0)
  ORDER BY min_assets DESC, min_earnings DESC
  LIMIT 1;
  
  -- Update profile
  UPDATE profiles
  SET 
    contributor_level_id = new_level_id,
    total_assets = asset_count,
    total_earnings = total_earned,
    updated_at = NOW()
  WHERE id = NEW.contributor_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update contributor level
DROP TRIGGER IF EXISTS trigger_update_contributor_level ON assets;
CREATE TRIGGER trigger_update_contributor_level
AFTER INSERT OR UPDATE OF status ON assets
FOR EACH ROW
WHEN (NEW.status = 'approved')
EXECUTE FUNCTION update_contributor_level();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_contributor_status ON profiles(contributor_status);
CREATE INDEX IF NOT EXISTS idx_profiles_contributor_level ON profiles(contributor_level_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_id ON subscriptions(plan_id);

