'use client'

import { motion } from 'framer-motion'
import AssetCard from './AssetCard'
import type { Database } from '@/types/supabase'

type Asset = Database['public']['Tables']['assets']['Row']

interface RelatedAssetsProps {
  assets: Asset[]
  currentAssetId: string
}

export default function RelatedAssets({ assets, currentAssetId }: RelatedAssetsProps) {
  // Filter out current asset
  const relatedAssets = assets.filter((asset) => asset.id !== currentAssetId).slice(0, 4)

  if (relatedAssets.length === 0) return null

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Related Assets
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedAssets.map((asset, index) => (
          <motion.div
            key={asset.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <AssetCard asset={asset} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

