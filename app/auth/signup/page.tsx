'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'


export default function SignUpPage() {
  const router = useRouter()


  useEffect(()=>{
    const checkUser = async () =>  {
      const { data: { user } } = await supabase.auth.getUser()

      if(user) {
        router.replace('/')
      }
    }
    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session)=>{
      if(session?.user){
        router.replace('/')
      }
    })
    return () => subscription.unsubscribe()
  }, [router])



return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
        <div className="mb-6 text-center">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent inline-block mb-4"
          >
            StocksOcean
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Sign Up
        </h1>

        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="default"
          providers={['google', 'github']}
          view="sign_up"
          redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/`}
        />

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            href="/auth/signin"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}


