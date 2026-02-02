'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Admin error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Admin Error</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          {error.message || 'An error occurred in the admin panel'}
        </p>
        {error.message?.includes('Unauthorized') || error.message?.includes('Forbidden') ? (
          <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-6">
            You don't have permission to access this page. Admin access required.
          </p>
        ) : null}
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}

