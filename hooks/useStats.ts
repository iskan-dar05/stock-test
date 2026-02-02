import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface MarketplaceStats {
  totalAssets: number
  totalContributors: number
  totalDownloads: number
}

export function useMarketplaceStats() {
  const [stats, setStats] = useState<MarketplaceStats>({
    totalAssets: 0,
    totalContributors: 0,
    totalDownloads: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [assetsResult, downloadsResult] = await Promise.all([
        supabase
          .from('assets')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'approved'),
        supabase.from('assets').select('downloads').eq('status', 'approved'),
      ])

      // Try to get contributors count separately
      let contributorsCount = 0
      try {
        const contributorsResult = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
        contributorsCount = contributorsResult.count || 0
      } catch (error) {
        // Profiles table might not exist
        console.warn('Could not fetch contributors count:', error)
      }

      const totalDownloads =
        downloadsResult.data?.reduce((sum: number, asset: { downloads: number | null }) => sum + (asset.downloads || 0), 0) || 0

      setStats({
        totalAssets: assetsResult.count || 0,
        totalContributors: contributorsCount,
        totalDownloads,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
      // Set default values on error
      setStats({
        totalAssets: 0,
        totalContributors: 0,
        totalDownloads: 0,
      })
    } finally {
      setLoading(false)
    }
  }

  return { stats, loading }
}

