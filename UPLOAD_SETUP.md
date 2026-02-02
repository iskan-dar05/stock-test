# Upload Flow Setup Guide

## Overview

The upload flow consists of:
1. **Frontend Component** (`components/UploadForm.tsx`) - Handles file selection, preview, and upload to Supabase Storage
2. **API Route** (`app/api/assets/create/route.ts`) - Server-side validation and database record creation
3. **Server Client** (`lib/supabaseServer.ts`) - Server-side Supabase client with service role key

## Prerequisites

### 1. Environment Variables

Add the following to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://hwulgzdnltvudonxwffs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_UE5JKZPAebqK5kkp6YEqyQ_zYQIvIJC
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**To get your Service Role Key:**
1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **Settings** > **API**
4. Copy the **service_role** key (⚠️ Keep this secret! Never expose it in client-side code)

### 2. Create Storage Bucket

You need to create a storage bucket named `assets` in Supabase:

#### Option A: Via Supabase Dashboard
1. Go to **Storage** in your Supabase Dashboard
2. Click **New bucket**
3. Name: `assets`
4. Public bucket: **Yes** (if you want public access to files)
   - Or **No** if you want to use signed URLs
5. File size limit: 50MB (or your preferred limit)
6. Allowed MIME types: Leave empty to allow all, or specify:
   - `image/*`
   - `video/mp4`
   - `model/gltf-binary`
   - `application/octet-stream`
7. Click **Create bucket**

#### Option B: Via SQL
Run this SQL in the Supabase SQL Editor:

```sql
-- Create the assets bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'assets',
  'assets',
  true, -- Set to false for private bucket
  52428800, -- 50MB in bytes
  ARRAY[]::text[] -- Empty array allows all types
);

-- Set up storage policies for contributors folder
-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload to their own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'assets' AND
  (storage.foldername(name))[1] = 'contributors' AND
  (storage.foldername(name))[2] = auth.uid()::text
);

-- Allow users to read their own files
CREATE POLICY "Users can read their own files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'assets' AND
  (storage.foldername(name))[1] = 'contributors' AND
  (storage.foldername(name))[2] = auth.uid()::text
);

-- Allow public read access (if bucket is public)
CREATE POLICY "Public can read assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'assets');
```

## File Upload Flow

### 1. User selects file
- Frontend validates file type (images, MP4, GLB)
- Validates file size (max 50MB)
- Creates preview for images

### 2. File uploads to Supabase Storage
- Path: `contributors/{userId}/{timestamp}-{filename}`
- Uses anon key (client-side)
- Shows upload progress

### 3. Asset record creation
- POST to `/api/assets/create` with metadata
- Server validates session and data
- Uses service role key to insert into database
- Status set to `pending` (requires admin approval)

## Supported File Types

- **Images**: JPG, JPEG, PNG, WebP, GIF
- **Videos**: MP4
- **3D Models**: GLB

## Storage Structure

```
assets/
└── contributors/
    └── {userId}/
        ├── 1234567890-image.jpg
        ├── 1234567891-video.mp4
        └── 1234567892-model.glb
```

## Security Considerations

1. **Service Role Key**: Never expose in client-side code. Only use in server-side API routes.
2. **Storage Policies**: Configure RLS policies to restrict access appropriately.
3. **File Validation**: Both client and server should validate file types and sizes.
4. **User Authentication**: All uploads require authenticated users.
5. **Path Validation**: Server validates that storage path matches the authenticated user.

## Testing

1. **Test file upload:**
   - Navigate to `/contributor/upload`
   - Select a file (image, video, or GLB)
   - Fill in the form
   - Submit and verify upload

2. **Test API endpoint:**
   ```bash
   curl -X POST http://localhost:3000/api/assets/create \
     -H "Content-Type: application/json" \
     -H "Cookie: your-session-cookie" \
     -d '{
       "title": "Test Asset",
       "type": "image",
       "storage_path": "contributors/user-id/test.jpg",
       "price": 10.00,
       "license": "standard"
     }'
   ```

## Troubleshooting

### "Storage bucket not found"
- Ensure the `assets` bucket exists in Supabase Storage
- Check bucket name matches exactly: `assets`

### "Unauthorized" error
- Verify user is logged in
- Check session cookie is being sent
- Verify service role key is set in `.env.local`

### "Invalid storage path" error
- Ensure storage path starts with `contributors/{userId}/`
- Verify the userId in the path matches the authenticated user

### File upload fails
- Check file size (max 50MB)
- Verify file type is supported
- Check storage bucket policies allow uploads
- Verify anon key has upload permissions

