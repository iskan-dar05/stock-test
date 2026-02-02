'use client'

interface ProgressBarProps {
  current: number
  target: number
  label: string
  type: 'assets' | 'earnings' | 'downloads'
}

export default function ProgressBar({ current, target, label, type }: ProgressBarProps) {
  const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0
  const remaining = Math.max(target - current, 0)

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {current.toLocaleString()} / {target.toLocaleString()}
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {remaining > 0 && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {remaining.toLocaleString()} more{' '}
          {type === 'assets' ? 'assets' : type === 'downloads' ? 'downloads' : `$${remaining.toFixed(2)}`} to next level
        </p>
      )}
    </div>
  )
}

