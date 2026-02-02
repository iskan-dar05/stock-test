'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AssetCard from '@/components/marketplace/AssetCard'
import { AssetCardSkeleton } from '@/components/ui/SkeletonLoader'
import { useAssets } from '@/hooks/useAssets'
import { supabase } from '@/lib/supabaseClient'

function BrowseContent() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('search') || ''

  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    sortBy: 'newest' as 'newest' | 'oldest' | 'trending',
  })
  const [categories, setCategories] = useState<Array<{ id: string; name: string; slug: string; icon: string | null }>>([])
  const [page, setPage] = useState(1)
  const itemsPerPage = 12

  const { assets, loading, error } = useAssets({
    filters: {
      type: filters.type !== 'all' ? filters.type : undefined,
      category: filters.category !== 'all' ? filters.category : undefined,
      status: 'approved',
    },
    sortBy: filters.sortBy,
    limit: itemsPerPage,
    offset: (page - 1) * itemsPerPage,
  })

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('categories')
        .select('id, name, slug, icon')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
      if (data) {
        setCategories(data)
      }
    }
    fetchCategories()
  }, [])

  // Filter by search query (client-side for instant results)
  const filteredAssets = searchQuery
    ? assets.filter(
        (asset) =>
          asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          asset.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          asset.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : assets

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [filters.type, filters.category, filters.sortBy])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">
            Browse Assets
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400">
            Discover premium digital assets for your projects
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-200 dark:border-gray-700"
        >
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-4 py-3 sm:py-2 text-base sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 touch-manipulation"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full px-4 py-3 sm:py-2 text-base sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 touch-manipulation"
              >
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
                <option value="3d">3D Objects</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    sortBy: e.target.value as typeof filters.sortBy,
                  })
                }
                className="w-full px-4 py-3 sm:py-2 text-base sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 touch-manipulation"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="trending">Trending</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Search Results Info */}
        {searchQuery && (
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              {filteredAssets.length} result{filteredAssets.length !== 1 ? 's' : ''} for "
              {searchQuery}"
            </p>
          </div>
        )}

        {/* Assets Grid */}
        {loading ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <AssetCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredAssets.length > 0 ? (
          <>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredAssets.map((asset, index) => (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <AssetCard asset={asset} />
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {!searchQuery && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 sm:px-5 py-2.5 sm:py-2 text-base sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors touch-manipulation active:scale-95"
                >
                  Previous
                </button>
                <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Page {page}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={filteredAssets.length < itemsPerPage}
                  className="px-4 sm:px-5 py-2.5 sm:py-2 text-base sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors touch-manipulation active:scale-95"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {searchQuery
                ? `No assets found for "${searchQuery}". Try a different search.`
                : 'No assets found. Try adjusting your filters.'}
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default function BrowsePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Header />
        <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <AssetCardSkeleton key={i} />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    }>
      <BrowseContent />
    </Suspense>
  )
}

