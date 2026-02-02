# Database Migrations

This directory contains SQL migration files for the Supabase database.

## Migration Files

- `001_init.sql` - Initial schema setup with assets, orders, earnings, and subscriptions tables
- `002_add_rejected_reason.sql` - Adds rejected_reason field to assets table
- `003_subscriptions_and_levels.sql` - Adds subscription plans and contributor levels
- `004_admin_role_and_asset_fields.sql` - Adds admin role and additional asset fields
- `005_enable_rls_on_tables.sql` - Enables Row Level Security (RLS) on all public tables for security
- `006_create_rls_policies.sql` - Creates comprehensive RLS policies for all public tables
- `007_fix_rls_errors.sql` - Combined migration to fix RLS errors (enables RLS and creates policies)
- `008_comprehensive_rls_setup.sql` - **RECOMMENDED** Best practice RLS setup: creates policies first, adds indexes, then enables RLS, and restricts grants

## Running Migrations

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `001_init.sql`
5. Click **Run** to execute the migration

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Make sure you're logged in
supabase login

# Link to your project (if not already linked)
supabase link --project-ref hwulgzdnltvudonxwffs

# Apply the migration
supabase db push
```

Or apply a specific migration file:

```bash
supabase db execute --file migrations/001_init.sql
```

### Option 3: Using MCP Server (via Cursor)

The migration can be applied directly through the Supabase MCP server connection in Cursor.

### Option 4: Using psql (Direct Database Connection)

If you have direct database access:

```bash
psql -h db.hwulgzdnltvudonxwffs.supabase.co -U postgres -d postgres -f migrations/001_init.sql
```

## Migration Safety

The migration file uses `CREATE TABLE IF NOT EXISTS` and `CREATE INDEX IF NOT EXISTS` to ensure it's safe to run multiple times. If tables already exist, the migration will skip creating them but will still create any missing indexes.

## Recommended: Use Migration 008 for RLS Setup

**For new RLS setup, use `008_comprehensive_rls_setup.sql`** which follows best practices:
1. Creates policies first (no effect until RLS is enabled)
2. Creates performance indexes
3. Enables RLS on all tables
4. Restricts grants for enhanced security

See `APPLY_RLS_COMPREHENSIVE.md` for detailed instructions.

## Verification

After running the migration, verify it was successful:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('assets', 'orders', 'earnings', 'subscriptions');

-- Check indexes
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN ('assets', 'orders', 'earnings', 'subscriptions');
```

## Notes

- The migration includes proper foreign key constraints
- All tables have appropriate indexes for performance
- The `assets.tags` column has a GIN index for efficient array searches
- Automatic timestamp updates are handled via triggers
- All tables reference `auth.users` for user relationships

## Security (RLS)

- Migration `005_enable_rls_on_tables.sql` enables Row Level Security on all public tables
- Migration `006_create_rls_policies.sql` creates comprehensive RLS policies for all tables
- **Important**: Run migration 005 first, then 006 to create the policies
- The policies follow these patterns:
  - **Public read**: categories, subscription_plans, contributor_levels, tags, approved assets
  - **User-specific**: Users can only access their own subscriptions, orders, and earnings
  - **Contributor-specific**: Contributors can manage their own assets and view their earnings
  - **Admin-only**: Admin settings and management operations require admin role
- A helper function `is_admin(user_id)` is created to check admin status

