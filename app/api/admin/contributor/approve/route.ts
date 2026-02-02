import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAPI } from '@/lib/admin/auth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(request: NextRequest) {
  try {
    // 1️⃣ Check admin
    await requireAdminAPI()

    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Contributor ID is required' }, { status: 400 })
    }

    // 2️⃣ Fetch profile (SERVICE ROLE)
    const { data: existingProfile, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('id, role, application_date')
      .eq('id', id)
      .maybeSingle()

    if (fetchError) {
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
    }

    if (!existingProfile) {
      return NextResponse.json({ error: 'Contributor not found' }, { status: 404 })
    }

    if (existingProfile.role === 'contributor') {
      return NextResponse.json({ error: 'Already approved' }, { status: 400 })
    }

    // 3️⃣ Update role
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        role: 'contributor',
        contributor_tier: 'current',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // 4️⃣ Notification
    await supabaseAdmin.from('notifications').insert({
      user_id: id,
      type: 'contributor_approved',
      title: 'Contributor Application Approved 🎉',
      message: 'Your application has been approved.',
      link: '/contributor/dashboard',
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json(
      { error: error.message || 'Internal error' },
      { status: 500 }
    )
  }
}
