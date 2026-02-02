import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function ContributorAgreementPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      <main className="container-fluid py-8 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 border border-gray-200 dark:border-gray-700">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Contributor Agreement
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-8 sm:mb-10">
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none">
              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Agreement Acceptance</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  By uploading content to StocksOcean ("the Platform", "we", "us", "our"), you ("Contributor", "you", "your") agree to be bound by this Contributor Agreement. This Agreement governs your relationship with StocksOcean regarding content submission, licensing, royalties, and Platform participation.
                </p>
              </section>

              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Content Ownership and Rights</h2>
                
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">2.1 Ownership Confirmation</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">You represent and warrant that:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                  <li>You are the sole owner of all rights, title, and interest in the content you upload</li>
                  <li>You have the full right, power, and authority to grant the licenses specified in this Agreement</li>
                  <li>Your content does not infringe upon any third-party rights, including copyrights, trademarks, privacy rights, or publicity rights</li>
                  <li>You have obtained all necessary releases, permissions, and authorizations for content use</li>
                </ul>

                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">2.2 Original Content</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">You confirm that uploaded content is:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                  <li>Original work created by you, or</li>
                  <li>Properly licensed content for which you have redistribution rights, or</li>
                  <li>Content in the public domain, or</li>
                  <li>Content for which you have obtained all necessary rights and permissions</li>
                </ul>

                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">2.3 Prohibited Content</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">You may NOT upload content that:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                  <li>Infringes upon copyrights, trademarks, or other intellectual property rights</li>
                  <li>Features identifiable persons without proper model releases</li>
                  <li>Contains trademarks, logos, or brand names without authorization</li>
                  <li>Violates privacy or publicity rights</li>
                  <li>Is defamatory, obscene, or illegal</li>
                  <li>Violates Platform content guidelines</li>
                </ul>
              </section>

              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">3. AI-Generated Content Compliance</h2>
                
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">3.1 AI Content Disclosure</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">If you upload AI-generated content, you must:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                  <li>Disclose that content is AI-generated in the content description</li>
                  <li>Ensure AI-generated content complies with all applicable laws</li>
                  <li>Verify that AI tools used do not infringe upon third-party rights</li>
                </ul>

                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">3.2 AI Content Restrictions</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">AI-generated content must NOT:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                  <li>Mimic copyrighted artistic styles without authorization</li>
                  <li>Replicate trademarked designs, logos, or brand elements</li>
                  <li>Create likenesses of real persons without proper authorization</li>
                  <li>Infringe upon copyrighted characters or fictional works</li>
                  <li>Violate terms of service of AI generation tools used</li>
                </ul>
              </section>

              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">4. License Granted to Platform</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  By uploading content, you grant StocksOcean a non-exclusive, worldwide, royalty-bearing license to reproduce, distribute, and display your content on the Platform, create derivative works (thumbnails, previews, watermarks), market and promote your content, sublicense content to Platform users according to subscription terms, and use content for Platform operation and improvement.
                </p>
              </section>

              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Royalty System</h2>
                
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">5.1 Royalty Calculation</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  You earn royalties based on the number of downloads of your assets, asset price per download, your contributor level, and the royalty percentage associated with your level.
                </p>

                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">5.2 Contributor Levels and Royalty Rates</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">Royalty percentages vary by contributor level:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                  <li><strong>Bronze Level:</strong> 40% of asset price per download</li>
                  <li><strong>Silver Level:</strong> 45% of asset price per download</li>
                  <li><strong>Gold Level:</strong> 50% of asset price per download</li>
                  <li><strong>Platinum Level:</strong> 55% of asset price per download</li>
                </ul>

                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">5.3 Per-Download Royalties</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Royalties are calculated and paid on a per-download basis, only for completed downloads by paying subscribers, not for preview views or incomplete downloads, according to your contributor level at the time of download.
                </p>
              </section>

              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Payment Terms</h2>
                
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">6.1 Minimum Payout Threshold</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  A minimum payout threshold applies. Earnings below the threshold accumulate until the threshold is reached. Threshold amounts may vary by payment method.
                </p>

                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">6.2 Payment Schedule</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Payments are processed monthly, issued within a specified number of business days after month-end. Processing times may vary by payment method. You will receive payment notifications via email.
                </p>

                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">6.3 Tax Responsibility</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  You are solely responsible for reporting earnings to tax authorities, paying all applicable taxes on royalties, providing accurate tax information when requested, and complying with tax laws in your jurisdiction. We may request tax identification information, withhold taxes as required by law, and provide tax documentation as required.
                </p>
              </section>

              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Content Standards and Requirements</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Uploaded content must meet technical quality requirements (resolution, format, file size), content quality standards (composition, clarity, relevance), metadata requirements (titles, descriptions, tags, categories), and Platform-specific guidelines. All uploaded content is subject to automated quality checks, manual review by our team, and approval or rejection based on Platform standards.
                </p>
              </section>

              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Content Removal Rights</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  You may request removal of your content at any time through your contributor dashboard. Content will be removed from future availability, but existing user licenses remain valid. We may remove content immediately if it violates this Agreement or Platform policies, we receive a valid takedown notice, content is found to infringe upon third-party rights, or content is illegal, defamatory, or harmful.
                </p>
              </section>

              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">9. Account Termination</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  You may terminate your contributor account at any time through account settings or by contacting support. We may terminate your contributor account if you violate this Agreement or Platform Terms, upload infringing, illegal, or prohibited content, engage in fraudulent activity, fail to comply with Platform policies, or breach payment or tax obligations. Upon termination, pending royalties are paid according to payment terms, and content licenses to existing users remain valid.
                </p>
              </section>

              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">10. Indemnification</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  You agree to indemnify, defend, and hold harmless StocksOcean, its affiliates, officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your uploaded content, your breach of this Agreement, your violation of third-party rights, claims that your content infringes upon rights, or your failure to obtain necessary releases or permissions.
                </p>
              </section>

              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">11. Limitation of Liability</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  STOCKSOCEAN PROVIDES THE PLATFORM "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE specific earnings or download volumes, content approval or acceptance, Platform availability or uptime, or user behavior or content usage. TO THE MAXIMUM EXTENT PERMITTED BY LAW, STOCKSOCEAN SHALL NOT BE LIABLE FOR indirect, incidental, or consequential damages, lost profits or revenue, loss of data or content, or claims arising from user use of your content. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT OF ROYALTIES PAID TO YOU IN THE TWELVE MONTHS PRECEDING THE CLAIM.
                </p>
              </section>

              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">12. Intellectual Property</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  You retain ownership of your uploaded content, copyright and other intellectual property rights, right to license content elsewhere, and right to use content for your own purposes. StocksOcean retains rights to Platform design, functionality, and branding, rights to user-generated metadata and descriptions, rights to aggregate and anonymized usage data, and all intellectual property in the Platform itself.
                </p>
              </section>

              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">13. Modifications to Agreement</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  We reserve the right to modify this Agreement at any time. Material changes will be communicated to contributors at least 30 days in advance. Continued use of the Platform after changes constitutes acceptance of the modified Agreement.
                </p>
              </section>

              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">14. Contact Information</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                  For questions about this Agreement:
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  <strong>StocksOcean Contributor Support</strong><br />
                  Email: contributors@stocksocean.com<br />
                  Website: https://stocksocean.com/contributors
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

