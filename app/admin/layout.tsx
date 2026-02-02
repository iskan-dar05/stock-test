'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { supabase } from '@/lib/supabaseClient'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const checkAdmin = async () => {
      try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (!isMounted) return
        
        if (userError || !user) {
          console.error('No user:', userError)
          if (isMounted) {
            setError('Not authenticated')
            setTimeout(() => {
              if (isMounted) router.push('/auth/signin?redirect=/admin')
            }, 2000)
          }
          return
        }

        console.log('Checking admin for user:', user.id)

        // Query profile with explicit error handling
        const { data: profiles, error: queryError } = await supabase
          .from('profiles')
          .select('role, username, id')
          .eq('id', user.id)
          .limit(1)

        if (!isMounted) return

        console.log('Query result:', { profiles, queryError })

        if (queryError) {
          console.error('Query error:', queryError)
          if (isMounted) {
            setError(`Database error: ${queryError.message}`)
            setTimeout(() => {
              if (isMounted) router.push('/')
            }, 3000)
          }
          return
        }

        if (!profiles || profiles.length === 0) {
          console.error('No profile found')
          if (isMounted) {
            setError('Profile not found')
            setTimeout(() => {
              if (isMounted) router.push('/')
            }, 3000)
          }
          return
        }

        const profile = profiles[0]
        console.log('Profile found:', profile)
        console.log('Role:', profile.role, 'Type:', typeof profile.role)

        // Check if admin - be very explicit
        const role = String(profile.role || '').trim().toLowerCase()
        const isAdmin = role === 'admin'

        console.log('Role check:', { role, isAdmin, expected: 'admin' })

        if (!isMounted) return

        if (!isAdmin) {
          if (isMounted) {
            setError(`Access denied. Your role is: "${profile.role}". Admin required.`)
            setTimeout(() => {
              if (isMounted) router.push('/')
            }, 3000)
          }
          return
        }

        console.log('✅ Admin access granted! Setting authorized state...')
        // Set both states together to prevent race conditions
        if (isMounted) {
          setLoading(false)
          setIsAuthorized(true)
          console.log('✅ State updated - should render admin panel now')
        }
      } catch (err: any) {
        if (!isMounted) return
        console.error('Exception:', err)
        setError(`Error: ${err?.message || 'Unknown error'}`)
        setLoading(false)
        setTimeout(() => {
          if (isMounted) router.push('/')
        }, 3000)
      }
    }

    checkAdmin()

    return () => {
      isMounted = false
    }
  }, [router])

  // Debug logging
  console.log('🔍 AdminLayout render:', { loading, isAuthorized, error })

  if (loading) {
    console.log('⏳ Rendering loading state')
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Checking permissions...</p>
        </div>
      </div>
    )
  }

  if (error) {
    console.log('❌ Rendering error state:', error)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
            <p className="text-red-800 dark:text-red-200 font-semibold mb-2">Access Denied</p>
            <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Redirecting...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    console.log('🚫 Not authorized, returning null')
    return null
  }

  console.log('✅ Rendering admin panel!')
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex gap-[70px] md:gap-0 min-h-screen">
        <AdminSidebar />
        <main className="flex-1 min-h-screen pt-16 lg:pt-0">
          <div className="p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
            {children}
          </div>
        </main>
      </div>

    </div>
  )
}

