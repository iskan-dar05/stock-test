'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface PlansListProps {
  plans: any[]
}

export default function PlansList({ plans }: PlansListProps) {
  const router = useRouter()
  const [editingPlan, setEditingPlan] = useState<any>(null)

  const handleEdit = (plan: any) => {
    setEditingPlan(plan)
  }

  const handleSave = async () => {
    if (!editingPlan) {
      return
    }

    try {
      const response = await fetch(`/api/admin/plans/${editingPlan.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPlan),
      })

      if (response.ok) {
        alert('Plan updated successfully!')
        setEditingPlan(null)
        router.refresh()
      } else {
        alert('Failed to update plan')
      }
    } catch (error) {
      alert('Error updating plan')
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto -mx-3 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Name</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase hidden sm:table-cell">Monthly Price</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase hidden md:table-cell">First Month</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase hidden lg:table-cell">Discount</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase hidden lg:table-cell">Downloads/Month</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase hidden xl:table-cell">Value/Download</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase hidden md:table-cell">Popular</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {plans.map((plan) => {
              const firstMonthPrice = plan.original_price_monthly * (1 - (plan.first_month_discount_percent || 0) / 100)
              return (
                <tr key={plan.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-3 sm:px-6 py-4">
                    {editingPlan?.id === plan.id ? (
                      <input
                        type="text"
                        value={editingPlan.name}
                        onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                        className="px-2 py-1 border rounded dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      <div className="font-semibold text-gray-900 dark:text-white">{plan.name}</div>
                    )}
                  </td>
                  <td className="px-3 sm:px-6 py-4 text-gray-900 dark:text-white hidden sm:table-cell">
                    {editingPlan?.id === plan.id ? (
                      <input
                        type="number"
                        step="0.01"
                        value={editingPlan.original_price_monthly}
                        onChange={(e) => setEditingPlan({ ...editingPlan, original_price_monthly: parseFloat(e.target.value) })}
                        className="px-2 py-1 border rounded w-20 dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      `$${plan.original_price_monthly?.toFixed(2) || '0.00'}`
                    )}
                  </td>
                  <td className="px-3 sm:px-6 py-4 text-gray-900 dark:text-white hidden md:table-cell">
                    {editingPlan?.id === plan.id ? (
                      <span className="text-sm">${firstMonthPrice.toFixed(2)}</span>
                    ) : (
                      <span className="text-sm">${firstMonthPrice.toFixed(2)}</span>
                    )}
                  </td>
                  <td className="px-3 sm:px-6 py-4 text-gray-900 dark:text-white hidden lg:table-cell">
                    {editingPlan?.id === plan.id ? (
                      <input
                        type="number"
                        value={editingPlan.first_month_discount_percent}
                        onChange={(e) => setEditingPlan({ ...editingPlan, first_month_discount_percent: parseInt(e.target.value) })}
                        className="px-2 py-1 border rounded w-20 dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      `${plan.first_month_discount_percent || 0}%`
                    )}
                  </td>
                  <td className="px-3 sm:px-6 py-4 text-gray-900 dark:text-white hidden lg:table-cell">
                    {editingPlan?.id === plan.id ? (
                      <input
                        type="number"
                        value={editingPlan.monthly_downloads || ''}
                        onChange={(e) => setEditingPlan({ ...editingPlan, monthly_downloads: e.target.value ? parseInt(e.target.value) : null })}
                        className="px-2 py-1 border rounded w-20 dark:bg-gray-700 dark:text-white"
                        placeholder="Custom"
                      />
                    ) : (
                      plan.monthly_downloads ? plan.monthly_downloads.toLocaleString() : 'Custom'
                    )}
                  </td>
                  <td className="px-3 sm:px-6 py-4 text-gray-900 dark:text-white hidden xl:table-cell">
                    {editingPlan?.id === plan.id ? (
                      <input
                        type="number"
                        step="0.001"
                        value={editingPlan.internal_download_value || ''}
                        onChange={(e) => setEditingPlan({ ...editingPlan, internal_download_value: e.target.value ? parseFloat(e.target.value) : null })}
                        className="px-2 py-1 border rounded w-20 dark:bg-gray-700 dark:text-white"
                        placeholder="N/A"
                      />
                    ) : (
                      plan.internal_download_value ? `$${plan.internal_download_value.toFixed(3)}` : 'N/A'
                    )}
                  </td>
                  <td className="px-3 sm:px-6 py-4 hidden md:table-cell">
                    {editingPlan?.id === plan.id ? (
                      <input
                        type="checkbox"
                        checked={editingPlan.is_popular}
                        onChange={(e) => setEditingPlan({ ...editingPlan, is_popular: e.target.checked })}
                      />
                    ) : (
                      plan.is_popular ? '✓' : '—'
                    )}
                  </td>
                  <td className="px-3 sm:px-6 py-4">
                    {editingPlan?.id === plan.id ? (
                      <div className="flex gap-2">
                        <button onClick={handleSave} className="text-green-600 hover:text-green-700">
                          Save
                        </button>
                        <button onClick={() => setEditingPlan(null)} className="text-gray-600 hover:text-gray-700">
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setEditingPlan(plan)} className="text-blue-600 hover:text-blue-700">
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  )
}

