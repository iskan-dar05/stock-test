-- Migration: Enable Row Level Security (RLS) on all public tables
-- This migration enables RLS on all tables that are exposed to PostgREST
-- to ensure proper security and data access control

-- Drop existing policy on image_tags if it exists (before enabling RLS)
DROP POLICY IF EXISTS "Image tags are viewable based on image visibility." ON public.image_tags;

-- Enable RLS on image_tags table
ALTER TABLE public.image_tags ENABLE ROW LEVEL SECURITY;

-- Enable RLS on tags table
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

-- Enable RLS on orders table
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Enable RLS on earnings table
ALTER TABLE public.earnings ENABLE ROW LEVEL SECURITY;

-- Enable RLS on subscriptions table
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Enable RLS on assets table
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

-- Enable RLS on admin_settings table
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Enable RLS on categories table
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Enable RLS on subscription_plans table
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- Enable RLS on contributor_levels table
ALTER TABLE public.contributor_levels ENABLE ROW LEVEL SECURITY;

