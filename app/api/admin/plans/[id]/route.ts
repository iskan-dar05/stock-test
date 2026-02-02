import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAPI } from '@/lib/admin/auth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdminAPI()

    const body = await request.json()

    const { error } = await supabaseAdmin
      .from('subscription_plans' as any)
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)

    if (error) {
      console.error('Error updating plan:', error)
      return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Plan updated successfully' })
  } catch (error: any) {
    console.error('Error in plan update route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

