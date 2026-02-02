import { createUserSupabase } from '@/lib/supabaseServer'
import Link from 'next/link'
import PlansList from '@/components/admin/PlansList'

export default async function PlansPage() {
  // Auth check is handled by the layout

  // Fetch subscription plans from database
  const supabase = await createUserSupabase()
  const { data: plans, error } = await supabase
    .from('subscription_plans' as any)
    .select('*')
    .order('original_price_monthly', { ascending: true })

  if (error) {
    console.error('Error fetching plans:', error)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Subscription Plans</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage pricing plans and features</p>
        </div>
      </div>

      <PlansList plans={plans || []} />
    </div>
  )
}

