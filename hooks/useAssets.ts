import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { Database } from '@/types/supabase'

type Asset = Database['public']['Tables']['assets']['Row']

interface UseAssetsOptions {
  filters?: {
    type?: string
    status?: string
    contributorId?: string
    category?: string
  }
  sortBy?: 'newest' | 'oldest' | 'trending'
  limit?: number
  offset?: number
}

export function useAssets(options: UseAssetsOptions = {}) {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAssets = async () => {
    setLoading(true)
    setError(null)

    try {
      let query = supabase.from('assets').select('*')

      // Apply filters
      if (options.filters?.status) {
        query = query.eq('status', options.filters.status)
      } else {
        query = query.eq('status', 'approved')
      }

      if (options.filters?.type && options.filters.type !== 'all') {
        query = query.eq('type', options.filters.type)
      }

      if (options.filters?.category && options.filters.category !== 'all') {
        query = query.eq('category', options.filters.category)
      }

      if (options.filters?.contributorId) {
        query = query.eq('contributor_id', options.filters.contributorId)
      }

      // Apply sorting
      if (options.sortBy === 'trending') {
        query = query.order('views', { ascending: false })
      } else if (options.sortBy === 'oldest') {
        query = query.order('created_at', { ascending: true })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      // Apply pagination
      if (options.limit) {
        query = query.limit(options.limit)
      }
      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 20) - 1)
      }

      const { data, error: queryError } = await query

      if (queryError) throw queryError
      setAssets(data || [])
    } catch (err: any) {
      setError(err.message || 'Failed to fetch assets')
      console.error('Error fetching assets:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAssets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    options.filters?.type,
    options.filters?.status,
    options.filters?.contributorId,
    options.filters?.category,
    options.sortBy,
    options.limit,
    options.offset,
  ])

  return { assets, loading, error, refetch: fetchAssets }
}

