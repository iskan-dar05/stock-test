import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-300 mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go back home
          </Link>
          <Link
            href="/browse"
            className="inline-block px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Browse Assets
          </Link>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-sm text-gray-500 mb-4">Popular pages:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link href="/pricing" className="text-sm text-blue-400 hover:text-blue-300">Pricing</Link>
            <span className="text-gray-600">•</span>
            <Link href="/help" className="text-sm text-blue-400 hover:text-blue-300">Help</Link>
            <span className="text-gray-600">•</span>
            <Link href="/about" className="text-sm text-blue-400 hover:text-blue-300">About</Link>
            <span className="text-gray-600">•</span>
            <Link href="/contact" className="text-sm text-blue-400 hover:text-blue-300">Contact</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

