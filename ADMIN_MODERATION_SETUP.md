# Admin Moderation System Setup Guide

## Overview

The admin moderation system allows administrators to review and approve/reject pending assets. It includes:

1. **Admin Dashboard** - Server-side page displaying pending assets
2. **Approve API** - Endpoint to approve assets
3. **Reject API** - Endpoint to reject assets with optional reason
4. **Email Notifications** - Optional email notifications to contributors

## Features

- ✅ View all pending assets with contributor information
- ✅ Approve assets (updates status to 'approved')
- ✅ Reject assets with optional rejection reason
- ✅ Email notifications to contributors (optional)
- ✅ Real-time UI updates after moderation actions
- ✅ Asset preview for images
- ✅ Statistics dashboard

## Database Changes

### Migration Applied

The `rejected_reason` column has been added to the `assets` table:

```sql
ALTER TABLE public.assets
ADD COLUMN IF NOT EXISTS rejected_reason TEXT;
```

This column stores the reason for rejection when an asset is rejected.

## Files Created

1. **`app/admin/dashboard/page.tsx`** - Server-side admin dashboard
2. **`components/admin/PendingAssetsList.tsx`** - Client component for asset list
3. **`app/api/admin/asset/approve/route.ts`** - Approve API endpoint
4. **`app/api/admin/asset/reject/route.ts`** - Reject API endpoint
5. **`lib/email.ts`** - Email notification service (placeholder)

## Setup Instructions

### 1. Database Migration

The migration has already been applied. If you need to apply it manually:

```sql
-- Run in Supabase SQL Editor
ALTER TABLE public.assets
ADD COLUMN IF NOT EXISTS rejected_reason TEXT;
```

### 2. Email Configuration (Optional)

The email service is currently a placeholder. To enable email notifications:

#### Option A: Using Resend (Recommended)

1. Install Resend:
   ```bash
   npm install resend
   ```

2. Get API key from https://resend.com

3. Add to `.env.local`:
   ```env
   EMAIL_ENABLED=true
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   RESEND_FROM=noreply@yourdomain.com
   ```

4. Uncomment the Resend code in `lib/email.ts` (Option 2)

#### Option B: Using SendGrid

1. Install SendGrid:
   ```bash
   npm install @sendgrid/mail
   ```

2. Get API key from https://sendgrid.com

3. Add to `.env.local`:
   ```env
   EMAIL_ENABLED=true
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
   SENDGRID_FROM=noreply@yourdomain.com
   ```

4. Uncomment the SendGrid code in `lib/email.ts` (Option 3)

#### Option C: Using SMTP (Nodemailer)

1. Install Nodemailer:
   ```bash
   npm install nodemailer
   npm install --save-dev @types/nodemailer
   ```

2. Add to `.env.local`:
   ```env
   EMAIL_ENABLED=true
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   SMTP_FROM=noreply@yourdomain.com
   ```

3. Uncomment the Nodemailer code in `lib/email.ts` (Option 1)

#### Disable Email Notifications

To disable email notifications (for development), simply don't set `EMAIL_ENABLED=true` or set it to `false`.

### 3. Admin Role Check (Recommended)

Currently, any authenticated user can moderate assets. For production, add role-based access control:

1. Add a `role` column to your `profiles` table or use Supabase's built-in user metadata
2. Create a helper function to check admin role
3. Uncomment and implement the admin check in both API routes:

```typescript
// In app/api/admin/asset/approve/route.ts and reject/route.ts
const isAdmin = await checkAdminRole(session.user.id)
if (!isAdmin) {
  return NextResponse.json(
    { error: 'Forbidden. Admin access required.' },
    { status: 403 }
  )
}
```

Example `checkAdminRole` function:

```typescript
async function checkAdminRole(userId: string): Promise<boolean> {
  const { data } = await supabaseServer
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()
  
  return data?.role === 'admin'
}
```

## Usage

### Accessing Admin Dashboard

1. Navigate to `/admin/dashboard`
2. You'll see all pending assets that need review
3. Each asset shows:
   - Preview (for images)
   - Title, description, tags
   - Contributor information
   - Upload date
   - Price and license

### Approving Assets

1. Click the **"Approve"** button on any pending asset
2. The asset status is updated to `approved`
3. An email notification is sent to the contributor (if enabled)
4. The asset is removed from the pending list

### Rejecting Assets

1. Click the **"Reject"** button on any pending asset
2. A modal appears asking for a rejection reason (optional)
3. Enter the reason and click **"Confirm Reject"**
4. The asset status is updated to `rejected` with the reason stored
5. An email notification is sent to the contributor (if enabled)
6. The asset is removed from the pending list

## API Endpoints

### POST /api/admin/asset/approve

Approve a pending asset.

**Request:**
```json
{
  "assetId": "uuid-of-asset"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Asset approved successfully",
  "assetId": "uuid-of-asset"
}
```

### POST /api/admin/asset/reject

Reject a pending asset.

**Request:**
```json
{
  "assetId": "uuid-of-asset",
  "reason": "Optional rejection reason"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Asset rejected successfully",
  "assetId": "uuid-of-asset"
}
```

## Email Templates

The system includes two email templates:

1. **Asset Approved** - Sent when an asset is approved
2. **Asset Rejected** - Sent when an asset is rejected (includes rejection reason)

Both templates are HTML-based and include:
- Branded header
- Asset information
- Action buttons/links
- Professional styling

## Security Considerations

1. **Authentication**: All admin endpoints require authentication
2. **Authorization**: Add role-based access control for production
3. **Input Validation**: All inputs are validated before processing
4. **Error Handling**: Comprehensive error handling and logging
5. **Service Role Key**: Used only on server-side for database operations

## Troubleshooting

### "Unauthorized" error
- Ensure you're logged in
- Check session cookie is being sent
- Verify authentication is working

### Email not sending
- Check `EMAIL_ENABLED=true` in `.env.local`
- Verify email service credentials are correct
- Check server logs for email errors
- Email errors don't fail the moderation action (logged only)

### Assets not showing
- Verify assets exist with `status='pending'`
- Check database connection
- Verify service role key is set correctly

### Preview images not loading
- Check storage bucket permissions
- Verify `preview_path` is set correctly
- Check storage bucket name matches ('assets')

## Future Enhancements

- [ ] Bulk approve/reject actions
- [ ] Advanced filtering and search
- [ ] Asset history/audit log
- [ ] Admin activity logging
- [ ] Email template customization
- [ ] Push notifications
- [ ] Admin role management UI

