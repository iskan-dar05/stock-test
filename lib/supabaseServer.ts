import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'
import { NextResponse, NextRequest } from 'next/server'

export function createUserSupabase() {
  const cookieStore = cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // 👈 IMPORTANT
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // ❗ This happens in Server Components (read-only)
            // Safe to ignore because middleware handles refresh
          }
        },
    }
  }
  )
}





export async function createClient() {
  const supabase = createUserSupabase()

  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    console.log('❌ No authenticated user')
    return null
  }

  console.log('✅ User:', data.user.email)
  return data.user
}
