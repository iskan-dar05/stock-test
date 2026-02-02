'use client'

interface StockData {
  symbol: string
  price: number
  change: number
  changePercent: number
  trend: 'up' | 'down' | 'neutral'
  aiInsight: string
}

interface StockCardProps {
  stock: StockData
}

/**
 * StockCard Component
 * 
 * Reusable component for displaying individual stock analysis results.
 * Features clean design with trend indicators and AI insights.
 */
export default function StockCard({ stock }: StockCardProps) {
  const isPositive = stock.changePercent > 0
  const isNegative = stock.changePercent < 0
  const isNeutral = stock.changePercent === 0 || Math.abs(stock.changePercent) < 0.1

  // Determine colors based on trend
  const trendColors = {
    up: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-700 dark:text-green-300',
      icon: 'text-green-600 dark:text-green-400',
      badge: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    },
    down: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-700 dark:text-red-300',
      icon: 'text-red-600 dark:text-red-400',
      badge: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    },
    neutral: {
      bg: 'bg-gray-50 dark:bg-gray-800/50',
      border: 'border-gray-200 dark:border-gray-700',
      text: 'text-gray-700 dark:text-gray-300',
      icon: 'text-gray-600 dark:text-gray-400',
      badge: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    },
  }

  const colors = trendColors[stock.trend]

  return (
    <div
      className={`rounded-xl border-2 ${colors.border} ${colors.bg} p-6 shadow-sm hover:shadow-md transition-all duration-200`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {stock.symbol}
          </h3>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-md text-xs font-semibold ${colors.badge}`}>
              {stock.trend.toUpperCase()}
            </span>
          </div>
        </div>
        {/* Trend Icon */}
        <div className={`${colors.icon}`}>
          {stock.trend === 'up' && (
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          )}
          {stock.trend === 'down' && (
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>
          )}
          {stock.trend === 'neutral' && (
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 12h14"
              />
            </svg>
          )}
        </div>
      </div>

      {/* Price Section */}
      <div className="mb-6">
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            ${stock.price.toFixed(2)}
          </span>
          <span
            className={`text-lg font-semibold ${
              isPositive
                ? 'text-green-600 dark:text-green-400'
                : isNegative
                ? 'text-red-600 dark:text-red-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {isPositive ? '+' : ''}
            {stock.change.toFixed(2)} ({isPositive ? '+' : ''}
            {stock.changePercent.toFixed(2)}%)
          </span>
        </div>
      </div>

      {/* AI Insight Section */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-2">
          <svg
            className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
              AI Insight
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {stock.aiInsight}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

