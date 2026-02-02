import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET() {
  try {
    // Test 1: Check if environment variables are set
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
    const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!hasUrl || !hasKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing environment variables',
          details: {
            hasUrl,
            hasKey,
          },
        },
        { status: 500 }
      )
    }

    // Test 2: Try to query the database (get table count)
    const { data: tablesData, error: tablesError } = await supabase
      .from('assets')
      .select('id', { count: 'exact', head: true })

    if (tablesError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Database query failed',
          details: {
            message: tablesError.message,
            code: tablesError.code,
            hint: tablesError.hint,
          },
        },
        { status: 500 }
      )
    }

    // Test 3: Check auth service
    const { data: authData, error: authError } = await supabase.auth.getSession()

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful!',
      details: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        database: {
          connected: true,
          assetsTableCount: tablesData?.length || 0,
        },
        auth: {
          connected: !authError,
          hasSession: !!authData?.session,
        },
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: 'Connection test failed',
        details: {
          message: error.message,
          stack: error.stack,
        },
      },
      { status: 500 }
    )
  }
}

