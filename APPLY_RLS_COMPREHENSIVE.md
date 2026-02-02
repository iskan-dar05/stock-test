# Comprehensive RLS Setup Guide

This guide walks you through applying Row Level Security (RLS) policies following best practices.

## Overview

The migration `008_comprehensive_rls_setup.sql` follows this approach:

1. **Create policies first** - Policies are created but have no effect until RLS is enabled
2. **Create performance indexes** - Optimize queries before enabling RLS
3. **Enable RLS** - Activate security policies on all tables
4. **Restrict grants** - Limit database access to authenticated users only

This approach minimizes downtime and ensures policies are ready before RLS takes effect.

## Step-by-Step Instructions

### Step 1: Backup Your Database (Recommended)

Before making any changes, create a backup:

1. Go to Supabase Dashboard → Settings → Database
2. Click "Create backup" or use the backup tool

### Step 2: Review the Migration

Open `migrations/008_comprehensive_rls_setup.sql` and review:
- Tables that will have RLS enabled
- Policies that will be created
- Indexes that will be added
- Grants that will be modified

### Step 3: Apply the Migration

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Open `migrations/008_comprehensive_rls_setup.sql`
6. Copy the **entire contents** of the file
7. Paste into the SQL Editor
8. Click **Run** to execute

### Step 4: Verify RLS is Enabled

Run this query to verify RLS is enabled on all tables:

```sql
SELECT 
  tablename, 
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
  'profiles', 'assets', 'subscriptions', 'earnings', 'orders',
  'categories', 'subscription_plans', 'contributor_levels',
  'admin_settings', 'tags', 'image_tags'
)
ORDER BY tablename;
```

**Expected Result**: All tables should show `rls_enabled = true`

### Step 5: Verify Policies are Created

Run this query to see all policies:

```sql
SELECT 
  tablename, 
  policyname,
  cmd as operation
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

**Expected Result**: You should see multiple policies (SELECT, INSERT, UPDATE, DELETE) for each table

### Step 6: Verify Indexes are Created

Run this query to check performance indexes:

```sql
SELECT 
  tablename, 
  indexname
FROM pg_indexes
WHERE schemaname = 'public'
AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;
```

**Expected Result**: You should see indexes for frequently queried columns

### Step 7: Test Your Application

1. **Test as anonymous user**:
   - Browse assets (should see approved assets only)
   - View categories, plans, levels (should work)
   - Try to access admin pages (should be blocked)

2. **Test as authenticated user**:
   - View your own profile
   - View your own subscriptions
   - View your own orders
   - Upload assets (if contributor)
   - View your earnings (if contributor)

3. **Test as admin**:
   - Access admin dashboard
   - Manage all tables
   - Approve/reject assets
   - Manage contributors

## What This Migration Does

### Policies Created

- **Profiles**: Users can read/update their own profile, admins can manage all
- **Assets**: Public can read approved assets, contributors can manage their own, admins can manage all
- **Subscriptions**: Users can manage their own, admins can manage all
- **Earnings**: Contributors can read their own, admins can manage all
- **Orders**: Users can read their own, admins can manage all
- **Categories**: Public read, admin manage
- **Subscription Plans**: Public read, admin manage
- **Contributor Levels**: Public read, admin manage
- **Admin Settings**: Admin only
- **Tags**: Public read, admin manage
- **Image Tags**: Public read, admin manage

### Indexes Created

Performance indexes on:
- `assets`: status, contributor_id, created_at, type, category
- `subscriptions`: user_id, status, plan_id
- `earnings`: contributor_id, created_at
- `orders`: buyer_id, asset_id, status, created_at
- `profiles`: role, contributor_tier, application_date
- `categories`: is_active, sort_order

### Grants Modified

- Revoked all public access
- Granted SELECT to authenticated users (filtered by RLS)
- Granted INSERT/UPDATE/DELETE to authenticated users (filtered by RLS)
- Granted public read access to public tables (categories, plans, levels, tags, approved assets)

## Troubleshooting

### Error: "policy already exists"

The migration includes `DROP POLICY IF EXISTS` statements, so this shouldn't happen. If it does:
1. Check if you've already run a similar migration
2. Manually drop the conflicting policy
3. Re-run the migration

### Error: "permission denied"

Make sure you're running the migration as a database admin (service role key).

### Application errors after migration

1. Check if RLS is enabled: Run the verification query in Step 4
2. Check if policies exist: Run the verification query in Step 5
3. Check application logs for specific RLS errors
4. Verify your service role key is being used for admin operations

### Performance issues

1. Check if indexes were created: Run the verification query in Step 6
2. Monitor query performance in Supabase Dashboard → Database → Query Performance
3. Add additional indexes if needed based on slow queries

## Rollback (If Needed)

If you need to rollback:

```sql
-- Disable RLS on all tables
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.earnings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributor_levels DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.image_tags DISABLE ROW LEVEL SECURITY;

-- Restore public grants (if needed)
GRANT ALL ON ALL TABLES IN SCHEMA public TO public;
```

**Note**: Only rollback if absolutely necessary. RLS is a critical security feature.

## Next Steps

After applying RLS:

1. Monitor application logs for any RLS-related errors
2. Test all user flows (anonymous, authenticated, contributor, admin)
3. Review query performance and add indexes if needed
4. Consider adding additional policies for specific use cases
5. Document any custom policies you add

## Security Notes

- RLS policies work in addition to application-level security
- Always use the service role key for admin operations on the server
- Never expose the service role key to the client
- Test policies thoroughly before deploying to production
- Keep policies simple and maintainable

