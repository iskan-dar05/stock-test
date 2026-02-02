import { createUserSupabase } from '@/lib/supabaseServer'
import SettingsForm from '@/components/admin/SettingsForm'

export default async function SettingsPage() {
  // Auth check is handled by the layout

  const supabase = await createUserSupabase()

  const { data: settings } = await supabase.from('admin_settings').select('*').eq('id', 'main').maybeSingle()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Configure platform settings</p>
      </div>

      <SettingsForm settings={settings} />
    </div>
  )
}

