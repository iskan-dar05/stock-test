# Apply RLS Migrations - Quick Guide

## Step 1: Enable RLS on Tables

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy and paste the entire contents of `migrations/005_enable_rls_on_tables.sql`
6. Click **Run** (or press Ctrl+Enter)

## Step 2: Create RLS Policies

1. In the same SQL Editor, click **New Query** again
2. Copy and paste the entire contents of `migrations/006_create_rls_policies.sql`
3. Click **Run** (or press Ctrl+Enter)

## Verification

After running both migrations, verify they were successful:

```sql
-- Check if RLS is enabled on tables
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
  'assets', 'subscriptions', 'earnings', 'orders', 
  'categories', 'subscription_plans', 'contributor_levels',
  'admin_settings', 'tags', 'image_tags'
);

-- Check if policies were created
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Check if is_admin function exists
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'is_admin';
```

## Expected Results

- All tables should have `rowsecurity = true`
- You should see multiple policies for each table (SELECT, INSERT, UPDATE, DELETE)
- The `is_admin` function should exist

## Troubleshooting

If you encounter errors:
1. Make sure you're running as a database admin
2. Check that all tables exist (run the earlier migrations first if needed)
3. If a policy already exists, the migration will fail - you may need to drop existing policies first
4. Check the Supabase logs for detailed error messages

