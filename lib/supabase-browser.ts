import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    "https://mnrstfenfqvrohcjrwx.supabase.co",
    "sb_publishable_PEimt--Ur3iMRHHX-8tUOw_S5Q0ASST",
  )
}

export interface Profile {
  id: string
  display_name: string
  slug: string
  bio: string | null
  avatar_url: string | null
  instagram_handle: string | null
  tiktok_handle: string | null
  youtube_handle: string | null
  follower_count: number
  engagement_rate: number
  is_published: boolean
}

export interface RateConfigRow {
  id: string
  profile_id: string
  post_type: string
  label: string
  description: string | null
  multiplier: number
  manual_override_cents: number | null
  is_enabled: boolean
  sort_order: number
}

export interface InquiryRow {
  id: string
  created_at: string
  profile_id: string
  brand_name: string
  contact_email: string
  message: string | null
  selected_post_types: string[]
  addons: Record<string, boolean> | null
  quoted_total_cents: number
  status: string
}
