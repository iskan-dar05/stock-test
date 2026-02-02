'use client'

import { useState, FormEvent } from 'react'
import StockCard from '@/components/stocks/StockCard'
import Link from 'next/link'

interface StockResult {
  symbol: string
  price: number
  change: number
  changePercent: number
  trend: 'up' | 'down' | 'neutral'
  aiInsight: string
}

interface AnalysisResponse {
  results: StockResult[]
  timestamp: string
}

/**
 * StocksOcean Dashboard Page
 * 
 * Modern stock analysis dashboard with clean UI, real-time analysis,
 * and AI-powered insights.
 */
export default function StocksOceanPage() {
  const [symbols, setSymbols] = useState('')
  const [results, setResults] = useState<StockResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Handle form submission
   */
  const handleAnalyze = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    setResults([])

    try {
      // Validate input
      if (!symbols.trim()) {
        throw new Error('Please enter at least one stock symbol')
      }

      // Call API
      const response = await fetch('/api/stocks/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbols: symbols.trim() }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to analyze stocks: ${response.statusText}`)
      }

      const data: AnalysisResponse = await response.json()
      setResults(data.results)
    } catch (err: any) {
      setError(err.message || 'An error occurred while analyzing stocks')
      console.error('Analysis error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              StocksOcean
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/auth/signin"
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Stock Analysis Dashboard
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Analyze multiple stocks at once with real-time data and AI-powered insights
          </p>
        </div>

        {/* Input Section */}
        <div className="max-w-3xl mx-auto mb-8">
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <label
                htmlFor="symbols"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
              >
                Stock Symbols
              </label>
              <input
                type="text"
                id="symbols"
                value={symbols}
                onChange={(e) => setSymbols(e.target.value)}
                placeholder="Enter symbols separated by commas (e.g., AAPL, MSFT, GOOGL)"
                disabled={loading}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Enter up to 10 stock symbols separated by commas
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !symbols.trim()}
              className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Analyzing...
                </span>
              ) : (
                'Analyze Stocks'
              )}
            </button>
          </form>
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-3xl mx-auto mb-8">
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-red-800 dark:text-red-200 mb-1">
                    Error
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {results.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Analysis Results
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {results.length} {results.length === 1 ? 'stock' : 'stocks'}
              </span>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((stock) => (
                <StockCard key={stock.symbol} stock={stock} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && results.length === 0 && !error && (
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-6">
              <svg
                className="w-10 h-10 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Ready to Analyze
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Enter stock symbols above to get started with real-time analysis and AI insights
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

