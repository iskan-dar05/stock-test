-- Migration: Fix RLS Errors - Enable RLS and Create Policies
-- This migration fixes all RLS security errors by enabling RLS on all tables
-- and creating comprehensive security policies
-- Run this in Supabase SQL Editor

-- ============================================================================
-- STEP 1: Drop existing policy on image_tags (if it exists)
-- ============================================================================
DROP POLICY IF EXISTS "Image tags are viewable based on image visibility." ON public.image_tags;

-- ============================================================================
-- STEP 2: Enable RLS on all public tables
-- ============================================================================
ALTER TABLE public.image_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributor_levels ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 3: Create helper function for admin checks
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
-- STEP 4: Create RLS Policies for all tables (with DROP IF EXISTS first)
-- ============================================================================

-- ASSETS TABLE POLICIES
DROP POLICY IF EXISTS "Assets read policy" ON public.assets;
CREATE POLICY "Assets read policy"
ON public.assets
FOR SELECT
USING (
  status = 'approved'
  OR contributor_id = auth.uid()
  OR public.is_admin(auth.uid())
);

DROP POLICY IF EXISTS "Contributors can insert assets" ON public.assets;
CREATE POLICY "Contributors can insert assets"
ON public.assets
FOR INSERT
WITH CHECK (
  contributor_id = auth.uid()
  OR public.is_admin(auth.uid())
);

DROP POLICY IF EXISTS "Assets update policy" ON public.assets;
CREATE POLICY "Assets update policy"
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

DROP POLICY IF EXISTS "Contributors can delete their own assets" ON public.assets;
CREATE POLICY "Contributors can delete their own assets"
ON public.assets
FOR DELETE
USING (
  contributor_id = auth.uid()
  OR public.is_admin(auth.uid())
);

-- SUBSCRIPTIONS TABLE POLICIES
DROP POLICY IF EXISTS "Users can read their own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can read their own subscriptions"
ON public.subscriptions
FOR SELECT
USING (
  user_id = auth.uid()
  OR public.is_admin(auth.uid())
);

DROP POLICY IF EXISTS "Users can insert their own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can insert their own subscriptions"
ON public.subscriptions
FOR INSERT
WITH CHECK (
  user_id = auth.uid()
  OR public.is_admin(auth.uid())
);

DROP POLICY IF EXISTS "Users can update their own subscriptions" ON public.subscriptions;
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

DROP POLICY IF EXISTS "Admins can delete subscriptions" ON public.subscriptions;
CREATE POLICY "Admins can delete subscriptions"
ON public.subscriptions
FOR DELETE
USING (public.is_admin(auth.uid()));

-- EARNINGS TABLE POLICIES
DROP POLICY IF EXISTS "Contributors can read their own earnings" ON public.earnings;
CREATE POLICY "Contributors can read their own earnings"
ON public.earnings
FOR SELECT
USING (
  contributor_id = auth.uid()
  OR public.is_admin(auth.uid())
);

DROP POLICY IF EXISTS "Admins can insert earnings" ON public.earnings;
CREATE POLICY "Admins can insert earnings"
ON public.earnings
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update earnings" ON public.earnings;
CREATE POLICY "Admins can update earnings"
ON public.earnings
FOR UPDATE
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can delete earnings" ON public.earnings;
CREATE POLICY "Admins can delete earnings"
ON public.earnings
FOR DELETE
USING (public.is_admin(auth.uid()));

-- ORDERS TABLE POLICIES
DROP POLICY IF EXISTS "Users can read their own orders" ON public.orders;
CREATE POLICY "Users can read their own orders"
ON public.orders
FOR SELECT
USING (
  buyer_id = auth.uid()
  OR public.is_admin(auth.uid())
);

DROP POLICY IF EXISTS "Authenticated users can insert orders" ON public.orders;
CREATE POLICY "Authenticated users can insert orders"
ON public.orders
FOR INSERT
WITH CHECK (
  buyer_id = auth.uid()
  OR public.is_admin(auth.uid())
);

DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
CREATE POLICY "Admins can update orders"
ON public.orders
FOR UPDATE
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can delete orders" ON public.orders;
CREATE POLICY "Admins can delete orders"
ON public.orders
FOR DELETE
USING (public.is_admin(auth.uid()));

