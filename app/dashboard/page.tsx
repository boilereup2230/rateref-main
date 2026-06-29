'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import RatesManager from '@/components/dashboard/RatesManager'
import type { Profile, RateConfigRow, InquiryRow } from '@/lib/supabase-browser'

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [rateConfigs, setRateConfigs] = useState<RateConfigRow[]>([])
  const [inquiries, setInquiries] = useState<InquiryRow[]>([])
  const [monthlyInquiryCount, setMonthlyInquiryCount] = useState(0)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (!profileData) { router.push('/setup'); return }
      const { data: rateConfigsData } = await supabase.from('rate_configs').select('*').eq('profile_id', user.id).order('sort_order')
      const { data: inquiriesData } = await supabase.from('inquiries').select('*').eq('profile_id', user.id).order('created_at', { ascending: false }).limit(20)
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)
      const { count } = await supabase.from('inquiries')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', user.id)
        .gte('created_at', startOfMonth.toISOString())
      setProfile(profileData)
      setRateConfigs(rateConfigsData ?? [])
      setInquiries(inquiriesData ?? [])
      setMonthlyInquiryCount(count ?? 0)
      setLoading(false)
    }
    load()
  }, [router])

  if (loading) return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', color: '#6b7280' }}>
      Loading your dashboard...
    </div>
  )
  if (!profile) return null
  return <RatesManager profile={profile} rateConfigs={rateConfigs} inquiries={inquiries} monthlyInquiryCount={monthlyInquiryCount} />
}
