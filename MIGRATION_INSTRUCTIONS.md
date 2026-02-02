# Database Migration Instructions

## Step 1: Run the Subscription & Levels Migration

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Open the file `migrations/003_subscriptions_and_levels.sql`
4. Copy the entire SQL content
5. Paste it into the SQL Editor
6. Click **Run** to execute the migration

This migration will:
- Create `subscription_plans` table with Bronze, Silver, Gold, Enterprise plans
- Create `contributor_levels` table with Bronze, Silver, Gold, Platinum levels
- Add contributor status and level tracking to profiles table
- Create automatic level update triggers
- Insert default plans and levels

## Step 2: Verify Migration

After running the migration, verify the tables were created:

```sql
-- Check subscription plans
SELECT * FROM subscription_plans;

-- Check contributor levels
SELECT * FROM contributor_levels;

-- Check profiles table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles';
```

## Step 3: Apply Contributor Status to Existing Users (Optional)

If you have existing users who should be contributors:

```sql
-- Approve existing contributors (replace with actual user IDs)
UPDATE profiles 
SET contributor_status = 'approved', 
    contributor_level_id = 'bronze'
WHERE id IN ('user-id-1', 'user-id-2');
```

## Important Notes

- The migration includes a trigger that automatically updates contributor levels when assets are approved
- Contributor levels are calculated based on:
  - Number of approved assets
  - Total earnings from sales
- Revenue share percentages:
  - Bronze: 40%
  - Silver: 45%
  - Gold: 50%
  - Platinum: 55%

## Troubleshooting

If you encounter errors:
1. Make sure you're running the migration as a database admin
2. Check if tables already exist (the migration uses `IF NOT EXISTS`)
3. Verify foreign key constraints are correct
4. Check Supabase logs for detailed error messages

