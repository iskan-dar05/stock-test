import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAPI } from '@/lib/admin/auth'
import { createUserSupabase } from '@/lib/supabaseServer'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createUserSupabase()
    await requireAdminAPI()

    const body = await request.json()

    const { error } = await supabase
      .from('assets')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)

    if (error) {
      console.error('Error updating asset:', error)
      return NextResponse.json({ error: 'Failed to update asset' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Asset updated successfully' })
  } catch (error: any) {
    console.error('Error in asset update route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createUserSupabase()

    await requireAdminAPI()


    // Get asset to delete storage file
    const { data: asset } = await supabase.from('assets').select('storage_path').eq('id', params.id).maybeSingle()

    // Delete from storage if exists
    if (asset?.storage_path) {
      await supabase.storage.from('assets').remove([asset.storage_path])
    }

    // Delete from database
    const { error } = await supabase.from('assets').delete().eq('id', params.id)

    if (error) {
      console.error('Error deleting asset:', error)
      return NextResponse.json({ error: 'Failed to delete asset' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Asset deleted successfully' })
  } catch (error: any) {
    console.error('Error in asset delete route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

