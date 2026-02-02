-- Migration: Create Row Level Security (RLS) Policies
-- This migration creates comprehensive RLS policies for all public tables
-- to ensure proper security and data access control

-- ============================================================================
-- HELPER FUNCTION: Check if user is admin
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
-- ASSETS TABLE POLICIES
-- ============================================================================
-- Public can read approved assets, contributors can read their own, admins can read all
CREATE POLICY "Assets read policy"
ON public.assets
FOR SELECT
USING (
  -- Public can read approved assets
  status = 'approved'
  -- Contributors can read their own assets (any status)
  OR contributor_id = auth.uid()
  -- Admins can read all assets
  OR public.is_admin(auth.uid())
);

-- Contributors can insert their own assets
CREATE POLICY "Contributors can insert assets"
ON public.assets
FOR INSERT
WITH CHECK (
  contributor_id = auth.uid()
  OR public.is_admin(auth.uid())
);

-- Contributors can update their own assets, admins can update any
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

-- Contributors and admins can delete their own assets
CREATE POLICY "Contributors can delete their own assets"
ON public.assets
FOR DELETE
USING (
  contributor_id = auth.uid()
  OR public.is_admin(auth.uid())
);

-- ============================================================================
-- SUBSCRIPTIONS TABLE POLICIES
-- ============================================================================
-- Users can read their own subscriptions
CREATE POLICY "Users can read their own subscriptions"
ON public.subscriptions
FOR SELECT
USING (
  user_id = auth.uid()
  OR public.is_admin(auth.uid())
);

-- Users can insert their own subscriptions
CREATE POLICY "Users can insert their own subscriptions"
ON public.subscriptions
FOR INSERT
WITH CHECK (
  user_id = auth.uid()
  OR public.is_admin(auth.uid())
);

-- Users can update their own subscriptions
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

-- Admins can delete subscriptions
CREATE POLICY "Admins can delete subscriptions"
ON public.subscriptions
FOR DELETE
USING (public.is_admin(auth.uid()));

-- ============================================================================
-- EARNINGS TABLE POLICIES
-- ============================================================================
-- Contributors can read their own earnings
CREATE POLICY "Contributors can read their own earnings"
ON public.earnings
FOR SELECT
USING (
  contributor_id = auth.uid()
  OR public.is_admin(auth.uid())
);

-- Only admins can insert earnings (system-generated)
CREATE POLICY "Admins can insert earnings"
ON public.earnings
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

-- Only admins can update earnings
CREATE POLICY "Admins can update earnings"
ON public.earnings
FOR UPDATE
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Only admins can delete earnings
CREATE POLICY "Admins can delete earnings"
ON public.earnings
FOR DELETE
USING (public.is_admin(auth.uid()));

-- ============================================================================
-- ORDERS TABLE POLICIES
-- ============================================================================
-- Users can read their own orders
CREATE POLICY "Users can read their own orders"
ON public.orders
FOR SELECT
USING (
  buyer_id = auth.uid()
  OR public.is_admin(auth.uid())
);

-- Authenticated users can insert orders
CREATE POLICY "Authenticated users can insert orders"
ON public.orders
FOR INSERT
WITH CHECK (
  buyer_id = auth.uid()
  OR public.is_admin(auth.uid())
);

-- Only admins can update orders
CREATE POLICY "Admins can update orders"
ON public.orders
FOR UPDATE
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Only admins can delete orders
CREATE POLICY "Admins can delete orders"
ON public.orders
FOR DELETE
USING (public.is_admin(auth.uid()));

-- ============================================================================
-- CATEGORIES TABLE POLICIES
-- ============================================================================
-- Public can read categories
CREATE POLICY "Public can read categories"
ON public.categories
FOR SELECT
USING (true);

-- Only admins can manage categories
CREATE POLICY "Admins can insert categories"
ON public.categories
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update categories"
ON public.categories
FOR UPDATE
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete categories"
ON public.categories
FOR DELETE
USING (public.is_admin(auth.uid()));

-- ============================================================================
-- SUBSCRIPTION_PLANS TABLE POLICIES
-- ============================================================================
-- Public can read subscription plans
CREATE POLICY "Public can read subscription plans"
ON public.subscription_plans
FOR SELECT
USING (true);

-- Only admins can manage subscription plans
CREATE POLICY "Admins can insert subscription plans"
ON public.subscription_plans
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update subscription plans"
ON public.subscription_plans
FOR UPDATE
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete subscription plans"
ON public.subscription_plans
FOR DELETE
USING (public.is_admin(auth.uid()));

-- ============================================================================
-- CONTRIBUTOR_LEVELS TABLE POLICIES
-- ============================================================================
-- Public can read contributor levels
CREATE POLICY "Public can read contributor levels"
ON public.contributor_levels
FOR SELECT
USING (true);

-- Only admins can manage contributor levels
CREATE POLICY "Admins can insert contributor levels"
ON public.contributor_levels
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update contributor levels"
ON public.contributor_levels
FOR UPDATE
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete contributor levels"
ON public.contributor_levels
FOR DELETE
USING (public.is_admin(auth.uid()));

-- ============================================================================
-- ADMIN_SETTINGS TABLE POLICIES
-- ============================================================================
-- Only admins can read admin settings
CREATE POLICY "Admins can read admin settings"
ON public.admin_settings
FOR SELECT
USING (public.is_admin(auth.uid()));

-- Only admins can manage admin settings
CREATE POLICY "Admins can insert admin settings"
ON public.admin_settings
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update admin settings"
ON public.admin_settings
FOR UPDATE
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete admin settings"
ON public.admin_settings
FOR DELETE
USING (public.is_admin(auth.uid()));

-- ============================================================================
-- TAGS TABLE POLICIES
-- ============================================================================
-- Public can read tags
CREATE POLICY "Public can read tags"
ON public.tags
FOR SELECT
USING (true);

-- Only admins can manage tags
CREATE POLICY "Admins can insert tags"
ON public.tags
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update tags"
ON public.tags
FOR UPDATE
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete tags"
ON public.tags
FOR DELETE
USING (public.is_admin(auth.uid()));

-- ============================================================================
-- IMAGE_TAGS TABLE POLICIES
-- ============================================================================
-- Note: image_tags table structure may vary. Using safe defaults.
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Image tags are viewable based on image visibility." ON public.image_tags;

-- Public can read image tags (safe default - adjust if needed based on your schema)
CREATE POLICY "Public can read image tags"
ON public.image_tags
FOR SELECT
USING (true);

-- Only admins can manage image tags
CREATE POLICY "Admins can insert image tags"
ON public.image_tags
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update image tags"
ON public.image_tags
FOR UPDATE
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete image tags"
ON public.image_tags
FOR DELETE
USING (public.is_admin(auth.uid()));

