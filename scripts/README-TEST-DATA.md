# Test Data Setup Guide

This guide will help you add test assets to your StocksOcean marketplace for testing purposes.

## Option 1: Using SQL Script (Recommended)

1. **Get a User ID:**
   - Go to your Supabase Dashboard
   - Navigate to Authentication > Users
   - Copy a user ID (or create a test user)

2. **Run the SQL Script:**
   - Go to SQL Editor in Supabase Dashboard
   - Open `scripts/seed-test-assets.sql`
   - Replace `(SELECT id FROM auth.users LIMIT 1)` with your actual user ID if needed
   - Run the script

3. **Upload Test Images (Optional):**
   - The script uses Unsplash placeholder URLs for previews
   - For better testing, you can upload actual images to Supabase Storage:
     - Go to Storage > assets bucket
     - Create folder: `contributors/test/`
     - Upload test images
     - Update the `storage_path` in the database to match your uploaded files

## Option 2: Using the Upload Form

1. **Sign up/Login:**
   - Create an account or login at `/auth/signin`

2. **Upload Assets:**
   - Go to `/contributor/upload`
   - Fill in the form and upload test images
   - Assets will be in "pending" status

3. **Approve Assets (Admin):**
   - Go to `/admin/dashboard`
   - Approve the pending assets

## Option 3: Quick Test Images

You can use these free image sources for testing:

- **Unsplash:** https://unsplash.com (Free high-quality photos)
- **Pexels:** https://pexels.com (Free stock photos)
- **Pixabay:** https://pixabay.com (Free images and videos)

### Recommended Test Images:

1. **Abstract/Background Images:**
   - Search: "abstract gradient", "colorful background"
   - Good for testing image previews

2. **Product Photos:**
   - Search: "product photography", "minimalist product"
   - Good for testing asset cards

3. **Nature/Landscape:**
   - Search: "mountain", "beach", "forest"
   - Good for variety

4. **Business/Office:**
   - Search: "modern office", "workspace"
   - Good for professional assets

## Test Data Features

The seed script creates:
- ✅ 12 test assets (mix of images, videos, 3D)
- ✅ Various prices ($8.99 - $34.99)
- ✅ Different tags for filtering
- ✅ Realistic view and download counts
- ✅ Approved status (ready to display)
- ✅ Different creation dates (for sorting tests)

## Notes

- Preview URLs use Unsplash placeholders - they will work for testing
- Storage paths are placeholders - update them if you upload actual files
- All assets are set to "approved" status for immediate visibility
- Adjust user IDs to match your actual users

## Troubleshooting

If assets don't appear:
1. Check that the `contributor_id` exists in `auth.users`
2. Verify the assets table has the correct structure
3. Check that `status = 'approved'` for assets to show in browse
4. Ensure Supabase Storage bucket 'assets' exists and is public

