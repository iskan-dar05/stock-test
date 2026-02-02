import { NextRequest, NextResponse } from 'next/server'
import { createUserSupabase } from '@/lib/supabaseServer'
import { requireAdminAPI } from '@/lib/admin/auth'
import { sendNotificationEmail } from '@/lib/email'

/**
 * POST /api/admin/asset/reject
 * 
 * Rejects a pending asset by updating its status to 'rejected' and storing rejection reason.
 * Requires admin authentication and sends notification email to contributor.
 * 
 * Request body:
 * {
 *   assetId: string (required) - UUID of the asset to reject
 *   reason?: string (optional) - Reason for rejection
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
    const supabase = createUserSupabase()
    // 1. Verify admin authentication
    await requireAdminAPI()

    // 2. Parse request body
    let body: { assetId?: string; reason?: string }
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
    const rejectionReason = body.reason?.trim() || null

    // 4. Fetch the asset to verify it exists
    const { data: asset, error: fetchError } = await supabase
      .from('assets')
      .select('*')
      .eq('id', assetId)
      .maybeSingle()

    // Fetch contributor profile if contributor_id exists
    let contributorProfile: { id: string; username: string | null } | null = null
    if (asset?.contributor_id) {
      const { data: profile } = await supabase
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

    // 6. Update asset status to rejected
    const { error: updateError } = await supabase
      .from('assets')
      .update({
        status: 'rejected',
        rejected_reason: rejectionReason,
        updated_at: new Date().toISOString(),
      })
      .eq('id', assetId)

    if (updateError) {
      console.error('Error updating asset:', updateError)
      return NextResponse.json(
        {
          error: 'Failed to reject asset',
          details: updateError.message,
        },
        { status: 500 }
      )
    }

    // 7. Create notification for contributor
    if (asset.contributor_id) {
      try {
        const rejectionMessage = rejectionReason
          ? `Your asset "${asset.title}" has been rejected. Reason: ${rejectionReason}`
          : `Your asset "${asset.title}" has been rejected. Please review the guidelines and try again.`

      await supabase
        .from('notifications' as any)
        .insert({
            user_id: asset.contributor_id,
            type: 'asset_rejected',
            title: 'Asset Rejected',
            message: rejectionMessage,
            link: `/contributor/dashboard`,
          })
      } catch (notifError) {
        console.error('Error creating notification:', notifError)
        // Don't fail the request if notification creation fails
      }

      // Send notification email to contributor (optional)
      try {
        // Get contributor email from auth.users
        const { data: userData } = await supabase.auth.admin.getUserById(
          asset.contributor_id
        )

        if (userData?.user?.email) {
          await sendNotificationEmail({
            to: userData.user.email,
            subject: 'Your Asset Has Been Rejected',
            template: 'asset-rejected',
            data: {
              assetTitle: asset.title,
              assetId: asset.id,
              rejectionReason: rejectionReason || 'No reason provided',
              contributorName: contributorProfile?.username || 'Contributor',
            },
          })
        }
      } catch (emailError) {
        // Log email error but don't fail the request
        console.error('Error sending rejection email:', emailError)
      }
    }

    // 8. Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Asset rejected successfully',
        assetId,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Unexpected error in /api/admin/asset/reject:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    )
  }
}

