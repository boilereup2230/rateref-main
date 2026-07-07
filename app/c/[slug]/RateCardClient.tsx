'use client'

import { useState, useEffect } from 'react'
import { createClient, type Profile, type RateConfigRow } from '@/lib/supabase-browser'
import { calculatePrice, buildQuote, formatCents, ADDON_RATES, NICHE_KEY_MAP, type AddonKey } from '@/lib/pricing'

interface Props {
  profile:      Profile
  rateConfigs:  RateConfigRow[]
  agencySource: string | null
}

const ADDON_LABELS: Record<AddonKey, string> = {
  whitelisting: 'Whitelisting +20%',
  exclusivity:  'Exclusivity +30%',
  rush:         'Rush fee +15%',
}
const ADDON_DESCS: Record<AddonKey, string> = {
  whitelisting: 'Brand runs ads through your account',
  exclusivity:  'No competing brands for 30 days',
  rush:         'Delivery in under 48 hours',
}

const NICHE_GRADIENTS: Record<string, string> = {
  'Sports & Fitness':   'linear-gradient(135deg, #0a4f3d 0%, #0f6e56 40%, #1d9e75 100%)',
  'Health & Wellness':  'linear-gradient(135deg, #0f6e56 0%, #3b6d11 60%, #97c459 100%)',
  'Nutrition & Food':   'linear-gradient(135deg, #854f0b 0%, #ba7517 60%, #ef9f27 100%)',
  'Lifestyle':          'linear-gradient(135deg, #534ab7 0%, #7f77dd 60%, #afa9ec 100%)',
  'Fashion & Beauty':   'linear-gradient(135deg, #993556 0%, #d4537e 60%, #ed93b1 100%)',
  'Tech & SaaS':        'linear-gradient(135deg, #185fa5 0%, #378add 60%, #85b7eb 100%)',
  'Business & Finance': 'linear-gradient(135deg, #3c3489 0%, #534ab7 60%, #7f77dd 100%)',
  'Travel':             'linear-gradient(135deg, #0c447c 0%, #185fa5 60%, #378add 100%)',
  'Gaming':             'linear-gradient(135deg, #534ab7 0%, #993556 60%, #d4537e 100%)',
  'Education':          'linear-gradient(135deg, #185fa5 0%, #0f6e56 60%, #1d9e75 100%)',
  'Entertainment':      'linear-gradient(135deg, #993556 0%, #534ab7 60%, #7f77dd 100%)',
  'Parenting & Family': 'linear-gradient(135deg, #0f6e56 0%, #185fa5 60%, #378add 100%)',
  'Other':              'linear-gradient(135deg, #444441 0%, #888780 60%, #b4b2a9 100%)',
}

const DEFAULT_GRADIENT = 'linear-gradient(135deg, #1d9e75 0%, #185fa5 100%)'

