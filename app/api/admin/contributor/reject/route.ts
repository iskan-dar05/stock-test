import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { requireAdminAPI } from '@/lib/admin/auth'

/**
 * POST /api/admin/contributor/reject
 *
 * Rejects a contributor application
 */
export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    try {
      await requireAdminAPI()
    } catch (authError: any) {
      console.error('Admin auth error:', authError)
      return NextResponse.json(
        { error: authError.message || 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const { id, reason } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Contributor ID is required' }, { status: 400 })
    }

    // Verify the user exists
    const { data: existingProfile, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('id, role, application_date')
      .eq('id', id)
      .maybeSingle()

    if (fetchError) {
      console.error('Error fetching profile:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch contributor profile' },
        { status: 500 }
      )
    }

    if (!existingProfile) {
      return NextResponse.json(
        { error: 'Contributor not found' },
        { status: 404 }
      )
    }

    // Update contributor role back to 'user' (rejection) and clear application_date
    // This allows them to reapply if they want
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        role: 'user', // Set role back to user
        contributor_tier: null, // Remove contributor tier
        application_date: null, // Clear application date so they can reapply
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (updateError) {
      console.error('Error rejecting contributor:', updateError)
      return NextResponse.json(
        { error: `Failed to reject contributor: ${updateError.message}` },
        { status: 500 }
      )
    }

    // Create notification for the user
    try {
      const rejectionMessage = reason 
        ? `Your contributor application has been rejected. Reason: ${reason}`
        : 'Your contributor application has been rejected. Please review the requirements and try again.'
      
      await supabaseAdmin
        .from('notifications' as any)
        .insert({
          user_id: id,
          type: 'contributor_rejected',
          title: 'Contributor Application Rejected',
          message: rejectionMessage,
          link: '/become-contributor',
        })
    } catch (notifError) {
      console.error('Error creating notification:', notifError)
      // Don't fail the request if notification creation fails
    }

    return NextResponse.json({ success: true, message: 'Contributor rejected' })
  } catch (error: any) {
    console.error('Error in reject contributor route:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.status || 500 }
    )
  }
}

