import { NextRequest, NextResponse } from 'next/server'
import { createUserSupabase, createClient } from '@/lib/supabaseServer'

/**
 * POST /api/contributor/apply
 *
 * Creates or updates a profile for contributor application
 */
export async function POST(request: NextRequest) {
  try {
    // Get the logged-in user from server session
    const user = await createClient()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createUserSupabase()
    const userId = user.id
    const userEmail = user.email || 'user'

    // Parse request body
    let body: { applicationMessage?: string; portfolioUrl?: string } = {}
    try {
      const contentType = request.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        body = await request.json()
      }
    } catch (err) {
      console.error('Error parsing request body:', err)
    }

    // Check if profile exists
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (fetchError) {
      console.error('Error fetching profile:', fetchError)
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    if (profile) {
      // Profile exists → update application
      if (profile.role === 'contributor' || profile.role === 'admin') {
        return NextResponse.json(
          { error: 'You are already an approved contributor.' },
          { status: 400 }
        )
      }

      if (profile.application_date && profile.role === 'user') {
        return NextResponse.json(
          {
            error: 'You have already submitted an application. Please wait for admin review.',
            hasPendingApplication: true,
          },
          { status: 400 }
        )
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          application_message: body.applicationMessage || null,
          portfolio_url: body.portfolioUrl || null,
          application_date: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)

      if (updateError) {
        console.error('Error updating profile:', updateError)
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: 'Application updated successfully. You will be notified once approved.',
      })
    } else {
      // Profile does not exist → create new profile
      const username = userEmail.split('@')[0]

      const { data: insertedProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          username,
          role: 'user', // Default, admin will approve
          application_message: body.applicationMessage || null,
          portfolio_url: body.portfolioUrl || null,
          application_date: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (insertError) {
        console.error('Error creating profile:', insertError)
        return NextResponse.json({ error: insertError.message }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: 'Application submitted successfully. You will be notified once approved.',
      })
    }
  } catch (error: any) {
    console.error('Error in contributor apply route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
