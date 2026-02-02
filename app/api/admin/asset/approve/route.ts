import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'
import { requireAdminAPI } from '@/lib/admin/auth'
import { sendNotificationEmail } from '@/lib/email'

/**
 * POST /api/admin/asset/approve
 * 
 * Approves a pending asset by updating its status to 'approved'.
 * Requires admin authentication and sends notification email to contributor.
 * 
 * Request body:
 * {
 *   assetId: string (required) - UUID of the asset to approve
 * }
 * 
 * Returns:
 * {
 *   success: boolean
 *   message: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Verify admin authentication
    await requireAdminAPI()

    // 2. Parse request body
    let body: { assetId?: string }
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    // 3. Validate assetId
    if (!body.assetId || typeof body.assetId !== 'string') {
      return NextResponse.json(
        { error: 'assetId is required and must be a string' },
        { status: 400 }
      )
    }

    const assetId = body.assetId

    // 4. Fetch the asset to verify it exists
    const { data: asset, error: fetchError } = await supabaseServer
      .from('assets')
      .select('*')
      .eq('id', assetId)
      .maybeSingle()

    // Fetch contributor profile if contributor_id exists
    let contributorProfile: { id: string; username: string | null } | null = null
    if (asset?.contributor_id) {
      const { data: profile } = await supabaseServer
        .from('profiles')
        .select('id, username')
        .eq('id', asset.contributor_id)
        .maybeSingle()
      contributorProfile = profile
    }

    if (fetchError || !asset) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      )
    }

    // 5. Verify asset is in pending status
    if (asset.status !== 'pending') {
      return NextResponse.json(
        {
          error: `Asset is not pending. Current status: ${asset.status}`,
        },
        { status: 400 }
      )
    }

    // 6. Update asset status to approved
    const { error: updateError } = await supabaseServer
      .from('assets')
      .update({
        status: 'approved',
        updated_at: new Date().toISOString(),
        rejected_reason: null, // Clear any previous rejection reason
      })
      .eq('id', assetId)

    if (updateError) {
      console.error('Error updating asset:', updateError)
      return NextResponse.json(
        {
          error: 'Failed to approve asset',
          details: updateError.message,
        },
        { status: 500 }
      )
    }

    // 7. Create notification for contributor
    if (asset.contributor_id) {
      try {
      await supabaseServer
        .from('notifications' as any)
        .insert({
            user_id: asset.contributor_id,
            type: 'asset_approved',
            title: 'Asset Approved! ✅',
            message: `Your asset "${asset.title}" has been approved and is now live on the marketplace.`,
            link: `/asset/${asset.id}`,
          })
      } catch (notifError) {
        console.error('Error creating notification:', notifError)
        // Don't fail the request if notification creation fails
      }

      // Send notification email to contributor (optional)
      try {
        // Get contributor email from auth.users
        const { data: userData } = await supabaseServer.auth.admin.getUserById(
          asset.contributor_id
        )

        if (userData?.user?.email) {
          await sendNotificationEmail({
            to: userData.user.email,
            subject: 'Your Asset Has Been Approved',
            template: 'asset-approved',
            data: {
              assetTitle: asset.title,
              assetId: asset.id,
              contributorName: contributorProfile?.username || 'Contributor',
            },
          })
        }
      } catch (emailError) {
        // Log email error but don't fail the request
        console.error('Error sending approval email:', emailError)
      }
    }

    // 8. Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Asset approved successfully',
        assetId,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Unexpected error in /api/admin/asset/approve:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    )
  }
}

