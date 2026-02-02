import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAPI } from '@/lib/admin/auth'
import { createUserSupabase } from '@/lib/supabaseServer'

export async function PUT(request: NextRequest) {
  try {
    const supabase = createUserSupabase()
    await requireAdminAPI()



    const body = await request.json()

    const { error } = await supabase
      .from('admin_settings')
      .upsert(
        {
          id: 'main',
          ...body,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )

    if (error) {
      console.error('Error updating settings:', error)
      return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Settings updated successfully' })
  } catch (error: any) {
    console.error('Error in settings update route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

