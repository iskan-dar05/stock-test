'use client'

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Notification from '@/components/ui/Notification'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

export default function BecomeContributorPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [applicationMessage, setApplicationMessage] = useState('')
  const [portfolioUrl, setPortfolioUrl] = useState('')
  const [hasPendingApplication, setHasPendingApplication] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)
  const [notification, setNotification] = useState<{
    message: string
    type: 'success' | 'error' | 'info'
    visible: boolean
  }>({ message: '', type: 'info', visible: false })

  // Check if user already has a pending application
  useEffect(() => {
    const checkApplicationStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setCheckingStatus(false)
          return
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('role, application_date')
          .eq('id', user.id)
          .maybeSingle()

        if (profile) {
          // Check if user is already a contributor/admin
          if (profile.role === 'contributor' || profile.role === 'admin') {
            setHasPendingApplication(false)
            setCheckingStatus(false)
            return
          }
          
          // Check if user has a pending application
          if (profile.application_date && profile.role === 'user') {
            setHasPendingApplication(true)
          }
        }
      } catch (error) {
        console.error('Error checking application status:', error)
      } finally {
        setCheckingStatus(false)
      }
    }

    checkApplicationStatus()
  }, [])

  const handleApply = async () => {
    setLoading(true)
    setNotification({ message: '', type: 'info', visible: false })
    
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        console.error('Auth error:', userError)
        setNotification({
          message: 'You must be logged in to apply. Redirecting to sign in...',
          type: 'error',
          visible: true,
        })
        setTimeout(() => {
          router.push('/auth/signin?redirect=/become-contributor')
        }, 2000)
        return
      }

      console.log('Submitting application for user:', user.id)

      // Get session to pass user info
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        setNotification({
          message: 'Session expired. Please log in again.',
          type: 'error',
          visible: true,
        })
        setTimeout(() => {
          router.push('/auth/signin?redirect=/become-contributor')
        }, 2000)
        return
      }

      // Pass user ID, email, and application data to API
      const response = await fetch('/api/contributor/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          userEmail: user.email,
          applicationMessage: applicationMessage.trim(),
          portfolioUrl: portfolioUrl.trim(),
        }),
        credentials: 'include', // Ensure cookies are sent
      })

      console.log('Response status:', response.status)

            let data
            try {
              const text = await response.text()
              console.log('Response text:', text.substring(0, 200)) // Log first 200 chars
              data = JSON.parse(text)
            } catch (parseError) {
              console.error('Failed to parse response as JSON:', parseError)
              throw new Error(`Server error: Received non-JSON response. Status: ${response.status}`)
            }

            console.log('Response data:', data)

            if (!response.ok) {
              // Check if user already has a pending application
              if (data.hasPendingApplication) {
                setHasPendingApplication(true)
              }
              throw new Error(data.error || `Failed to apply (${response.status})`)
            }

      setNotification({
        message: data.message || 'Application submitted successfully! You will be notified once approved.',
        type: 'success',
        visible: true,
      })
      
      // Mark as having pending application after successful submission
      setHasPendingApplication(true)

      // Don't redirect - let them know they need to wait for approval
    } catch (error: any) {
      console.error('Error in handleApply:', error)
      setNotification({
        message: error.message || 'Failed to submit application. Please try again.',
        type: 'error',
        visible: true,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />

      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.visible}
        onClose={() => setNotification({ ...notification, visible: false })}
      />

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Become a Contributor
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Turn your creative work into income. Join thousands of creators selling digital assets
            on StocksOcean.
          </p>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center">
            Why Sell on StocksOcean?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                title: 'Fair Revenue Share',
                description:
                  'Earn competitive commissions on every sale. Set your own prices and keep more of what you make.',
                icon: '💰',
              },
              {
                title: 'Global Reach',
                description:
                  'Reach millions of potential buyers worldwide. Your assets are discoverable by businesses and creators everywhere.',
                icon: '🌍',
              },
              {
                title: 'Easy Upload Process',
                description:
                  'Upload your assets in minutes. Our simple interface makes it easy to add titles, descriptions, and tags.',
                icon: '📤',
              },
              {
                title: 'Fast Approval',
                description:
                  'Our team reviews submissions quickly, typically within 24-48 hours. Get your assets live fast.',
                icon: '⚡',
              },
              {
                title: 'Analytics Dashboard',
                description:
                  'Track your sales, views, and earnings with detailed analytics. See what works and optimize your portfolio.',
                icon: '📊',
              },
              {
                title: 'Support & Resources',
                description:
                  'Get help when you need it. Our support team and resources help you succeed as a contributor.',
                icon: '🤝',
              },
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{benefit.icon}</div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                  {benefit.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto mb-8 sm:mb-12 md:mb-16 px-4"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center">
            How It Works
          </h2>
          <div className="space-y-4 sm:space-y-6">
            {[
              {
                step: '1',
                title: 'Create Your Account',
                description:
                  'Sign up for free and complete your contributor profile. Add your bio, portfolio link, and payment information.',
              },
              {
                step: '2',
                title: 'Upload Your Assets',
                description:
                  'Upload your images, videos, or 3D models. Add titles, descriptions, tags, and set your prices.',
              },
              {
                step: '3',
                title: 'Get Approved',
                description:
                  'Our team reviews your submissions to ensure quality. Most assets are approved within 24-48 hours.',
              },
              {
                step: '4',
                title: 'Start Earning',
                description:
                  'Once approved, your assets go live. Start earning money as subscribers download your work.',
              },
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex flex-col sm:flex-row gap-4 sm:gap-6 bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold text-lg sm:text-xl">
                  {step.step}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Requirements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Requirements
            </h2>
            <ul className="space-y-4">
              {[
                'High-quality, original digital assets (images, videos, or 3D models)',
                'Proper file formats: JPG, PNG, WebP, GIF, MP4, or GLB',
                'Files must be under 50MB',
                'Clear, descriptive titles and descriptions',
                'Relevant tags for discoverability',
                'Commercial license rights for all uploaded content',
              ].map((requirement, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">{requirement}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Application Form Section */}
        <motion.div
          id="apply"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="max-w-2xl mx-auto mb-8 sm:mb-12 md:mb-16 px-4"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 text-center">
              Apply to Become a Contributor
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 text-center">
              Fill out the form below to start your journey as a contributor. Our team will review your application and get back to you soon.
            </p>
            
            {checkingStatus ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Checking application status...</p>
              </div>
            ) : hasPendingApplication ? (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-6 text-center">
                <div className="text-4xl mb-4">⏳</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Application Pending Review
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  You have already submitted an application. Our team is reviewing it and you will be notified once a decision is made.
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Please check your notifications for updates on your application status.
                </p>
              </div>
            ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Why do you want to become a contributor? <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={applicationMessage}
                  onChange={(e) => setApplicationMessage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Tell us about yourself and your creative work..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Portfolio or Website (Optional)
                </label>
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://yourportfolio.com"
                />
              </div>

              <button
                onClick={handleApply}
                disabled={loading || hasPendingApplication}
                className="w-full px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Applying...' : 'Submit Application'}
              </button>
            </div>
            )}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}