-- CATEGORIES TABLE POLICIES
DROP POLICY IF EXISTS "Public can read categories" ON public.categories;
CREATE POLICY "Public can read categories"
ON public.categories
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Admins can insert categories" ON public.categories;
CREATE POLICY "Admins can insert categories"
ON public.categories
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update categories" ON public.categories;
CREATE POLICY "Admins can update categories"
ON public.categories
FOR UPDATE
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can delete categories" ON public.categories;
CREATE POLICY "Admins can delete categories"
ON public.categories
FOR DELETE
USING (public.is_admin(auth.uid()));

-- SUBSCRIPTION_PLANS TABLE POLICIES
DROP POLICY IF EXISTS "Public can read subscription plans" ON public.subscription_plans;
CREATE POLICY "Public can read subscription plans"
ON public.subscription_plans
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Admins can insert subscription plans" ON public.subscription_plans;
CREATE POLICY "Admins can insert subscription plans"
ON public.subscription_plans
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update subscription plans" ON public.subscription_plans;
CREATE POLICY "Admins can update subscription plans"
ON public.subscription_plans
FOR UPDATE
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can delete subscription plans" ON public.subscription_plans;
CREATE POLICY "Admins can delete subscription plans"
ON public.subscription_plans
FOR DELETE
USING (public.is_admin(auth.uid()));

-- CONTRIBUTOR_LEVELS TABLE POLICIES
DROP POLICY IF EXISTS "Public can read contributor levels" ON public.contributor_levels;
CREATE POLICY "Public can read contributor levels"
ON public.contributor_levels
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Admins can insert contributor levels" ON public.contributor_levels;
CREATE POLICY "Admins can insert contributor levels"
ON public.contributor_levels
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update contributor levels" ON public.contributor_levels;
CREATE POLICY "Admins can update contributor levels"
ON public.contributor_levels
FOR UPDATE
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can delete contributor levels" ON public.contributor_levels;
CREATE POLICY "Admins can delete contributor levels"
ON public.contributor_levels
FOR DELETE
USING (public.is_admin(auth.uid()));

-- ADMIN_SETTINGS TABLE POLICIES
DROP POLICY IF EXISTS "Admins can read admin settings" ON public.admin_settings;
CREATE POLICY "Admins can read admin settings"
ON public.admin_settings
FOR SELECT
USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can insert admin settings" ON public.admin_settings;
CREATE POLICY "Admins can insert admin settings"
ON public.admin_settings
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update admin settings" ON public.admin_settings;
CREATE POLICY "Admins can update admin settings"
ON public.admin_settings
FOR UPDATE
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can delete admin settings" ON public.admin_settings;
CREATE POLICY "Admins can delete admin settings"
ON public.admin_settings
FOR DELETE
USING (public.is_admin(auth.uid()));

-- TAGS TABLE POLICIES
DROP POLICY IF EXISTS "Public can read tags" ON public.tags;
CREATE POLICY "Public can read tags"
ON public.tags
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Admins can insert tags" ON public.tags;
CREATE POLICY "Admins can insert tags"
ON public.tags
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update tags" ON public.tags;
CREATE POLICY "Admins can update tags"
ON public.tags
FOR UPDATE
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can delete tags" ON public.tags;
CREATE POLICY "Admins can delete tags"
ON public.tags
FOR DELETE
USING (public.is_admin(auth.uid()));

-- IMAGE_TAGS TABLE POLICIES
DROP POLICY IF EXISTS "Public can read image tags" ON public.image_tags;
CREATE POLICY "Public can read image tags"
ON public.image_tags
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Admins can insert image tags" ON public.image_tags;
CREATE POLICY "Admins can insert image tags"
ON public.image_tags
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update image tags" ON public.image_tags;
CREATE POLICY "Admins can update image tags"
ON public.image_tags
FOR UPDATE
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can delete image tags" ON public.image_tags;
CREATE POLICY "Admins can delete image tags"
ON public.image_tags
FOR DELETE
USING (public.is_admin(auth.uid()));
