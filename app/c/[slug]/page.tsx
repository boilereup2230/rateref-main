import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import RateCardClient from './RateCardClient'
import type { Metadata } from 'next'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: `Rate Card — ${params.slug} | RateRef`, description: 'View live rates and book a collaboration' }
}

export default async function PublicRateCardPage({ params }: Props) {
  const supabase = await createServerSupabaseClient()
  const { data: profile } = await supabase.from('profiles').select('*').eq('slug', params.slug).eq('is_published', true).single()
  if (!profile) notFound()
  const { data: rateConfigs } = await supabase.from('rate_configs').select('*').eq('profile_id', profile.id).eq('is_enabled', true).order('sort_order')
  return <RateCardClient profile={profile} rateConfigs={rateConfigs ?? []} />
}
