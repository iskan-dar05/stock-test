-- Migration: 002_add_rejected_reason.sql
-- Description: Add rejected_reason column to assets table for moderation
-- Created: 2025-12-12

-- Add rejected_reason column to assets table
ALTER TABLE public.assets
ADD COLUMN IF NOT EXISTS rejected_reason TEXT;

-- Add comment
COMMENT ON COLUMN public.assets.rejected_reason IS 'Reason for rejection when status is rejected';

