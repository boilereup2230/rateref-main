import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import RatesManager from '@/components/dashboard/RatesManager'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/setup')
  const { data: rateConfigs } = await supabase.from('rate_configs').select('*').eq('profile_id', user.id).order('sort_order')
  const { data: inquiries } = await supabase.from('inquiries').select('*').eq('profile_id', user.id).order('created_at', { ascending: false }).limit(20)
  return <RatesManager profile={profile} rateConfigs={rateConfigs ?? []} inquiries={inquiries ?? []} />
}
