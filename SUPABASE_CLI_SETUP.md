# Supabase CLI Setup Guide

## ✅ Completed Steps

1. ✅ Supabase CLI initialized (`supabase init`)
2. ✅ Migration file copied to `supabase/migrations/001_init.sql`

## 🔧 Remaining Steps (Manual)

### Step 1: Login to Supabase CLI

Open a terminal and run:

```bash
cd C:\Users\MSI\sov1cursor
supabase login
```

This will open your browser to authenticate. After successful login, you'll be able to link your project.

### Step 2: Link Your Project

Once logged in, link your Supabase project:

```bash
supabase link --project-ref hwulgzdnltvudonxwffs
```

You'll be prompted to enter your database password. You can find this in your Supabase dashboard under **Settings > Database**.

### Step 3: Apply Migrations

After linking, you can apply migrations using:

```bash
# Apply all pending migrations
supabase db push

# Or apply a specific migration
supabase migration up
```

## 📁 Project Structure

Your Supabase CLI setup:
```
sov1cursor/
├── supabase/
│   ├── config.toml          # Supabase CLI configuration
│   └── migrations/
│       └── 001_init.sql     # Your migration file
└── migrations/              # Original location (kept for reference)
    └── 001_init.sql
```

## 🚀 Using Supabase CLI

### Common Commands

```bash
# Check migration status
supabase migration list

# Create a new migration
supabase migration new migration_name

# Apply migrations
supabase db push

# Reset database (⚠️ WARNING: Deletes all data)
supabase db reset

# Generate TypeScript types
supabase gen types typescript --linked > types/supabase.ts
```

### Generate Updated TypeScript Types

After applying migrations, regenerate your TypeScript types:

```bash
supabase gen types typescript --linked > types/supabase.ts
```

## 📝 Notes

- The migration has already been applied via MCP server, so `supabase db push` will show that migrations are up to date
- Future migrations should be created in `supabase/migrations/` directory
- Migration files are automatically named with timestamps by Supabase CLI

## 🔗 Useful Links

- [Supabase CLI Documentation](https://supabase.com/docs/guides/cli)
- [Supabase Dashboard](https://supabase.com/dashboard/project/hwulgzdnltvudonxwffs)

