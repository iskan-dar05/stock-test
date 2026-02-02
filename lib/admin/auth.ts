import { createUserSupabase } from '@/lib/supabaseServer'
import { supabaseAdmin } from '@/lib/supabaseAdmin' // استيراد العميل الذي أنشأته
import { redirect } from 'next/navigation'

/**
 * Check if the current user is an admin (for pages)
 * Redirects if not admin
 */
export async function requireAdmin() {
  const supabase = await createUserSupabase()

  const { data: { session } } = await supabase.auth.getSession()

  if (!session || !session.user) {
    console.log('requireAdmin: No session found, redirecting to signin')
    redirect('/auth/signin?redirect=/admin')
  }

  console.log('requireAdmin: Checking role for user:', session.user.id)

  // Check if user has admin role
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .maybeSingle()

  if (error) {
    console.error('requireAdmin: Error fetching profile:', error)
    redirect('/')
  }

  console.log('requireAdmin: Profile data:', { role: profile?.role, userId: session.user.id })

  if (!profile || profile.role !== 'admin') {
    console.log('requireAdmin: User is not admin, redirecting to home')
    redirect('/')
  }

  console.log('requireAdmin: Admin access granted')
  return session
}

/**
 * Check if user is admin (for API routes)
 * Throws error if not admin - does not redirect
 */
export async function requireAdminAPI() {
  // 1. نستخدم عميل المستخدم (SSR) للتأكد من أنه مسجل دخول بالفعل
  const supabaseUser = await createUserSupabase()
  const { data: { session } } = await supabaseUser.auth.getSession()

  if (!session || !session.user) {
    throw new Error('Unauthorized: Please log in')
  }

  // 2. نستخدم عميل الـ Admin (Service Role) لجلب الدور (Role) بأمان
  // هذا يضمن أنك ستجلب البيانات حتى لو كانت سياسات RLS تمنع المستخدم من قراءة بياناته الخاصة
  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (error || profile?.role !== 'admin') {
    console.error('Admin Access Denied:', error)
    throw new Error('Forbidden: Admin access required')
  }

  return session
}

/**
 * Check if user is admin (non-redirecting version)
 * Returns true if admin, false otherwise
 */
export async function isAdmin(): Promise<boolean> {
  const supabase = await createUserSupabase()

  const { data: { session } } = await supabase.auth.getSession()

  if (!session || !session.user) {
    return false
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .maybeSingle()

  return profile?.role === 'admin'
}

