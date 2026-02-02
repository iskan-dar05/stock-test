-- Migration: 001_init.sql
-- Description: Initial schema setup for assets, orders, earnings, and subscriptions
-- Created: 2025-12-12

-- Enable pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- ASSETS TABLE
-- ============================================================================
-- Stores marketplace assets (images, videos, etc.)
CREATE TABLE IF NOT EXISTS public.assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contributor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    preview_path TEXT,
    price NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    license TEXT DEFAULT 'standard' NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    views INTEGER DEFAULT 0 NOT NULL,
    downloads INTEGER DEFAULT 0 NOT NULL
);

-- ============================================================================
-- ORDERS TABLE
-- ============================================================================
-- Tracks purchase orders for assets
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID REFERENCES public.assets(id) ON DELETE SET NULL,
    buyer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    price_paid NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD' NOT NULL,
    payment_provider TEXT NOT NULL,
    provider_payment_id TEXT,
    status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- EARNINGS TABLE
-- ============================================================================
-- Tracks contributor earnings from orders
CREATE TABLE IF NOT EXISTS public.earnings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contributor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    amount NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SUBSCRIPTIONS TABLE
-- ============================================================================
-- Manages user subscriptions/plans
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    plan_id TEXT NOT NULL,
    status TEXT NOT NULL,
    started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    ends_at TIMESTAMPTZ
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Index on assets.created_at for efficient date-based queries
CREATE INDEX IF NOT EXISTS idx_assets_created_at ON public.assets(created_at DESC);

-- Index on assets.contributor_id for contributor queries
CREATE INDEX IF NOT EXISTS idx_assets_contributor_id ON public.assets(contributor_id);

-- Index on assets.status for filtering by status
CREATE INDEX IF NOT EXISTS idx_assets_status ON public.assets(status);

-- GIN index on assets.tags for efficient array/tag searches
CREATE INDEX IF NOT EXISTS idx_assets_tags_gin ON public.assets USING GIN(tags);

-- Index on orders.created_at for date-based queries
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- Index on orders.buyer_id for user order queries
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON public.orders(buyer_id);

-- Index on orders.asset_id for asset order queries
CREATE INDEX IF NOT EXISTS idx_orders_asset_id ON public.orders(asset_id);

-- Index on orders.status for filtering by status
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- Index on earnings.created_at for date-based queries
CREATE INDEX IF NOT EXISTS idx_earnings_created_at ON public.earnings(created_at DESC);

-- Index on earnings.contributor_id for contributor earnings queries
CREATE INDEX IF NOT EXISTS idx_earnings_contributor_id ON public.earnings(contributor_id);

-- Index on earnings.order_id for order-based queries
CREATE INDEX IF NOT EXISTS idx_earnings_order_id ON public.earnings(order_id);

-- Index on subscriptions.user_id for user subscription queries
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);

-- Index on subscriptions.created_at for date-based queries
CREATE INDEX IF NOT EXISTS idx_subscriptions_started_at ON public.subscriptions(started_at DESC);

-- Index on subscriptions.status for filtering by status
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at on assets table
DROP TRIGGER IF EXISTS update_assets_updated_at ON public.assets;
CREATE TRIGGER update_assets_updated_at
    BEFORE UPDATE ON public.assets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE public.assets IS 'Marketplace assets uploaded by contributors';
COMMENT ON TABLE public.orders IS 'Purchase orders for assets';
COMMENT ON TABLE public.earnings IS 'Contributor earnings from completed orders';
COMMENT ON TABLE public.subscriptions IS 'User subscription plans';

COMMENT ON COLUMN public.assets.status IS 'Asset approval status: pending, approved, or rejected';
COMMENT ON COLUMN public.assets.tags IS 'Array of tags for searching and categorization';
COMMENT ON COLUMN public.orders.status IS 'Order status: pending, completed, or failed';
COMMENT ON COLUMN public.subscriptions.status IS 'Subscription status (e.g., active, cancelled, expired)';

