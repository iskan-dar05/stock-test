# StocksOcean Admin Panel

Complete admin dashboard for managing the StocksOcean marketplace.

## 🚀 Setup

### 1. Run Database Migration

First, run the migration to add admin role and additional fields:

```sql
-- Run migrations/004_admin_role_and_asset_fields.sql in Supabase SQL Editor
```

This migration adds:
- `role` column to `profiles` table (user, contributor, admin)
- Additional asset fields: `category`, `is_demo`, `is_featured`
- `admin_settings` table for platform configuration

### 2. Set Admin Role

To make a user an admin, update their profile:

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE id = 'your-user-id';
```

### 3. Access Admin Panel

Navigate to `/admin/dashboard` - you'll be redirected if not an admin.

## 📁 Structure

```
app/admin/
├── layout.tsx              # Admin layout with sidebar
├── dashboard/              # Overview with stats
├── contributors/           # Contributor management
│   ├── page.tsx           # List all contributors
│   └── [id]/page.tsx      # Contributor details
├── assets/                 # Asset management
│   ├── page.tsx           # List all assets
│   ├── upload/page.tsx    # Upload new asset
│   └── [id]/page.tsx      # Edit asset
├── plans/                  # Subscription plans
└── settings/               # Platform settings

components/admin/
├── AdminSidebar.tsx        # Navigation sidebar
├── ContributorActions.tsx  # Approve/reject/update level
├── AssetEditForm.tsx       # Asset editing form
├── PlansList.tsx           # Plans management
└── SettingsForm.tsx        # Settings form

lib/admin/
└── auth.ts                 # Admin authentication helpers
```

## 🔐 Authentication

All admin routes are protected by:
- `requireAdmin()` - For pages (redirects if not admin)
- `requireAdminAPI()` - For API routes (throws error if not admin)

## 📊 Features

### Dashboard
- Total assets, users, contributors
- Pending reviews count
- Revenue and download stats
- Charts for assets and revenue (last 7 days)
- Quick action links

### Contributor Management
- View all contributors (filter by status)
- Approve/reject contributor applications
- Update contributor levels (Bronze, Silver, Gold, Platinum)
- View contributor assets and earnings
- Change revenue share percentage

### Asset Management
- List all assets with filters (status, type, category)
- Upload new assets (admin uploads are auto-approved)
- Edit asset details (title, description, price, tags, status)
- Mark assets as demo or featured
- Delete assets (removes from storage and database)

### Subscription Plans
- View all plans
- Edit plan pricing (monthly, yearly)
- Update first-month discount percentage
- Mark plans as "Most Popular"

### Settings
- Marketplace name
- Contact email
- Logo URL
- Max upload size
- Default contributor payout percentage

## 🎨 UI Components

Built with:
- TailwindCSS for styling
- Framer Motion for animations
- Recharts for dashboard charts
- Responsive design (mobile-friendly sidebar)

## 🔌 API Routes

All API routes require admin authentication:

- `POST /api/admin/contributor/approve` - Approve contributor
- `POST /api/admin/contributor/reject` - Reject contributor
- `POST /api/admin/contributor/update-level` - Update contributor level
- `PUT /api/admin/assets/[id]` - Update asset
- `DELETE /api/admin/assets/[id]` - Delete asset
- `PUT /api/admin/plans/[id]` - Update subscription plan
- `PUT /api/admin/settings` - Update platform settings

## 📝 Notes

- Admin uploads go to `assets/admin/{type}/{filename}` in Supabase Storage
- Admin-uploaded assets are automatically approved
- All admin actions are logged (can be extended for audit trail)
- Settings are stored in `admin_settings` table with id='main'

## 🚨 Security

- All admin routes check for `role = 'admin'` in profiles table
- Non-admin users are automatically redirected
- API routes return 401/403 errors for unauthorized access
- Use service role key only on server-side

## 🔄 Next Steps

1. Add audit logging for admin actions
2. Add email notifications for contributor approvals/rejections
3. Add bulk operations (bulk approve/reject)
4. Add export functionality (CSV/JSON)
5. Add advanced analytics and reporting

