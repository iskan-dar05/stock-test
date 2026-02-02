# Fix RLS Errors - Quick Guide

## How to Apply the Migrations

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Enable RLS on All Tables

Copy and paste the **entire contents** of `migrations/005_enable_rls_on_tables.sql` into the SQL Editor, then click **Run**.

This will:
- Drop the existing policy on `image_tags` (if it exists)
- Enable RLS on all 10 tables: `image_tags`, `tags`, `orders`, `earnings`, `subscriptions`, `assets`, `admin_settings`, `categories`, `subscription_plans`, `contributor_levels`

### Step 3: Create RLS Policies

1. Click **New Query** again
2. Copy and paste the **entire contents** of `migrations/006_create_rls_policies.sql` into the SQL Editor
3. Click **Run**

This will:
- Create the `is_admin()` helper function
- Create comprehensive RLS policies for all tables

### Step 4: Verify the Fix

Run this query to verify RLS is enabled on all tables:

```sql
SELECT 
  tablename, 
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
  'assets', 'subscriptions', 'earnings', 'orders', 
  'categories', 'subscription_plans', 'contributor_levels',
  'admin_settings', 'tags', 'image_tags'
)
ORDER BY tablename;
```

**Expected Result**: All tables should show `rls_enabled = true`

### Step 5: Check Policies

Run this query to see all created policies:

```sql
SELECT 
  tablename, 
  policyname,
  cmd as operation
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN (
  'assets', 'subscriptions', 'earnings', 'orders', 
  'categories', 'subscription_plans', 'contributor_levels',
  'admin_settings', 'tags', 'image_tags'
)
ORDER BY tablename, policyname;
```

**Expected Result**: You should see multiple policies (SELECT, INSERT, UPDATE, DELETE) for each table

## Troubleshooting

If you get an error about policies already existing:
- The migration already handles this with `DROP POLICY IF EXISTS`
- If you still get errors, you may need to manually drop conflicting policies first

If RLS is still showing as disabled:
- Make sure you ran Step 2 (005_enable_rls_on_tables.sql) successfully
- Check the Supabase logs for any error messages

## What These Migrations Do

1. **Enable RLS**: Turns on Row Level Security on all public tables
2. **Create Policies**: Defines who can read, insert, update, and delete data:
   - Public users can read approved assets and public data
   - Contributors can manage their own assets
   - Admins have full access to everything
   - Users can only access their own subscriptions, orders, and earnings

This ensures your database is secure and follows best practices!

