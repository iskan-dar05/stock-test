'use client'

import { motion } from 'framer-motion'

interface ContributorStatsProps {
  totalAssets: number
  views: number
  downloads: number
  earnings: number
}

export default function ContributorStats({
  totalAssets,
  views,
  downloads,
  earnings,
}: ContributorStatsProps) {
  // Simple bar chart for earnings (mock data)
  const earningsData = [
    { month: 'Jan', amount: earnings * 0.1 },
    { month: 'Feb', amount: earnings * 0.15 },
    { month: 'Mar', amount: earnings * 0.2 },
    { month: 'Apr', amount: earnings * 0.25 },
    { month: 'May', amount: earnings * 0.2 },
    { month: 'Jun', amount: earnings * 0.1 },
  ]

  const maxEarnings = Math.max(...earningsData.map((d) => d.amount), 1)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Earnings Overview
      </h2>

      {/* Simple Bar Chart */}
      <div className="h-48 flex items-end justify-between gap-2 mb-6">
        {earningsData.map((data, index) => (
          <motion.div
            key={data.month}
            initial={{ height: 0 }}
            animate={{ height: `${(data.amount / maxEarnings) * 100}%` }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex-1 bg-gradient-to-t from-blue-600 to-purple-600 rounded-t-lg min-h-[20px] relative group"
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              ${data.amount.toFixed(2)}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Month Labels */}
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        {earningsData.map((data) => (
          <span key={data.month}>{data.month}</span>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${earnings.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Avg per Asset</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${totalAssets > 0 ? (earnings / totalAssets).toFixed(2) : '0.00'}
          </p>
        </div>
      </div>
    </div>
  )
}

