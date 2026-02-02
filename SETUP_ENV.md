# Environment Variables Setup

## Required Environment Variables

Your `.env.local` file needs the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://hwulgzdnltvudonxwffs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_UE5JKZPAebqK5kkp6YEqyQ_zYQIvIJC
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## How to Get Your Service Role Key

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project (hwulgzdnltvudonxwffs)
3. Navigate to **Settings** → **API**
4. Scroll down to find the **service_role** key (NOT the anon key)
5. Copy the service_role key
6. Replace `your-service-role-key-here` in your `.env.local` file

## Important Security Notes

⚠️ **NEVER commit the service_role key to git!**
- The `.env.local` file is already in `.gitignore`
- The service_role key bypasses Row Level Security (RLS)
- Only use it on the server-side (which we do in `lib/supabaseServer.ts`)

## After Adding the Key

1. Save the `.env.local` file
2. Restart your Next.js dev server:
   ```bash
   npm run dev
   ```
3. The admin panel should now work at `/admin/dashboard`

