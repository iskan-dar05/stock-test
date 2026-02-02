-- Migration: Comprehensive RLS Setup with Policies, Indexes, and Grants
-- This migration follows best practices:
-- 1. Creates policies first (they have no effect until RLS is enabled)
-- 2. Creates performance indexes
-- 3. Enables RLS on all tables
-- 4. Optionally restricts grants for better security
-- Run this in Supabase SQL Editor

-- ============================================================================
-- STEP 1: Create helper function for admin checks
-- ============================================================================
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = user_id
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- STEP 2: Drop existing policies (if any) to start fresh
-- ============================================================================
-- This ensures we have a clean slate
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
    AND tablename IN (
      'assets', 'subscriptions', 'earnings', 'orders',
      'categories', 'subscription_plans', 'contributor_levels',
      'admin_settings', 'tags', 'image_tags', 'profiles', 'downloads'
    )
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- ============================================================================
-- STEP 3: Create RLS Policies (they have no effect until RLS is enabled)
-- ============================================================================

-- PROFILES TABLE POLICIES
-- Users can read their own profile and public profiles
CREATE POLICY "Users can read profiles"
ON public.profiles
FOR SELECT
USING (
  id = auth.uid()
  OR public.is_admin(auth.uid())
  OR true  -- Public profiles are readable
);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (id = auth.uid());

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (id = auth.uid() OR public.is_admin(auth.uid()))
WITH CHECK (id = auth.uid() OR public.is_admin(auth.uid()));

-- Only admins can delete profiles
CREATE POLICY "Admins can delete profiles"
ON public.profiles
FOR DELETE
USING (public.is_admin(auth.uid()));

-- ASSETS TABLE POLICIES
CREATE POLICY "Public can read approved assets"
ON public.assets
FOR SELECT
USING (
  status = 'approved'
  OR contributor_id = auth.uid()
  OR public.is_admin(auth.uid())
);

CREATE POLICY "Contributors and admins can insert assets"
ON public.assets
FOR INSERT
WITH CHECK (
  contributor_id = auth.uid()
  OR public.is_admin(auth.uid())
);

CREATE POLICY "Contributors and admins can update assets"
ON public.assets
FOR UPDATE
USING (
  contributor_id = auth.uid()
  OR public.is_admin(auth.uid())
)
WITH CHECK (
  contributor_id = auth.uid()
  OR public.is_admin(auth.uid())
);

CREATE POLICY "Contributors and admins can delete assets"
ON public.assets
FOR DELETE
USING (
  contributor_id = auth.uid()
  OR public.is_admin(auth.uid())
);

-- SUBSCRIPTIONS TABLE POLICIES
CREATE POLICY "Users can read their own subscriptions"
ON public.subscriptions
FOR SELECT
USING (
  user_id = auth.uid()
  OR public.is_admin(auth.uid())
);

CREATE POLICY "Users can insert their own subscriptions"
ON public.subscriptions
FOR INSERT
WITH CHECK (
  user_id = auth.uid()
  OR public.is_admin(auth.uid())
);

CREATE POLICY "Users can update their own subscriptions"
ON public.subscriptions
FOR UPDATE
USING (
  user_id = auth.uid()
  OR public.is_admin(auth.uid())
)
WITH CHECK (
  user_id = auth.uid()
  OR public.is_admin(auth.uid())
);

CREATE POLICY "Admins can delete subscriptions"
ON public.subscriptions
FOR DELETE
USING (public.is_admin(auth.uid()));

-- EARNINGS TABLE POLICIES
CREATE POLICY "Contributors can read their own earnings"
ON public.earnings
FOR SELECT
USING (
  contributor_id = auth.uid()
  OR public.is_admin(auth.uid())
);

CREATE POLICY "System can insert earnings"
ON public.earnings
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update earnings"
ON public.earnings
FOR UPDATE
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete earnings"
ON public.earnings
FOR DELETE
USING (public.is_admin(auth.uid()));

