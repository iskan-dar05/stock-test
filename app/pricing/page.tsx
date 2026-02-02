'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PricingCard from '@/components/marketplace/PricingCard'
import { supabase } from '@/lib/supabaseClient'

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    fetchPlans()
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      setUser(currentUser)
    } catch (error) {
      setUser(null)
    }
  }

  const handleGetStarted = (planId: string) => {
    // Get return URL from query params if available
    const params = new URLSearchParams(window.location.search)
    const returnUrl = params.get('redirect') || '/pricing'
    
    if (!user) {
      // Redirect to sign in with return URL
      window.location.href = `/auth/signin?redirect=${encodeURIComponent(`/pricing?redirect=${encodeURIComponent(returnUrl)}`)}`
    } else {
      // User is logged in, proceed with subscription
      // TODO: Implement subscription flow
      alert(`Subscription flow for ${planId} will be implemented soon!`)
    }
  }

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans' as any)
        .select('*')
        .order('original_price_monthly', { ascending: true })

      if (error) throw error

      if (data) {
        const typedData = data as any[]
        const formattedPlans = typedData.map((plan: any) => ({
          id: plan.id,
          name: plan.name,
          description: plan.description || '',
          originalPriceMonthly: Number(plan.original_price_monthly) || 0,
          originalPriceYearly: Number(plan.original_price_yearly) || 0,
          firstMonthDiscount: plan.first_month_discount_percent || 0,
          monthlyDownloads: plan.monthly_downloads,
          features: (plan.features as string[]) || [],
          isPopular: plan.is_popular || false,
          isCustom: plan.id === 'enterprise' || !plan.monthly_downloads,
        }))
        setPlans(formattedPlans)
      }
    } catch (error) {
      console.error('Error fetching plans:', error)
      // Fallback to hardcoded plans if fetch fails
      setPlans([
        {
          id: 'bronze',
          name: 'Bronze',
          description: 'Perfect for individuals and small projects',
          originalPriceMonthly: 15,
          originalPriceYearly: 150,
          firstMonthDiscount: 33,
          monthlyDownloads: 75,
          features: [
            'Access to images, videos, 3D objects',
            'High-res downloads',
            'Commercial license',
            'Standard support',
          ],
          isPopular: false,
          isCustom: false,
        },
        {
          id: 'silver',
          name: 'Silver',
          description: 'Best for professionals and growing teams',
          originalPriceMonthly: 25,
          originalPriceYearly: 250,
          firstMonthDiscount: 20,
          monthlyDownloads: 250,
          features: [
            'Everything in Bronze',
            'Unlimited downloads',
            'Team management',
            'Secure storage',
            'Priority support',
          ],
          isPopular: true,
          isCustom: false,
        },
        {
          id: 'gold',
          name: 'Gold',
          description: 'For agencies and large teams',
          originalPriceMonthly: 50,
          originalPriceYearly: 500,
          firstMonthDiscount: 20,
          monthlyDownloads: 700,
          features: [
            'Everything in Silver',
            'Featured listing',
            'Newsletter exposure',
            'API access',
            'Priority support',
          ],
          isPopular: false,
          isCustom: false,
        },
        {
          id: 'enterprise',
          name: 'Enterprise',
          description: 'Custom solutions for large organizations',
          originalPriceMonthly: 0,
          originalPriceYearly: 0,
          firstMonthDiscount: 0,
          monthlyDownloads: null,
          features: [
            'Everything in Gold',
            'Legal rights',
            'SSO integration',
            'Dedicated support',
            'Custom SLA',
          ],
          isPopular: false,
          isCustom: true,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const calculateFirstMonthPrice = (originalPrice: number, discountPercent: number) => {
    return originalPrice * (1 - discountPercent / 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Choose the plan that works best for you. All plans include full commercial licenses.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span
              className={`text-sm font-medium ${
                billingPeriod === 'monthly'
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              Monthly
            </span>
            <button
              onClick={() =>
                setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')
              }
              className="relative w-14 h-8 bg-gray-300 dark:bg-gray-600 rounded-full transition-colors"
            >
              <span
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                  billingPeriod === 'yearly' ? 'translate-x-6' : ''
                }`}
              />
            </button>
            <span
              className={`text-sm font-medium ${
                billingPeriod === 'yearly'
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              Yearly
              <span className="ml-2 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                Save 17%
              </span>
            </span>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto mb-8 sm:mb-12">
              {plans
                .filter((plan) => plan.id !== 'enterprise')
                .map((plan, index) => {
                  const originalPrice =
                    billingPeriod === 'monthly' ? plan.originalPriceMonthly : plan.originalPriceYearly
                  const firstMonthPrice = calculateFirstMonthPrice(originalPrice, plan.firstMonthDiscount)

                  return (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                    >
                      <PricingCard
                        name={plan.name}
                        price={`$${firstMonthPrice.toFixed(2)}`}
                        period={billingPeriod === 'monthly' ? '/month' : '/year'}
                        originalPrice={`$${originalPrice.toFixed(2)}`}
                        discountPercent={plan.firstMonthDiscount}
                        description={plan.description}
                        features={plan.features}
                        popular={plan.isPopular}
                        ctaText={user ? "Get Started" : "Sign In to Subscribe"}
                        ctaLink="#"
                        onCtaClick={() => handleGetStarted(plan.id)}
                        monthlyDownloads={plan.monthlyDownloads}
                      />
                    </motion.div>
                  )
                })}
            </div>
            {/* Enterprise Plan - Display separately */}
            {plans.find((p) => p.id === 'enterprise') && (
              <div className="max-w-md mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ y: -5 }}
                >
                  <PricingCard
                    name={plans.find((p) => p.id === 'enterprise')?.name || 'Enterprise'}
                    price="Custom"
                    period=""
                    originalPrice=""
                    discountPercent={0}
                    description={plans.find((p) => p.id === 'enterprise')?.description || ''}
                    features={plans.find((p) => p.id === 'enterprise')?.features || []}
                    popular={false}
                    ctaText={user ? "Contact Sales" : "Sign In to Subscribe"}
                    ctaLink="/contact"
                    onCtaClick={() => handleGetStarted('enterprise')}
                    monthlyDownloads={null}
                  />
                </motion.div>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
