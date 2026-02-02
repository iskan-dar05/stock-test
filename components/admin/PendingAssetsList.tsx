'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { Database } from '@/types/supabase'

type Asset = Database['public']['Tables']['assets']['Row']
type Profile = Database['public']['Tables']['profiles']['Row']

interface AssetWithContributor extends Asset {
  contributor?: Profile | null
}

interface PendingAssetsListProps {
  assets: AssetWithContributor[]
}

/**
 * PendingAssetsList Component
 * 
 * Client component that displays pending assets with approve/reject actions.
 */
export default function PendingAssetsList({ assets: initialAssets }: PendingAssetsListProps) {
  const [assets, setAssets] = useState(initialAssets)
  const [processing, setProcessing] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState<{ [key: string]: string }>({})
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null)

  /**
   * Handle approve action
   */
  const handleApprove = async (assetId: string) => {
    setProcessing(assetId)
    setError(null)

    try {
      const response = await fetch('/api/admin/asset/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assetId }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to approve asset')
      }

      // Remove asset from list
      setAssets(assets.filter((asset) => asset.id !== assetId))
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      console.error('Approve error:', err)
    } finally {
      setProcessing(null)
    }
  }

  /**
   * Handle reject action
   */
  const handleReject = async (assetId: string) => {
    setProcessing(assetId)
    setError(null)

    const reason = rejectReason[assetId] || ''

    try {
      const response = await fetch('/api/admin/asset/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assetId,
          reason: reason.trim() || undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to reject asset')
      }

      // Remove asset from list
      setAssets(assets.filter((asset) => asset.id !== assetId))
      setShowRejectModal(null)
      setRejectReason({ ...rejectReason, [assetId]: '' })
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      console.error('Reject error:', err)
    } finally {
      setProcessing(null)
    }
  }

  /**
   * Get preview URL for asset
   */
  const getPreviewUrl = (asset: AssetWithContributor) => {
    if (asset.preview_path) {
      return asset.preview_path
    }
    if (asset.type === 'image' && asset.storage_path) {
      const { data } = supabase.storage
        .from('assets')
        .getPublicUrl(asset.storage_path)
      return data.publicUrl
    }
    return null
  }

  /**
   * Format file type badge
   */
  const getTypeBadge = (type: string) => {
    const colors: { [key: string]: string } = {
      image: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      video: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      '3d': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      other: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    }
    return colors[type] || colors.other
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {assets.map((asset) => {
        const previewUrl = getPreviewUrl(asset)
        const isProcessing = processing === asset.id
        const showModal = showRejectModal === asset.id

        return (
          <div
            key={asset.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* Preview */}
              {previewUrl && (
                <div className="flex-shrink-0">
                  <img
                    src={previewUrl}
                    alt={asset.title}
                    className="w-full md:w-48 h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                      {asset.title}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getTypeBadge(
                          asset.type
                        )}`}
                      >
                        {asset.type.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ${Number(asset.price).toFixed(2)}
                      </span>
                      {asset.contributor?.username && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          by {asset.contributor.username}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {asset.description && (
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {asset.description}
                  </p>
                )}

                {asset.tags && asset.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {asset.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Uploaded: {new Date(asset.created_at || '').toLocaleString()}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(asset.id)}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {isProcessing ? 'Processing...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => setShowRejectModal(asset.id)}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>

            {/* Reject Modal */}
            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Reject Asset
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Please provide a reason for rejection (optional):
                  </p>
                  <textarea
                    value={rejectReason[asset.id] || ''}
                    onChange={(e) =>
                      setRejectReason({
                        ...rejectReason,
                        [asset.id]: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4"
                    placeholder="Reason for rejection..."
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleReject(asset.id)}
                      disabled={isProcessing}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      {isProcessing ? 'Processing...' : 'Confirm Reject'}
                    </button>
                    <button
                      onClick={() => {
                        setShowRejectModal(null)
                        setRejectReason({ ...rejectReason, [asset.id]: '' })
                      }}
                      disabled={isProcessing}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

