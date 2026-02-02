'use client'

interface LevelBadgeProps {
  level: string | 'bronze' | 'silver' | 'gold' | 'platinum' | 'level_1_starter' | 'level_2_growing' | 'level_3_professional' | 'level_4_elite' | 'level_5_platinum' | 'level_6_ai_innovator'
  size?: 'sm' | 'md' | 'lg'
}

export default function LevelBadge({ level, size = 'md' }: LevelBadgeProps) {
  // Map level IDs to badge configs
  const getLevelConfig = (levelId: string) => {
    // Map new level IDs to old badge names for styling
    const levelMap: { [key: string]: 'bronze' | 'silver' | 'gold' | 'platinum' } = {
      'level_1_starter': 'bronze',
      'level_2_growing': 'silver',
      'level_3_professional': 'gold',
      'level_4_elite': 'gold',
      'level_5_platinum': 'platinum',
      'level_6_ai_innovator': 'platinum',
    }
    
    const mappedLevel = levelMap[levelId] || levelId as 'bronze' | 'silver' | 'gold' | 'platinum'
    
    const levelConfig = {
      bronze: {
        name: levelId.includes('starter') ? 'Starter' : 'Bronze',
        color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
        borderColor: 'border-amber-300 dark:border-amber-700',
      },
      silver: {
        name: levelId.includes('growing') ? 'Growing' : 'Silver',
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
        borderColor: 'border-gray-300 dark:border-gray-600',
      },
      gold: {
        name: levelId.includes('professional') ? 'Professional' : levelId.includes('elite') ? 'Elite' : 'Gold',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        borderColor: 'border-yellow-300 dark:border-yellow-700',
      },
      platinum: {
        name: levelId.includes('ai_innovator') ? 'AI Innovator' : 'Platinum',
        color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
        borderColor: 'border-purple-300 dark:border-purple-700',
      },
    }
    
    return levelConfig[mappedLevel] || levelConfig.bronze
  }
  
  const config = getLevelConfig(level)

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${config.color} ${config.borderColor} ${sizeClasses[size]}`}
    >
      {level === 'platinum' && (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )}
      {level === 'gold' && (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )}
      {config.name}
    </span>
  )
}

