'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import { formatCents } from '@/lib/pricing'

interface Agency {
  id: string
  display_name: string
  agency_code: string
  email: string
}

interface Inquiry {
  id: string
  brand_name: string
  contact_email: string
  message: string | null
  quoted_total_cents: number
  status: string
  created_at: string
  agency_source: string | null
  profiles: {
    display_name: string
    slug: string
  }
}

const STATUS_STYLES: Record<string, string> = {
  new:       'bg-blue-50 text-blue-700',
  contacted: 'bg-amber-50 text-amber-700',
  booked:    'bg-emerald-50 text-emerald-700',
  declined:  'bg-red-50 text-red-700',
}

export default function AgencyDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [agency, setAgency] = useState<Agency | null>(null)
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: agencyData } = await supabase
        .from('agencies')
        .select('*')
        .eq('owner_id', user.id)
        .single()

      if (!agencyData) { router.push('/agency/signup'); return }

      setAgency(agencyData)

      const { data: inquiriesData, error: inquiriesError } = await supabase
        .from('inquiries')
        .select('*, profiles(display_name, slug)')
        .eq('agency_source', agencyData.agency_code)
        .order('created_at', { ascending: false })

      if (inquiriesError) {
        setError('Failed to load inquiries.')
      } else {
        setInquiries(inquiriesData ?? [])
      }

      setLoading(false)
    }
    load()
  }, [router])

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-400 text-sm">Loading your agency dashboard...</p>
    </div>
  )

  if (!agency) return null

  const newCount = inquiries.filter(i => i.status === 'new').length

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-gray-900">RateRef</span>
          <span className="text-gray-300">|</span>
          <span className="text-sm text-gray-500">{agency.display_name}</span>
        </div>
        <button onClick={signOut} className="text-sm text-gray-400 hover:text-gray-600">
          Sign out
        </button>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 px-4 py-3">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Total inquiries</p>
            <p className="text-xl font-medium text-gray-900 mt-1">{inquiries.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 px-4 py-3">
            <p className="text-xs text-gray-400 uppercase tracking-wider">New</p>
            <p className="text-xl font-medium text-gray-900 mt-1">{newCount}</p>
            {newCount > 0 && <p className="text-xs text-emerald-600 mt-0.5">Needs attention</p>}
          </div>
          <div className="bg-white rounded-xl border border-gray-200 px-4 py-3">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Booked</p>
            <p className="text-xl font-medium text-gray-900 mt-1">{inquiries.filter(i => i.status === 'booked').length}</p>
          </div>
        </div>

        {/* Agency link tag */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Your agency link tag</p>
          <p className="text-sm text-gray-600 mb-3">
            Append this to any creator's RateRef link when sharing with brands. Inquiries will appear here automatically.
          </p>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-50 rounded-lg px-4 py-3 font-mono text-sm text-emerald-700 font-semibold">
              ?via={agency.agency_code}
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(`?via=${agency.agency_code}`)}
              className="px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
              Copy
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Example: rateref.co/c/creatorname?via={agency.agency_code}
          </p>
        </div>

        {/* Inquiries */}
        <div>
          <h2 className="text-sm font-medium text-gray-900 mb-4">
            Agency inquiries
            {newCount > 0 && (
              <span className="ml-2 bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">{newCount} new</span>
            )}
          </h2>

          {inquiries.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
              <p className="text-gray-400 text-sm">No agency inquiries yet.</p>
              <p className="text-gray-400 text-sm mt-1">
                Share creator links with your agency tag appended to start seeing inquiries here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {inquiries.map(inq => (
                <div key={inq.id} className="bg-white rounded-2xl border border-gray-200 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900 text-sm">{inq.brand_name}</p>
                        <span className="text-gray-300">·</span>
                        <a href={`/c/${inq.profiles?.slug}`} target="_blank"
                          className="text-xs text-emerald-600 hover:underline">
                          {inq.profiles?.display_name}
                        </a>
                      </div>
                      <p className="text-xs text-gray-400">{inq.contact_email}</p>
                      {inq.message && <p className="text-sm text-gray-600 mt-2">{inq.message}</p>}
                      <a href={`mailto:${inq.contact_email}`}
                        className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-emerald-600 hover:text-emerald-700 hover:underline">
                        Reply to {inq.brand_name} →
                      </a>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-medium text-gray-900 text-sm">{formatCents(inq.quoted_total_cents)}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(inq.created_at).toLocaleDateString()}
                      </p>
                      <span className={`mt-2 inline-block px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[inq.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {inq.status.charAt(0).toUpperCase() + inq.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
