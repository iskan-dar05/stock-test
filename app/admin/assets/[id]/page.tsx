// Auth check is handled by the layout
import { createUserSupabase } from '@/lib/supabaseServer'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AssetEditForm from '@/components/admin/AssetEditForm'

export default async function AssetDetailPage({ params }: { params: { id: string } }) {
  // Auth check is handled by the layout


  const supabase = createUserSupabase()

  const { data: asset } = await supabase
    .from('assets')
    .select('*, profiles(username, avatar_url)')
    .eq('id', params.id)
    .maybeSingle()

  if (!asset) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/assets" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 mb-2 inline-block">
          ← Back to Assets
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Asset</h1>
      </div>

      <AssetEditForm asset={asset} />
    </div>
  )
}