-- ORDERS TABLE POLICIES
CREATE POLICY "Users can read their own orders"
ON public.orders
FOR SELECT
USING (
  buyer_id = auth.uid()
  OR public.is_admin(auth.uid())
);

CREATE POLICY "Authenticated users can insert orders"
ON public.orders
FOR INSERT
WITH CHECK (
  buyer_id = auth.uid()
  OR public.is_admin(auth.uid())
);

CREATE POLICY "Admins can update orders"
ON public.orders
FOR UPDATE
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete orders"
ON public.orders
FOR DELETE
USING (public.is_admin(auth.uid()));

-- CATEGORIES TABLE POLICIES
CREATE POLICY "Public can read categories"
ON public.categories
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage categories"
ON public.categories
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- SUBSCRIPTION_PLANS TABLE POLICIES
CREATE POLICY "Public can read subscription plans"
ON public.subscription_plans
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage subscription plans"
ON public.subscription_plans
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- CONTRIBUTOR_LEVELS TABLE POLICIES
CREATE POLICY "Public can read contributor levels"
ON public.contributor_levels
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage contributor levels"
ON public.contributor_levels
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- ADMIN_SETTINGS TABLE POLICIES
CREATE POLICY "Admins can manage admin settings"
ON public.admin_settings
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- TAGS TABLE POLICIES
CREATE POLICY "Public can read tags"
ON public.tags
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage tags"
ON public.tags
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- IMAGE_TAGS TABLE POLICIES
CREATE POLICY "Public can read image tags"
ON public.image_tags
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage image tags"
ON public.image_tags
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- DOWNLOADS TABLE POLICIES (if exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'downloads') THEN
    CREATE POLICY "Users can read their own downloads"
    ON public.downloads
    FOR SELECT
    USING (
      user_id = auth.uid()
      OR public.is_admin(auth.uid())
    );

    CREATE POLICY "Authenticated users can insert downloads"
    ON public.downloads
    FOR INSERT
    WITH CHECK (
      user_id = auth.uid()
      OR public.is_admin(auth.uid())
    );

    CREATE POLICY "Admins can manage downloads"
    ON public.downloads
    FOR UPDATE
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

    CREATE POLICY "Admins can delete downloads"
    ON public.downloads
    FOR DELETE
    USING (public.is_admin(auth.uid()));
  END IF;
END $$;

-- ============================================================================
-- STEP 4: Create Performance Indexes
-- ============================================================================

-- Assets indexes
CREATE INDEX IF NOT EXISTS idx_assets_status ON public.assets(status);
CREATE INDEX IF NOT EXISTS idx_assets_contributor ON public.assets(contributor_id);
CREATE INDEX IF NOT EXISTS idx_assets_created_at ON public.assets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_assets_type ON public.assets(type);
CREATE INDEX IF NOT EXISTS idx_assets_category ON public.assets(category) WHERE category IS NOT NULL;

-- Subscriptions indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan ON public.subscriptions(plan_id) WHERE plan_id IS NOT NULL;

-- Earnings indexes
CREATE INDEX IF NOT EXISTS idx_earnings_contributor ON public.earnings(contributor_id);
CREATE INDEX IF NOT EXISTS idx_earnings_created_at ON public.earnings(created_at DESC);