export default function RateCardClient({ profile, rateConfigs, agencySource }: Props) {
  const supabase = createClient()

  const [selected,  setSelected]  = useState<Record<string, boolean>>({})
  const [addons,    setAddons]    = useState<Partial<Record<AddonKey, boolean>>>({})
  const [brandName, setBrandName] = useState('')
  const [email,     setEmail]     = useState('')
  const [message,   setMessage]   = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [sending,   setSending]   = useState(false)
  const [error,     setError]     = useState('')
  const [isOwner,   setIsOwner]   = useState(false)
  const [showBonusInfo, setShowBonusInfo] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user && user.id === profile.id) setIsOwner(true)
    })
  }, [profile.id])

  const selectedConfigs  = rateConfigs.filter(c => selected[c.id])
  const customTerms      = (profile as any).custom_terms as string | null
  const avgMonthlyViews  = (profile as any).avg_monthly_views as number | null
  const pastBrands       = (profile as any).past_brands as string | null
  const contentNiche     = (profile as any).content_niche as string | null
  const turnaroundDays   = (profile as any).turnaround_days as number | null
  const headerPhotoUrl   = (profile as any).header_photo_url as string | null
  const headerVideoUrl   = (profile as any).header_video_url as string | null
  const isNcaaAthlete    = Boolean((profile as any).is_ncaa_athlete)
  const pastBrandList    = pastBrands ? pastBrands.split(',').map((b: string) => b.trim()).filter(Boolean) : []
  const nicheKey         = contentNiche ? (NICHE_KEY_MAP[contentNiche] ?? null) : null
  const headerGradient   = contentNiche ? (NICHE_GRADIENTS[contentNiche] ?? DEFAULT_GRADIENT) : DEFAULT_GRADIENT

  const quote = selectedConfigs.length > 0
    ? buildQuote(profile.follower_count, profile.engagement_rate, selectedConfigs, addons, nicheKey, avgMonthlyViews)
    : null

  function toggleConfig(id: string) {
    setSelected(s => ({ ...s, [id]: !s[id] }))
  }

  function toggleAddon(key: AddonKey) {
    setAddons(a => ({ ...a, [key]: !a[key] }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!quote || selectedConfigs.length === 0) return
    setSending(true)
    setError('')

    const { error } = await supabase.from('inquiries').insert({
      profile_id:          profile.id,
      brand_name:          brandName,
      contact_email:       email,
      message:             message || null,
      selected_post_types: selectedConfigs.map(c => c.post_type),
      addons:              addons,
      quoted_total_cents:  quote.totalCents,
      agency_source:       agencySource || null,
    })

    if (error) {
      setError('Something went wrong. Please try again.')
      setSending(false)
      return
    }

    await fetch('/api/send-inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creatorEmail: profile.email,
        creatorName:  profile.display_name,
        brandName,
        contactEmail: email,
        message,
        total:        quote.totalFormatted,
      }),
    })

    setSubmitted(true)
  }

  const initials = profile.display_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="min-h-screen bg-gray-50">

      {isOwner && (
        <div className="bg-emerald-600 px-4 py-2 flex items-center justify-between">
          <span className="text-xs text-emerald-100">You are viewing your public rate card</span>
          <a href="/dashboard"
            className="text-xs font-medium text-white bg-emerald-700 hover:bg-emerald-800 px-3 py-1.5 rounded-lg transition-colors">
            Back to Dashboard
          </a>
        </div>
      )}

      <div className="max-w-xl mx-auto px-4 py-8 pb-16">

        {/* Profile header */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-4">

          {/* Header — video > photo > gradient */}
          <div className="relative w-full h-28 overflow-hidden">
            {headerVideoUrl ? (
              <video
                src={headerVideoUrl}
                className="w-full h-full object-cover"
                autoPlay muted loop playsInline
              />
            ) : headerPhotoUrl ? (
              <img
                src={headerPhotoUrl}
                alt="Header"
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full" style={{ background: headerGradient }} />
            )}
            {/* Gradient scrim */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)' }} />
            {/* Name + badges + avatar overlaid */}
            <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 flex items-end justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 font-semibold text-base flex-shrink-0 overflow-hidden border-2 border-white shadow-sm">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile.display_name} className="w-full h-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <div>
                  <h1 className="font-semibold text-white text-sm leading-tight" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>{profile.display_name}</h1>
                  <div className="flex items-center gap-2 flex-wrap mt-0.5">
                    <span className="inline-flex items-center gap-1 text-xs bg-white/20 backdrop-blur text-white px-2 py-0.5 rounded-full">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </span>
                    {contentNiche && (
                      <span className="text-xs bg-white/20 backdrop-blur text-white px-2 py-0.5 rounded-full">{contentNiche}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right text-xs pb-0.5">
                <span className="text-white/70">Live rates</span><br/>
                <span className="text-emerald-300">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            </div>
          </div>

          <div className="px-5 pt-4 pb-4">
            {(profile.instagram_handle || profile.tiktok_handle) && (
              <div className="flex items-center gap-3 mb-1">
                {profile.instagram_handle && (
                  <span className="text-xs text-gray-400">@{profile.instagram_handle}</span>
                )}
                {profile.tiktok_handle && (
                  <span className="text-xs text-gray-400">@{profile.tiktok_handle}</span>
                )}
              </div>
            )}
            {profile.bio && (
              <p className="text-sm text-gray-500 mt-1">{profile.bio}</p>
            )}
            {turnaroundDays && (
              <p className="text-xs text-gray-400 mt-2">⏱ Standard turnaround: <span className="text-gray-600 font-medium">{turnaroundDays} days</span></p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className={`grid gap-3 mb-4 ${avgMonthlyViews ? 'grid-cols-4' : 'grid-cols-3'}`}>
          <StatTile value={formatFollowers(profile.follower_count)} label="Followers" />
          <StatTile
            value={`${profile.engagement_rate.toFixed(1)}%`}
            label="Engagement"
            highlight={profile.engagement_rate >= 3}
            onInfoClick={profile.engagement_rate >= 3 ? () => setShowBonusInfo(v => !v) : undefined}
          />
          <StatTile value={formatFollowers(Math.round(profile.follower_count * profile.engagement_rate / 100))} label="Est. reach" />
          {avgMonthlyViews && (
            <StatTile value={formatFollowers(avgMonthlyViews)} label="Avg. views/video" highlight />
          )}
        </div>

        {showBonusInfo && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-4 text-xs text-emerald-800 leading-relaxed">
            <strong>What is Bonus Tier pricing?</strong><br/>
            This creator's engagement rate exceeds 3%, meaning their audience is significantly more active than average. Bonus tier pricing applies a multiplier to base rates, reflecting the higher commercial value of a genuinely engaged audience vs. follower count alone.
          </div>
        )}

        {/* Past brand partnerships */}
        {pastBrandList.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Brand partnerships</p>
            <div className="flex flex-wrap gap-2">
              {pastBrandList.map((brand: string) => (
                <span key={brand} className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-xs font-medium text-gray-700">
                  {brand}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Deliverables */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-4">
          <div className="px-5 py-3.5 border-b border-gray-100">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Select deliverables</p>
          </div>
          {rateConfigs.map(cfg => {
            const result = calculatePrice(profile.follower_count, profile.engagement_rate, cfg.multiplier, cfg.manual_override_cents, cfg.post_type, nicheKey, avgMonthlyViews)
            const isActive = !!selected[cfg.id]
            return (
              <button key={cfg.id} onClick={() => toggleConfig(cfg.id)}
                className={`w-full px-5 py-4 flex items-center gap-3 text-left border-b border-gray-100 last:border-0 transition-colors ${isActive ? 'bg-emerald-50' : 'hover:bg-gray-50'}`}>
                <div className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border transition-colors ${isActive ? 'bg-emerald-600 border-emerald-600' : 'border-gray-300'}`}>
                  {isActive && <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{cfg.label}</p>
                  {cfg.description && <p className="text-xs text-gray-400 mt-0.5 truncate">{cfg.description}</p>}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-gray-900">{result.priceFormatted}</p>
                  {result.bonusApplied && !result.isManualOverride && (
                    <button type="button" onClick={e => { e.stopPropagation(); setShowBonusInfo(v => !v) }}
                      className="text-xs text-emerald-600 mt-0.5 hover:text-emerald-700 hover:underline">
                      Bonus tier
                    </button>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Add-ons */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Add-ons</p>
          <div className="space-y-2">
            {(Object.keys(ADDON_RATES) as AddonKey[]).map(key => (
              <button key={key} onClick={() => toggleAddon(key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-colors text-left ${addons[key] ? 'border-emerald-200 bg-emerald-50' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'}`}>
                <div className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${addons[key] ? 'bg-emerald-600 border-emerald-600' : 'border-gray-300'}`}>
                  {addons[key] && <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{ADDON_LABELS[key]}</p>
                  <p className="text-xs text-gray-400">{ADDON_DESCS[key]}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quote */}
        {quote && (
          <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Campaign quote</p>
            <div className="space-y-1.5">
              {quote.lineItems.map(item => (
                <div key={item.label} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="text-gray-900">{formatCents(item.priceCents)}</span>
                </div>
              ))}
              {quote.addonItems.map(item => (
                <div key={item.label} className="flex justify-between text-sm">
                  <span className="text-gray-400">{item.label}</span>
                  <span className="text-gray-600">+{formatCents(item.priceCents)}</span>
                </div>
              ))}
              <div className="flex justify-between text-base font-semibold pt-2 mt-1 border-t border-gray-100">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">{quote.totalFormatted}</span>
              </div>
            </div>
          </div>
        )}

        {/* NCAA compliance disclaimer */}
        {isNcaaAthlete && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-4">
            <p className="text-xs font-medium text-blue-700 uppercase tracking-wider mb-2">NCAA compliance notice</p>
            <p className="text-sm text-blue-900 leading-relaxed">
              This creator is a current NCAA student-athlete. Any Name, Image, and Likeness (NIL) agreement must comply with NCAA regulations and any applicable state, university, or conference policies. Brands are responsible for ensuring their own compliance with these rules before finalizing any agreement.
            </p>
          </div>
        )}

        {/* Custom terms */}
        {customTerms && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-4">
            <p className="text-xs font-medium text-amber-700 uppercase tracking-wider mb-2">Brand deal terms</p>
            <p className="text-sm text-amber-900 leading-relaxed whitespace-pre-wrap">{customTerms}</p>
          </div>
        )}

        {/* Booking form */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">Send booking request</p>
          {submitted ? (
            <div className="text-center py-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              </div>
              <p className="font-medium text-gray-900 text-sm">Request sent to {profile.display_name}!</p>
              <p className="text-xs text-gray-400 mt-1">They'll be in touch within 48 hours. Your quote has been saved.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Brand name *</label>
                  <input required value={brandName} onChange={e => setBrandName(e.target.value)} placeholder="Acme Co."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Email *</label>
                  <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@brand.com"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Campaign brief (optional)</label>
                <textarea value={message} onChange={e => setMessage(e.target.value)}
                  placeholder="Tell us about your campaign goals, timeline, or any specifics…" rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
              </div>

              {/* Legal disclaimer */}
              <p className="text-xs text-gray-400 leading-relaxed">
                Submitting this request does not constitute a binding agreement. All deals are negotiated directly between brand and creator. RateRef is not a party to any agreement and assumes no liability for transactions between brands and creators.
              </p>

              {error && <p className="text-sm text-red-600">{error}</p>}
              <button type="submit" disabled={sending || selectedConfigs.length === 0}
                className="w-full py-3 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                {sending ? 'Sending…' : selectedConfigs.length === 0 ? 'Select deliverables above first' : `Send request${quote ? ` · ${quote.totalFormatted}` : ''}`}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Powered by{' '}
          <a href="/" className="text-gray-500 hover:text-gray-700 font-medium">RateRef</a>
          {' '}· Get your own live rate card
        </p>
      </div>
    </div>
  )
}

function StatTile({ value, label, highlight, onInfoClick }: { value: string; label: string; highlight?: boolean; onInfoClick?: () => void }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 px-3 py-3 text-center">
      <p className={`text-lg font-semibold ${highlight ? 'text-emerald-600' : 'text-gray-900'}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-0.5">{label}</p>
      {highlight && onInfoClick && (
        <button type="button" onClick={onInfoClick}
          className="text-xs text-emerald-500 mt-0.5 hover:text-emerald-700 hover:underline cursor-pointer">
          Bonus tier
        </button>
      )}
    </div>
  )
}

function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}
