'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FcGoogle } from 'react-icons/fc'
import { BsGithub } from 'react-icons/bs'

export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')


  const redirectByRole = async (userId: string) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    const role = profile?.role?.toLowerCase()
    if (role === 'contributor') router.replace('/contributor/dashboard')
    else if (role === 'admin') router.replace('/admin/dashboard')
    else router.replace('/')
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) setError(error.message)
    else if (data.user) await redirectByRole(data.user.id)
  }

  const handleOAuth = async (provider: 'google' | 'github') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    })
    if (error) setError(error.message)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700">
        <div className="mb-6 text-center">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent inline-block mb-4"
          >
            StocksOcean
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-white mb-6 text-center">Sign In</h1>

        {/* Email / Password Form */}
        <form onSubmit={handleSignIn} className="space-y-4 mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-bold transition"
          >
            Sign In
          </button>
        </form>

        <div className="flex flex-col space-y-3">
          <button
            onClick={() => handleOAuth('google')}
            className="flex items-center justify-center gap-2 w-full py-3 bg-green-400 hover:bg-green-700 rounded-lg text-white font-bold transition"
          >
            <FcGoogle className="mr-2 w-6 h-6" />

            <span>Sign in with Google</span>
          </button>

          <button
            onClick={() => handleOAuth('github')}
            className="flex items-center justify-center gap-2 w-full py-3 bg-gray-900 hover:bg-gray-800 rounded-lg text-white font-bold transition"
          >
          <BsGithub className="mr-2 w-6 h-6" />
          <span>Sign in with GitHub</span>
          </button>
        </div>

        <div className="mt-4 text-center text-gray-400">
          <Link href="/signup" className="text-purple-400 hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  )
}
