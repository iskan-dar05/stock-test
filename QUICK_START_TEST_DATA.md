# Quick Start: Add 10 Test Images

## Method 1: Using SQL Script (Recommended - 2 minutes)

1. **Open Supabase Dashboard:**
   - Go to https://supabase.com/dashboard
   - Select your project
   - Click on **SQL Editor** in the left sidebar

2. **Run the SQL Script:**
   - Open the file `scripts/seed-10-test-assets.sql`
   - Copy the entire SQL content
   - Paste it into the SQL Editor
   - Click **Run** (or press Ctrl+Enter)

3. **Verify:**
   - The script will automatically:
     - Find your first user
     - Insert 10 test assets with real Unsplash image URLs
     - Set them all to "approved" status
     - Add realistic view/download counts

4. **Check Results:**
   - Go to **Table Editor** → `assets` table
   - You should see 10 new assets
   - Visit `/browse` on your website to see them!

## Method 2: Manual Upload (5-10 minutes)

1. **Sign up/Login:**
   - Go to `/auth/signup` and create an account
   - Or login at `/auth/signin`

2. **Apply as Contributor:**
   - Go to `/become-contributor`
   - Click "Apply Now"
   - Wait for admin approval (or approve yourself in `/admin/dashboard`)

3. **Upload Assets:**
   - Go to `/contributor/upload`
   - Upload 10 images from Unsplash:
     - Visit https://unsplash.com
     - Search for: "abstract gradient", "office workspace", "mountain landscape", "city night", "coffee", "beach", "ui design", "nature", "product photography"
     - Download 10 different images
     - Upload each one with title, description, tags, and price

4. **Approve Assets (Admin):**
   - Go to `/admin/dashboard`
   - Approve all pending assets

## Method 3: Direct Database Insert (Advanced)

If you have database access, you can directly insert assets using the Supabase client or SQL.

## Test Images URLs (Already in SQL Script)

The SQL script uses these high-quality Unsplash images:
1. Abstract Blue Gradient - `photo-1557683316-973673baf926`
2. Office Workspace - `photo-1497366216548-37526070297c`
3. Mountain Sunset - `photo-1506905925346-21bda4d32df4`
4. UI Mockup - `photo-1460925895917-afdab827c52f`
5. City Night - `photo-1514565131-fce0801e5785`
6. Coffee Cup - `photo-1511920170033-f8396924c348`
7. Tropical Beach - `photo-1507525428034-b723cf961d3e`
8. Abstract Motion - `photo-1618005182384-a83a8bd57fbe`
9. Nature Time-lapse - `photo-1441974231531-c6227db76b6e`
10. Modern Chair - `photo-1506439773649-6e0eb8cfb237`

## After Adding Test Data

1. **Visit Browse Page:**
   - Go to `/browse` to see all 10 assets in a grid

2. **Test Filters:**
   - Filter by type (image/video/3D)
   - Filter by price range
   - Sort by different options

3. **View Asset Details:**
   - Click on any asset to see the detail page
   - Check related assets section

4. **Test Search:**
   - Use the search bar in the header
   - Search for keywords like "abstract", "nature", "office"

## Troubleshooting

**No assets showing?**
- Check that assets have `status = 'approved'`
- Verify the user ID exists in `auth.users`
- Check browser console for errors

**Images not loading?**
- Unsplash URLs should work, but if blocked, you can upload actual files to Supabase Storage
- Update `preview_path` in the database to point to your storage URLs

**Need more test data?**
- Run the SQL script multiple times (it uses `ON CONFLICT DO NOTHING` so it's safe)
- Or modify the script to create more assets

