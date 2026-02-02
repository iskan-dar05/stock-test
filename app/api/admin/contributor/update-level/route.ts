import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { requireAdminAPI } from '@/lib/admin/auth'

export async function POST(request: NextRequest) {
  try {
    await requireAdminAPI()

    const { id, level } = await request.json()

    if (!id || !level) {
      return NextResponse.json({ error: 'Contributor ID and level are required' }, { status: 400 })
    }

    // Validate level
    const validLevels = ['bronze', 'silver', 'gold', 'platinum']
    if (!validLevels.includes(level)) {
      return NextResponse.json({ error: 'Invalid level' }, { status: 400 })
    }

    // Update contributor level
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ contributor_tier: level, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      console.error('Error updating contributor level:', error)
      return NextResponse.json({ error: 'Failed to update level' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Contributor level updated successfully' })
  } catch (error: any) {
    console.error('Error in update-level route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

