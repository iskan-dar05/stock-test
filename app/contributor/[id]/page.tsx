'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AssetCard from '@/components/marketplace/AssetCard'
import LevelBadge from '@/components/contributor/LevelBadge'
import { supabase } from '@/lib/supabaseClient'
import type { Database } from '@/types/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']
type Asset = Database['public']['Tables']['assets']['Row']

export default function ContributorProfilePage({ params }: { params: { id: string } }) {
  const contributorId = params?.id || ''

  const [contributor, setContributor] = useState<Profile | null>(null)
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [levelName, setLevelName] = useState<string | null>(null)

  useEffect(() => {
    console.log('ContributorProfilePage - contributorId:', contributorId)
    if (contributorId) {
      fetchContributorData()
    } else {
      setError('Invalid contributor ID')
      setLoading(false)
    }
  }, [contributorId])

  const fetchContributorData = async () => {
    if (!contributorId) {
      setError('No contributor ID provided')
      setLoading(false)
      return
    }
    
    try {
      setError(null)
      // Fetch contributor profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', contributorId)
        .single()

      if (profileError) {
        console.error('Profile error:', profileError)
        setError(profileError.message || 'Contributor not found')
        setLoading(false)
        return
      }

      if (!profileData) {
        setError('Contributor not found')
        setLoading(false)
        return
      }

      console.log('Contributor data:', profileData)
      console.log('Contributor level:', profileData.contributor_tier)
      console.log('Contributor role:', profileData.role)
      setContributor(profileData)

      // Fetch contributor level details if contributor_level_id exists
      // For now, we'll use contributor_tier as a fallback
      if (profileData.contributor_tier) {
        // Try to fetch level name from contributor_levels table
        // Note: This assumes contributor_tier maps to a level ID
        // If not, we'll use the tier directly
        setLevelName(profileData.contributor_tier)
      }

      // Fetch contributor's approved assets
      const { data: assetsData, error: assetsError } = await supabase
        .from('assets')
        .select('*')
        .eq('contributor_id', contributorId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      if (assetsError) {
        console.error('Error fetching assets:', assetsError)
        // Don't set error here, just log it - assets are optional
      } else {
        setAssets(assetsData || [])
      }
    } catch (error: any) {
      console.error('Error fetching contributor data:', error)
      setError(error?.message || 'Failed to load contributor data')
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name: string | null) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Header />
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !contributor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Header />
        <main className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            {error || 'Contributor Not Found'}
          </h1>
          <Link
            href="/browse"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Browse Assets
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Contributor Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-200 dark:border-gray-700 mb-6 sm:mb-8"
          >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6">
              {/* Avatar */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-lg">
                {contributor.avatar_url ? (
                  <img
                    src={contributor.avatar_url}
                    alt={contributor.username || 'Contributor'}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  getInitials(contributor.username)
                )}
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-2 sm:gap-3 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    {contributor.username || 'Contributor'}
                  </h1>
                  {contributor.role === 'contributor' && levelName && (
                    <LevelBadge 
                      level={levelName.toLowerCase() as 'bronze' | 'silver' | 'gold' | 'platinum'} 
                      size="lg" 
                    />
                  )}
                </div>
                {contributor.bio && (
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {contributor.bio}
                  </p>
                )}
                <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Assets:</span>{' '}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {assets.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Downloads:</span>{' '}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {contributor.total_download_count || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Assets Grid */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
              Assets by {contributor.username || 'Contributor'} ({assets.length})
            </h2>
            {assets.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {assets.map((asset, index) => (
                  <motion.div
                    key={asset.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <AssetCard asset={asset} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center border border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  No assets available yet
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