-- Orders indexes
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON public.orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_asset ON public.orders(asset_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_contributor_tier ON public.profiles(contributor_tier) WHERE contributor_tier IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_application_date ON public.profiles(application_date) WHERE application_date IS NOT NULL;

-- Categories indexes
CREATE INDEX IF NOT EXISTS idx_categories_active ON public.categories(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_categories_sort ON public.categories(sort_order);

-- Downloads indexes (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'downloads') THEN
    CREATE INDEX IF NOT EXISTS idx_downloads_user ON public.downloads(user_id);
    CREATE INDEX IF NOT EXISTS idx_downloads_asset ON public.downloads(asset_id);
    CREATE INDEX IF NOT EXISTS idx_downloads_created_at ON public.downloads(created_at DESC);
  END IF;
END $$;

-- ============================================================================
-- STEP 5: Enable Row Level Security on all tables
-- ============================================================================
-- Now that policies are in place, enable RLS
-- This is when the policies take effect

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributor_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.image_tags ENABLE ROW LEVEL SECURITY;

-- Enable RLS on downloads if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'downloads') THEN
    ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- ============================================================================
-- STEP 6: Optionally Restrict Grants (Enhanced Security)
-- ============================================================================
-- Revoke default public grants and grant only what's needed

-- Revoke all from public role
REVOKE ALL ON public.profiles FROM public;
REVOKE ALL ON public.assets FROM public;
REVOKE ALL ON public.subscriptions FROM public;
REVOKE ALL ON public.earnings FROM public;
REVOKE ALL ON public.orders FROM public;
REVOKE ALL ON public.categories FROM public;
REVOKE ALL ON public.subscription_plans FROM public;
REVOKE ALL ON public.contributor_levels FROM public;
REVOKE ALL ON public.admin_settings FROM public;
REVOKE ALL ON public.tags FROM public;
REVOKE ALL ON public.image_tags FROM public;

-- Grant SELECT to authenticated users (RLS policies will filter)
GRANT SELECT ON public.profiles TO authenticated;
GRANT SELECT ON public.assets TO authenticated;
GRANT SELECT ON public.subscriptions TO authenticated;
GRANT SELECT ON public.earnings TO authenticated;
GRANT SELECT ON public.orders TO authenticated;
GRANT SELECT ON public.categories TO authenticated;
GRANT SELECT ON public.subscription_plans TO authenticated;
GRANT SELECT ON public.contributor_levels TO authenticated;
GRANT SELECT ON public.tags TO authenticated;
GRANT SELECT ON public.image_tags TO authenticated;

-- Grant INSERT/UPDATE/DELETE to authenticated (RLS policies will filter)
GRANT INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.assets TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.subscriptions TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.earnings TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.subscription_plans TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.contributor_levels TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.admin_settings TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.tags TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.image_tags TO authenticated;

-- Grant public read access to public tables (categories, plans, levels, tags)
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT SELECT ON public.subscription_plans TO anon, authenticated;
GRANT SELECT ON public.contributor_levels TO anon, authenticated;
GRANT SELECT ON public.tags TO anon, authenticated;
GRANT SELECT ON public.image_tags TO anon, authenticated;
GRANT SELECT ON public.assets TO anon, authenticated;  -- For browsing approved assets

-- Handle downloads table if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'downloads') THEN
    REVOKE ALL ON public.downloads FROM public;
    GRANT SELECT, INSERT, UPDATE, DELETE ON public.downloads TO authenticated;
  END IF;
END $$;

-- ============================================================================
-- STEP 7: Verification Queries (Run these to verify setup)
-- ============================================================================

-- Check RLS is enabled on all tables
-- SELECT tablename, rowsecurity as rls_enabled
-- FROM pg_tables
-- WHERE schemaname = 'public'
-- AND tablename IN (
--   'profiles', 'assets', 'subscriptions', 'earnings', 'orders',
--   'categories', 'subscription_plans', 'contributor_levels',
--   'admin_settings', 'tags', 'image_tags'
-- )
-- ORDER BY tablename;

-- Check all policies are created
-- SELECT tablename, policyname, cmd as operation
-- FROM pg_policies
-- WHERE schemaname = 'public'
-- ORDER BY tablename, policyname;

-- Check indexes are created
-- SELECT tablename, indexname
-- FROM pg_indexes
-- WHERE schemaname = 'public'
-- AND indexname LIKE 'idx_%'
-- ORDER BY tablename, indexname;

