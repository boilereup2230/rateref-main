'use client'

import { useState, useTransition } from 'react'
import { createClient, type Profile, type RateConfigRow, type InquiryRow } from '@/lib/supabase-browser'
import { calculatePrice, formatCents } from '@/lib/pricing'

interface Props {
  profile:     Profile
  rateConfigs: RateConfigRow[]
  inquiries:   InquiryRow[]
}

type Tab = 'rates' | 'inquiries' | 'settings'

export default function RatesManager({ profile, rateConfigs: initial, inquiries }: Props) {
  const supabase    = createClient()
  const [tab, setTab]           = useState<Tab>('rates')
  const [configs, setConfigs]   = useState(initial)
  const [dirty, setDirty]       = useState<Set<string>>(new Set())
  const [saving, startSave]     = useTransition()
  const [saved,  setSaved]      = useState(false)
  const [error,  setError]      = useState('')

  // Profile editing
  const [followers,   setFollowers]   = useState(String(profile.follower_count))
  const [engagement,  setEngagement]  = useState(String(profile.engagement_rate))

  function updateConfig(id: string, patch: Partial<RateConfigRow>) {
    setConfigs(cs => cs.map(c => c.id === id ? { ...c, ...patch } : c))
    setDirty(d => new Set(d).add(id))
    setSaved(false)
  }

  function handleOverrideInput(id: string, raw: string) {
    const digits = raw.replace(/[^0-9.]/g, '')
    const cents  = digits ? Math.round(parseFloat(digits) * 100) : null
    updateConfig(id, { manual_override_cents: cents })
  }

  function handleSave() {
    setError('')
    startSave(async () => {
      const dirtyConfigs = configs.filter(c => dirty.has(c.id))
      for (const cfg of dirtyConfigs) {
        const { error } = await supabase.from('rate_configs').update({
          is_enabled:            cfg.is_enabled,
          manual_override_cents: cfg.manual_override_cents,
        }).eq('id', cfg.id)
        if (error) { setError('Save failed — please try again.'); return }
      }

      // Update follower/engagement on profile
      const followerNum   = parseInt(followers)   || profile.follower_count
      const engagementNum = parseFloat(engagement) || profile.engagement_rate
      await supabase.from('profiles').update({
        follower_count:  followerNum,
        engagement_rate: engagementNum,
      }).eq('id', profile.id)

      setDirty(new Set())
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    })
  }

  async function signOut() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const engagementNum  = parseFloat(engagement)  || 0
  const followerNum    = parseInt(followers)      || 0
  const publicUrl      = `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/c/${profile.slug}`
  const newInquiries   = inquiries.filter(i => i.status === 'new').length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-gray-900">RateRef</span>
          <span className="text-gray-300">|</span>
          <span className="text-sm text-gray-500">{profile.display_name}</span>
        </div>
        <div className="flex items-center gap-3">
          <a href={publicUrl} target="_blank"
            className="text-sm text-emerald-600 hover:underline flex items-center gap-1">
            View my card ↗
          </a>
          <button onClick={signOut}
            className="text-sm text-gray-400 hover:text-gray-600">Sign out</button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard label="Followers" value={followerNum.toLocaleString()} />
          <StatCard label="Engagement rate"
            value={`${engagementNum.toFixed(1)}%`}
            sub={engagementNum >= 3 ? '⚡ Bonus tier active' : undefined} />
          <StatCard label="Pending inquiries" value={String(newInquiries)}
            sub={newInquiries > 0 ? 'Needs attention' : undefined} />
        </div>

        {/* Update metrics */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
            Update your metrics
          </p>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Total followers</label>
              <input value={followers} onChange={e => setFollowers(e.target.value)}
                type="number" min="0"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Engagement rate %</label>
              <input value={engagement} onChange={e => setEngagement(e.target.value)}
                type="number" min="0" max="100" step="0.1"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
          {(['rates', 'inquiries', 'settings'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
              {t === 'inquiries' && newInquiries > 0 &&
                <span className="ml-1.5 bg-red-100 text-red-700 text-xs px-1.5 py-0.5 rounded-full">{newInquiries}</span>
              }
            </button>
          ))}
        </div>

        {/* ── RATES TAB ── */}
        {tab === 'rates' && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Post types</p>
              <p className="text-xs text-gray-400">Toggle off to hide from your public card</p>
            </div>
            {configs.map(cfg => {
              const result  = calculatePrice(followerNum, engagementNum, cfg.multiplier, cfg.manual_override_cents)
              const isDirty = dirty.has(cfg.id)
              return (
                <div key={cfg.id}
                  className={`px-5 py-4 border-b border-gray-100 last:border-0 ${!cfg.is_enabled ? 'opacity-50' : ''}`}>
                  <div className="flex items-start gap-4">
                    {/* Toggle */}
                    <button onClick={() => updateConfig(cfg.id, { is_enabled: !cfg.is_enabled })}
                      className={`mt-0.5 w-9 h-5 rounded-full transition-colors flex-shrink-0 ${
                        cfg.is_enabled ? 'bg-emerald-500' : 'bg-gray-200'
                      }`}>
                      <div className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transform transition-transform mx-0.5 ${
                        cfg.is_enabled ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </button>

                    {/* Label */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{cfg.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{cfg.description}</p>
                    </div>

                    {/* Price + override */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-medium text-gray-900">{result.priceFormatted}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {result.isManualOverride ? 'Custom price' : result.bonusApplied ? '⚡ Bonus applied' : 'Formula rate'}
                      </p>
                      <div className="mt-2 flex items-center gap-1">
                        <span className="text-xs text-gray-400">$</span>
                        <input
                          type="text" inputMode="decimal"
                          placeholder="Override"
                          value={cfg.manual_override_cents ? (cfg.manual_override_cents / 100).toFixed(0) : ''}
                          onChange={e => handleOverrideInput(cfg.id, e.target.value)}
                          className="w-20 px-2 py-1 border border-gray-200 rounded-md text-xs text-right focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                  {isDirty && <p className="text-xs text-amber-500 mt-1 text-right">Unsaved changes</p>}
                </div>
              )
            })}

            {/* Save bar */}
            <div className="px-5 py-4 bg-gray-50 flex items-center justify-between">
              {error && <p className="text-sm text-red-600">{error}</p>}
              {saved  && <p className="text-sm text-emerald-600">✓ Saved</p>}
              {!error && !saved && <p className="text-xs text-gray-400">
                {dirty.size > 0 ? `${dirty.size} unsaved change${dirty.size > 1 ? 's' : ''}` : 'All changes saved'}
              </p>}
              <button onClick={handleSave} disabled={saving || dirty.size === 0}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-40 transition-colors">
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </div>
        )}

        {/* ── INQUIRIES TAB ── */}
        {tab === 'inquiries' && (
          <div className="space-y-3">
            {inquiries.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                <p className="text-gray-400 text-sm">No inquiries yet.</p>
                <p className="text-gray-400 text-sm mt-1">Share your rate card link to start getting brand requests.</p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <input readOnly value={publicUrl}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 w-72" />
                  <button onClick={() => navigator.clipboard.writeText(publicUrl)}
                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
                    Copy
                  </button>
                </div>
              </div>
            )}
            {inquiries.map(inq => (
              <div key={inq.id} className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{inq.brand_name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{inq.contact_email}</p>
                    {inq.message && <p className="text-sm text-gray-600 mt-2">{inq.message}</p>}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {inq.selected_post_types.map(pt => (
                        <span key={pt} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">{pt}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-medium text-gray-900 text-sm">{formatCents(inq.quoted_total_cents)}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(inq.created_at).toLocaleDateString()}
                    </p>
                    <span className={`mt-2 inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      inq.status === 'new' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {inq.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── SETTINGS TAB ── */}
        {tab === 'settings' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm font-medium text-gray-700 mb-4">Your public link</p>
            <div className="flex items-center gap-2 mb-6">
              <input readOnly value={publicUrl}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600" />
              <button onClick={() => navigator.clipboard.writeText(publicUrl)}
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50">
                Copy
              </button>
              <a href={publicUrl} target="_blank"
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50">
                Open ↗
              </a>
            </div>
            <p className="text-xs text-gray-400">
              Share this link in your Instagram bio, email signature, or DMs. Brands will see your live rates and can submit booking requests directly.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 px-4 py-3">
      <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-xl font-medium text-gray-900 mt-1">{value}</p>
      {sub && <p className="text-xs text-emerald-600 mt-0.5">{sub}</p>}
    </div>
  )
}
