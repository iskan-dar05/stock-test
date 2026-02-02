'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AssetCard from '@/components/marketplace/AssetCard'
import AssetCarousel from '@/components/marketplace/AssetCarousel'
import { supabase } from '@/lib/supabaseClient'
import type { Database } from '@/types/supabase'

type Asset = Database['public']['Tables']['assets']['Row']

export default function Home() {
  const [featuredAssets, setFeaturedAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(false) // Start as false so page renders immediately
  const [error, setError] = useState<string | null>(null)
  const [isApprovedContributor, setIsApprovedContributor] = useState(false)

  useEffect(() => {
    // Check if user is an approved contributor
    // Note: contributor_status doesn't exist in this schema, using role instead
    const checkContributorStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .maybeSingle()
          
          // Check if user has contributor role (or is admin)
          if (profile && (profile.role === 'contributor' || profile.role === 'admin')) {
            setIsApprovedContributor(true)
          }
        }
      } catch (error) {
        // Ignore errors, user might not be logged in
      }
    }

    checkContributorStatus()

    // Fetch featured assets in the background (non-blocking)
    const fetchFeaturedAssets = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('assets')
          .select('*')
          .eq('status', 'approved')
          .order('views', { ascending: false })
          .limit(6)

        if (error) {
          console.error('Supabase error:', error)
          setError(error.message)
        } else {
          setFeaturedAssets(data || [])
        }
      } catch (error: any) {
        console.error('Error fetching featured assets:', error)
        setError(error?.message || 'Failed to load assets')
      } finally {
        setLoading(false)
      }
    }

    // Delay fetch slightly to allow page to render first
    const timer = setTimeout(() => {
      fetchFeaturedAssets()
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      <Header />

      <main className="flex-1 w-full">
        {/* Error Display */}
        {error && (
          <div className="container mx-auto px-4 py-4">
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-200">
              Error: {error}
            </div>
          </div>
        )}
        
        {/* Hero Section */}
        <section className="container-fluid py-8 sm:py-12 md:py-16 lg:py-24 xl:py-32">
          <div className="text-center max-w-5xl mx-auto px-4">
            <h1 className="heading-responsive font-bold text-white mb-4 sm:mb-6 md:mb-8">
              Discover Premium
              <br className="hidden xs:block" />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Digital Assets
              </span>
            </h1>
            <p className="text-responsive text-gray-300 mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto">
              High-quality images, videos, and 3D objects for your creative projects. Join our
              marketplace as a buyer or contributor.
            </p>
            <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center items-stretch xs:items-center px-4">
              <button
                onClick={() => scrollToSection('browse-section')}
                className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 touch-manipulation active:scale-95"
              >
                Browse Assets
              </button>
              {!isApprovedContributor && (
                <Link
                  href="/become-contributor"
                  className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base bg-gray-800 text-white rounded-xl font-semibold border-2 border-gray-700 hover:border-blue-500 transition-all shadow-md hover:shadow-lg touch-manipulation active:scale-95 text-center"
                >
                  Become a Contributor
                </Link>
              )}
            </div>

          </div>
        </section>

        {/* Featured Assets Carousel */}
        {!loading && featuredAssets.length > 0 && (
          <section className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8 sm:mb-10 md:mb-12"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-4">
                Featured Assets
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-300 px-4">
                Explore our handpicked selection of premium digital assets
              </p>
            </motion.div>

            <div className="max-w-5xl mx-auto">
              <AssetCarousel assets={featuredAssets.slice(0, 5)} />
            </div>
          </section>
        )}

        {/* How It Works Section */}
        <section className="container mx-auto px-4 py-8 sm:py-12 md:py-16 bg-gray-800/50 rounded-2xl sm:rounded-3xl my-8 sm:my-12 md:my-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-10 md:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-4">
              How It Works
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 px-4">
              Get started in three simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Browse',
                description: 'Explore thousands of premium digital assets across images, videos, and 3D objects.',
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                ),
              },
              {
                step: '02',
                title: 'Subscribe',
                description: 'Choose a subscription plan that fits your needs and get unlimited access to all assets.',
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                ),
              },
              {
                step: '03',
                title: 'Use',
                description: 'Download and use your assets in any project with full commercial license.',
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                ),
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-6">
                  {item.icon}
                </div>
                <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
                  STEP {item.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-300">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Featured Assets Grid */}
        {!loading && featuredAssets.length > 0 && (
          <section id="browse-section" className="container mx-auto px-4 py-16">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Popular Assets
              </h2>
              <p className="text-lg text-gray-300">
                Trending assets loved by our community
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredAssets.slice(0, 6).map((asset, index) => (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <AssetCard asset={asset} />
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/browse"
                className="inline-block px-6 py-3 text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                View All Assets →
              </Link>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
