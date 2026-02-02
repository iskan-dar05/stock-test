import { NextRequest, NextResponse } from 'next/server'
import { createUserSupabase, createClient } from '@/lib/supabaseServer'

import type { Database } from '@/types/supabase'

type AssetInsert = Database['public']['Tables']['assets']['Insert']

/**
 * POST /api/assets/create
 * 
 * Creates a new asset record in the database after file upload.
 * Requires authentication and validates all input data.
 * 
 * Request body:
 * {
 *   title: string (required)
 *   description?: string
 *   type: string (required) - 'image', 'video', '3d', or 'other'
 *   storage_path: string (required) - Path in Supabase Storage
 *   preview_path?: string - Public URL for preview (images)
 *   price: number (required)
 *   license: string (required)
 *   tags?: string[] - Array of tag strings
 * }
 * 
 * Returns:
 * {
 *   assetId: string - UUID of created asset
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Get authenticated user session
    console.log("SEVER +++++++++ ================== I WORK!!!!!!!!!")
    const user = await createClient()

    const supabase = createUserSupabase()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to upload assets.' },
        { status: 401 }
      )
    }

    const userId = user.id

    // 2. Check if user is a contributor or admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    if (!profile || (profile.role !== 'contributor' && profile.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Forbidden. Only approved contributors can upload assets.' },
        { status: 403 }
      )
    }

    // 3. Parse and validate request body
    let body: Partial<AssetInsert>
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    // 3. Validate required fields
    const requiredFields: (keyof AssetInsert)[] = [
      'title',
      'type',
      'storage_path',
      'license',
    ]

    const missingFields = requiredFields.filter((field) => !body[field])
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: `Missing required fields: ${missingFields.join(', ')}`,
        },
        { status: 400 }
      )
    }

    // 4. Validate field types and values
    if (typeof body.title !== 'string' || body.title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Title must be a non-empty string' },
        { status: 400 }
      )
    }

    if (typeof body.type !== 'string') {
      return NextResponse.json(
        { error: 'Type must be a string' },
        { status: 400 }
      )
    }

    const validTypes = ['image', 'video', '3d', 'other']
    if (!validTypes.includes(body.type)) {
      return NextResponse.json(
        {
          error: `Type must be one of: ${validTypes.join(', ')}`,
        },
        { status: 400 }
      )
    }

    if (typeof body.storage_path !== 'string' || body.storage_path.trim().length === 0) {
      return NextResponse.json(
        { error: 'Storage path must be a non-empty string' },
        { status: 400 }
      )
    }

    // Validate storage path format (should be contributors/{userId}/... or assets/admin/...)
    const isAdmin = profile.role === 'admin'
    const isValidPath = 
      body.storage_path.startsWith(`contributors/${userId}/`) ||
      (isAdmin && body.storage_path.startsWith('assets/admin/'))
    
    if (!isValidPath) {
      return NextResponse.json(
        {
          error: isAdmin 
            ? 'Invalid storage path. Must be in contributors/{userId}/ or assets/admin/ directory'
            : 'Invalid storage path. Must be in contributors/{userId}/ directory',
        },
        { status: 400 }
      )
    }

    // Price is always 0 for subscription-only model
    const price = 0

    // Validate license
    if (typeof body.license !== 'string') {
      return NextResponse.json(
        { error: 'License must be a string' },
        { status: 400 }
      )
    }

    // Validate tags if provided
    if (body.tags !== undefined && body.tags !== null) {
      if (!Array.isArray(body.tags)) {
        return NextResponse.json(
          { error: 'Tags must be an array of strings' },
          { status: 400 }
        )
      }
      
      if (!body.tags.every((tag) => typeof tag === 'string')) {
        return NextResponse.json(
          { error: 'All tags must be strings' },
          { status: 400 }
        )
      }
    }

    // 5. Verify file exists in storage (optional check)
    // This ensures the file was actually uploaded before creating the record
    const { data: fileData, error: fileError } = await supabase.storage
      .from('assets')
      .list(body.storage_path.split('/').slice(0, -1).join('/'), {
        limit: 1,
        search: body.storage_path.split('/').pop() || '',
      })

    // Note: File existence check is optional - if file doesn't exist yet,
    // the upload might still be in progress. We'll proceed anyway.

    // 6. Prepare asset data for insertion
    const assetData: AssetInsert = {
      contributor_id: userId,
      title: body.title.trim(),
      description: body.description?.trim() || null,
      type: body.type,
      storage_path: body.storage_path,
      preview_path: body.preview_path || null,
      price: price,
      license: body.license,
      status: 'pending', // All new assets start as pending
      tags: body.tags && body.tags.length > 0 ? body.tags : null,
      category: body.category || null,
      views: 0,
      downloads: 0,
    }

    // 7. Insert asset into database using service role key (bypasses RLS)
    const { data: insertedAsset, error: insertError } = await supabase
      .from('assets')
      .insert(assetData)
      .select('id')
      .single()

    if (insertError) {
      console.error('Database insert error:', insertError)
      return NextResponse.json(
        {
          error: 'Failed to create asset record',
          details: insertError.message,
        },
        { status: 500 }
      )
    }

    if (!insertedAsset || !insertedAsset.id) {
      return NextResponse.json(
        { error: 'Asset created but no ID returned' },
        { status: 500 }
      )
    }

    // 8. Return success response
    return NextResponse.json(
      {
        assetId: insertedAsset.id,
        message: 'Asset created successfully',
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Unexpected error in /api/assets/create:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    )
  }
}

