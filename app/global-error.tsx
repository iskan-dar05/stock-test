'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased dark" suppressHydrationWarning>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Something went wrong!</h1>
            <p className="text-gray-400 mb-8">{error?.message || 'An unexpected error occurred'}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={reset}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try again
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Go home
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}

