'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export default function HelpPage() {
  const [openSection, setOpenSection] = useState<string | null>(null)

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          q: 'How do I create an account?',
          a: 'Click on "Sign Up" in the top right corner, fill in your details, and verify your email address. You can also sign up using Google or GitHub. Once registered, you can browse assets and subscribe to a plan to download them.',
        },
        {
          q: 'How do I become a contributor?',
          a: 'Navigate to the "Become a Contributor" page, fill out the application form with your portfolio URL and a message explaining why you want to contribute. Our team will review your application and notify you via email once approved.',
        },
        {
          q: 'What file types are supported?',
          a: 'We support images (JPG, PNG, WebP, GIF), MP4 videos, and GLB 3D models. Maximum file size is 50MB per asset. All files are reviewed for quality before being published.',
        },
        {
          q: 'How do I upload my first asset?',
          a: 'After your contributor application is approved, go to your Contributor Dashboard and click "Upload Asset". Fill in the title, description, tags, category, and select your file. Your asset will be reviewed within 24-48 hours before being published.',
        },
      ],
    },
    {
      category: 'Subscription Plans',
      questions: [
        {
          q: 'What subscription plans are available?',
          a: 'We offer four subscription tiers: Bronze ($15/month, 75 downloads), Silver ($25/month, 250 downloads - Most Popular), Gold ($50/month, 700 downloads), and Platinum ($100/month, 2,000 downloads). Enterprise plans are available with custom pricing and downloads. All plans include first-month discounts.',
        },
        {
          q: 'What is the first-month discount?',
          a: 'Bronze offers 33% OFF your first month ($10.05 instead of $15), while Silver, Gold, and Platinum offer 20% OFF. This discount applies only to the first month of your subscription.',
        },
        {
          q: 'What happens if I exceed my monthly download limit?',
          a: 'If you reach your monthly download limit, you can either upgrade to a higher tier plan or wait until your next billing cycle when your downloads reset. All assets are available through subscription plans only.',
        },
        {
          q: 'Can I change my subscription plan?',
          a: 'Yes! You can upgrade or downgrade your plan at any time from your account settings. Changes take effect immediately, and you\'ll be charged or credited the prorated difference.',
        },
        {
          q: 'What license do I get with a subscription?',
          a: 'All subscription plans include full commercial licenses for all downloaded assets. You can use them in personal and commercial projects without attribution requirements.',
        },
      ],
    },
    {
      category: 'Buying Assets',
      questions: [
        {
          q: 'How do I download an asset?',
          a: 'Browse our marketplace, click on an asset you like, and subscribe to a plan. Once you have an active subscription, you can download any asset directly. All assets are available through subscription plans only, which offer better value with first-month discounts.',
        },
        {
          q: 'Can I preview assets before purchasing?',
          a: 'Yes! All assets have preview images or videos that you can view before purchasing. For 3D models, you can rotate and examine the preview.',
        },
        {
          q: 'Can I get a refund?',
          a: 'Due to the digital nature of our products, we do not offer refunds for subscriptions. However, you can cancel your subscription at any time and continue to have access until the end of your billing period. If you encounter any technical issues, please contact our support team for assistance.',
        },
        {
          q: 'Where can I find my purchased assets?',
          a: 'Go to your account dashboard and click on "My Purchases" to see all your downloaded assets. You can re-download them at any time.',
        },
      ],
    },
    {
      category: 'Contributor Program',
      questions: [
        {
          q: 'How much can I earn as a contributor?',
          a: 'Your earnings depend on your contributor level. Level 1 (Starter) earns $0.10 per download with 25% revenue share, while Level 5 (Platinum/Partner) earns $1.00 per download with 65% revenue share. Levels are based on your lifetime download count.',
        },
        {
          q: 'How do contributor levels work?',
          a: 'Contributor levels are based on lifetime downloads: Level 1 (0-100 downloads), Level 2 (101-500), Level 3 (501-2,000), Level 4 (2,001-10,000), Level 5 (10,001+), and Level 6 (AI Innovator for AI-exclusive assets). Higher levels earn more per download and have better revenue shares.',
        },
        {
          q: 'How long does asset approval take?',
          a: 'Our team typically reviews assets within 24-48 hours. You will receive an email notification once your asset is approved, rejected, or if any changes are needed.',
        },
        {
          q: 'What happens if my asset is rejected?',
          a: 'You will receive an email with the specific reason for rejection. You can make the necessary changes and resubmit your asset. Common reasons include quality issues, copyright concerns, or missing required information.',
        },
        {
          q: 'When do I get paid?',
          a: 'Earnings are calculated based on downloads and your contributor level. Payouts are processed monthly, and you can track your earnings in your Contributor Dashboard.',
        },
        {
          q: 'What are the benefits of higher contributor levels?',
          a: 'Higher levels offer increased earnings per download, better revenue shares, featured placement in collections, priority search results, newsletter mentions, API access, and dedicated support. Level 5 and 6 contributors get guaranteed exposure and priority promotion.',
        },
      ],
    },
    {
      category: 'Account & Billing',
      questions: [
        {
          q: 'How do I cancel my subscription?',
          a: 'Go to your account settings, navigate to "Subscriptions", and click "Cancel". You will continue to have access until the end of your current billing period. No refunds are provided for partial months.',
        },
        {
          q: 'How do I update my payment method?',
          a: 'Go to your account settings and click on "Payment Methods". You can add, update, or remove payment methods there. Your subscription will automatically use the default payment method.',
        },
        {
          q: 'Can I pause my subscription?',
          a: 'Currently, we do not offer subscription pauses. You can cancel your subscription and resubscribe later, but you will lose access to downloads during the cancellation period.',
        },
        {
          q: 'Do subscriptions auto-renew?',
          a: 'Yes, all subscriptions automatically renew at the end of each billing period unless you cancel. You will be charged the regular monthly or yearly rate (without the first-month discount) for renewals.',
        },
      ],
    },
    {
      category: 'Technical Support',
      questions: [
        {
          q: 'I\'m having trouble downloading an asset. What should I do?',
          a: 'First, check your internet connection and try again. If the issue persists, clear your browser cache or try a different browser. If problems continue, contact our support team with your order details.',
        },
        {
          q: 'Can I use assets in commercial projects?',
          a: 'Yes! All assets come with full commercial licenses. You can use them in client work, products, marketing materials, and any commercial project without attribution.',
        },
        {
          q: 'Are there any usage restrictions?',
          a: 'Assets cannot be resold as-is or redistributed. You cannot claim ownership of the original asset. However, you can modify and incorporate them into your projects freely.',
        },
        {
          q: 'What if I need help with a specific asset?',
          a: 'Contact our support team through the contact page or email. Include the asset ID and a description of your issue, and we\'ll assist you as soon as possible.',
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />

      <main className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 md:py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Help Center
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
            Find answers to common questions and get the support you need
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto mb-8 sm:mb-10 md:mb-12 px-4"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search for help..."
              className="w-full px-6 py-4 pl-12 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {[
            {
              title: 'Getting Started Guide',
              description: 'Learn how to use StocksOcean',
              link: '/help#getting-started',
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              ),
            },
            {
              title: 'Contact Support',
              description: 'Get help from our team',
              link: '/contact',
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ),
            },
            {
              title: 'Become a Contributor',
              description: 'Start selling your assets',
              link: '/become-contributor',
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              ),
            },
          ].map((link, index) => (
            <Link
              key={link.title}
              href={link.link}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all group"
            >
              <div className="text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                {link.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {link.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{link.description}</p>
            </Link>
          ))}
        </motion.div>

        {/* FAQ Sections */}
        <div className="max-w-4xl mx-auto space-y-8">
          {faqs.map((section, sectionIndex) => (
            <motion.div
              key={section.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + sectionIndex * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <button
                onClick={() =>
                  setOpenSection(openSection === section.category ? null : section.category)
                }
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {section.category}
                </h2>
                <svg
                  className={`w-6 h-6 text-gray-500 transition-transform ${
                    openSection === section.category ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {openSection === section.category && (
                <div className="px-6 pb-6 space-y-4">
                  {section.questions.map((faq, index) => (
                    <div
                      key={index}
                      className="pt-4 border-t border-gray-200 dark:border-gray-700 first:border-t-0"
                    >
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {faq.q}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">{faq.a}</p>
                      <button
                        onClick={() => {
                          // Expand to show more details (you can implement a modal or expandable section)
                          alert(`More details about: ${faq.q}\n\n${faq.a}\n\nFor additional information, please contact our support team.`)
                        }}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1 transition-colors"
                      >
                        Learn More
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Still Need Help */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="max-w-2xl mx-auto mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
            <p className="mb-6 opacity-90">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <Link
              href="/contact"
              className="inline-block px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}

