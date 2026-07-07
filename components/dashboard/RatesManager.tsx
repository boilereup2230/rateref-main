'use client'

import { useState, useTransition } from 'react'
import { createClient, type Profile, type RateConfigRow, type InquiryRow } from '@/lib/supabase-browser'
import { calculatePrice, formatCents } from '@/lib/pricing'

interface Props {
  profile: Profile
  rateConfigs: RateConfigRow[]
  inquiries: InquiryRow[]
  monthlyInquiryCount: number
}

type Tab = 'rates' | 'inquiries' | 'settings'

const STATUS_OPTIONS = ['new', 'contacted', 'booked', 'declined'] as const
type Status = typeof STATUS_OPTIONS[number]

const STATUS_STYLES: Record<Status, string> = {
  new: 'bg-blue-50 text-blue-700',
  contacted: 'bg-amber-50 text-amber-700',
  booked: 'bg-emerald-50 text-emerald-700',
  declined: 'bg-red-50 text-red-700',
}

const NICHE_OPTIONS = [
  { value: '', label: 'Select a niche…' },
  { value: 'Sports & Fitness', label: 'Sports & Fitness' },
  { value: 'Health & Wellness', label: 'Health & Wellness' },
  { value: 'Nutrition & Food', label: 'Nutrition & Food' },
  { value: 'Lifestyle', label: 'Lifestyle' },
  { value: 'Fashion & Beauty', label: 'Fashion & Beauty' },
  { value: 'Tech & SaaS', label: 'Tech & SaaS' },
  { value: 'Business & Finance', label: 'Business & Finance' },
  { value: 'Travel', label: 'Travel' },
  { value: 'Gaming', label: 'Gaming' },
  { value: 'Education', label: 'Education' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Parenting & Family', label: 'Parenting & Family' },
  { value: 'Other', label: 'Other' },
]

export default function RatesManager({ profile, rateConfigs: initial, inquiries: initialInquiries, monthlyInquiryCount }: Props) {
  const supabase = createClient()
  const [tab, setTab] = useState<Tab>('rates')
  const [configs, setConfigs] = useState(initial)
  const [dirty, setDirty] = useState<Set<string>>(new Set())
  const [metricsDirty, setMetricsDirty] = useState(false)
  const [saving, startSave] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [followers, setFollowers] = useState(String(profile.follower_count))
  const [engagement, setEngagement] = useState(String(profile.engagement_rate))
  const [avgMonthlyViews, setAvgMonthlyViews] = useState(String((profile as any).avg_monthly_views ?? ''))
  const [inquiries, setInquiries] = useState(initialInquiries)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState(profile.display_name ?? '')
  const [bio, setBio] = useState(profile.bio ?? '')
  const [instagramHandle, setInstagramHandle] = useState(profile.instagram_handle ?? '')
  const [tiktokHandle, setTiktokHandle] = useState(profile.tiktok_handle ?? '')
  const [youtubeHandle, setYoutubeHandle] = useState(profile.youtube_handle ?? '')
  const [customTerms, setCustomTerms] = useState((profile as any).custom_terms ?? '')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.avatar_url ?? null)
  const [headerPhotoUrl, setHeaderPhotoUrl] = useState<string | null>((profile as any).header_photo_url ?? null)
  const [headerVideoUrl, setHeaderVideoUrl] = useState<string | null>((profile as any).header_video_url ?? null)
  const [uploading, setUploading] = useState(false)
  const [uploadingHeaderPhoto, setUploadingHeaderPhoto] = useState(false)
  const [uploadingHeaderVideo, setUploadingHeaderVideo] = useState(false)
  const [profileSaving, startProfileSave] = useTransition()
  const [profileSaved, setProfileSaved] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [pastBrands, setPastBrands] = useState((profile as any).past_brands ?? '')
  const [contentNiche, setContentNiche] = useState((profile as any).content_niche ?? '')
  const [turnaroundDays, setTurnaroundDays] = useState(String((profile as any).turnaround_days ?? ''))
  const [isNcaaAthlete, setIsNcaaAthlete] = useState(Boolean((profile as any).is_ncaa_athlete))
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  function updateConfig(id: string, patch: Partial<RateConfigRow>) {
    setConfigs(cs => cs.map(c => c.id === id ? { ...c, ...patch } : c))
    setDirty(d => new Set(d).add(id))
    setSaved(false)
  }

  function handleOverrideInput(id: string, raw: string) {
    const digits = raw.replace(/[^0-9.]/g, '')
    const cents = digits ? Math.round(parseFloat(digits) * 100) : null
    updateConfig(id, { manual_override_cents: cents })
  }

  function handleMetricChange(setter: (v: string) => void, value: string) {
    setter(value)
    setMetricsDirty(true)
    setSaved(false)
  }

  function handleSave() {
    setError('')
    startSave(async () => {
      const dirtyConfigs = configs.filter(c => dirty.has(c.id))
      for (const cfg of dirtyConfigs) {
        const { error } = await supabase.from('rate_configs').update({
          is_enabled: cfg.is_enabled,
          manual_override_cents: cfg.manual_override_cents,
        }).eq('id', cfg.id)
        if (error) { setError('Save failed — please try again.'); return }
      }
      const followerNum = parseInt(followers) || profile.follower_count
      const engagementNum = parseFloat(engagement) || profile.engagement_rate
      const viewsNum = avgMonthlyViews ? parseInt(avgMonthlyViews) : null
      await supabase.from('profiles').update({
        follower_count: followerNum,
        engagement_rate: engagementNum,
        avg_monthly_views: viewsNum,
      } as any).eq('id', profile.id)
      setDirty(new Set())
      setMetricsDirty(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    })
  }

  async function handleStatusChange(inquiryId: string, newStatus: Status) {
    setUpdatingId(inquiryId)
    const { error } = await supabase.from('inquiries')
      .update({ status: newStatus })
      .eq('id', inquiryId)
    if (!error) {
      setInquiries(prev => prev.map(inq => inq.id === inquiryId ? { ...inq, status: newStatus } : inq))
    }
    setUpdatingId(null)
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setProfileError('')
    const fileExt = file.name.split('.').pop()
    const filePath = `${profile.id}/avatar.${fileExt}`
    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true })
    if (uploadError) { setProfileError(`Upload failed: ${uploadError.message}`); setUploading(false); return }
    const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath)
    const newUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`
    const { error: updateError } = await supabase.from('profiles').update({ avatar_url: newUrl }).eq('id', profile.id)
    if (updateError) { setProfileError(`Saved image but failed to update profile: ${updateError.message}`) }
    else { setAvatarUrl(newUrl); setProfileSaved(true); setTimeout(() => setProfileSaved(false), 3000) }
    setUploading(false)
  }

  async function handleHeaderPhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingHeaderPhoto(true)
    setProfileError('')
    const fileExt = file.name.split('.').pop()
    const filePath = `${profile.id}/header-photo.${fileExt}`
    const { error: uploadError } = await supabase.storage.from('headers').upload(filePath, file, { upsert: true })
    if (uploadError) { setProfileError(`Upload failed: ${uploadError.message}`); setUploadingHeaderPhoto(false); return }
    const { data: publicUrlData } = supabase.storage.from('headers').getPublicUrl(filePath)
    const newUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`
    const { error: updateError } = await supabase.from('profiles').update({ header_photo_url: newUrl } as any).eq('id', profile.id)
    if (updateError) { setProfileError(`Saved photo but failed to update profile: ${updateError.message}`) }
    else { setHeaderPhotoUrl(newUrl); setProfileSaved(true); setTimeout(() => setProfileSaved(false), 3000) }
    setUploadingHeaderPhoto(false)
  }

  async function handleHeaderVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 50 * 1024 * 1024) { setProfileError('Video must be under 50MB.'); return }
    setUploadingHeaderVideo(true)
    setProfileError('')
    const filePath = `${profile.id}/header-video.mp4`
    const { error: uploadError } = await supabase.storage.from('headers').upload(filePath, file, { upsert: true, contentType: 'video/mp4' })
    if (uploadError) { setProfileError(`Upload failed: ${uploadError.message}`); setUploadingHeaderVideo(false); return }
    const { data: publicUrlData } = supabase.storage.from('headers').getPublicUrl(filePath)
    const newUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`
    const { error: updateError } = await supabase.from('profiles').update({ header_video_url: newUrl } as any).eq('id', profile.id)
    if (updateError) { setProfileError(`Saved video but failed to update profile: ${updateError.message}`) }
    else { setHeaderVideoUrl(newUrl); setProfileSaved(true); setTimeout(() => setProfileSaved(false), 3000) }
    setUploadingHeaderVideo(false)
  }

  async function handleDeleteHeaderPhoto() {
    const { error } = await supabase.from('profiles').update({ header_photo_url: null } as any).eq('id', profile.id)
    if (!error) { setHeaderPhotoUrl(null); setProfileSaved(true); setTimeout(() => setProfileSaved(false), 3000) }
  }

  async function handleDeleteHeaderVideo() {
    const { error } = await supabase.from('profiles').update({ header_video_url: null } as any).eq('id', profile.id)
    if (!error) { setHeaderVideoUrl(null); setProfileSaved(true); setTimeout(() => setProfileSaved(false), 3000) }
  }

  function handleProfileSave() {
    setProfileError('')
    startProfileSave(async () => {
      const { error } = await supabase.from('profiles').update({
        display_name: displayName,
        bio: bio,
        instagram_handle: instagramHandle,
        tiktok_handle: tiktokHandle,
        youtube_handle: youtubeHandle,
        custom_terms: customTerms || null,
        past_brands: pastBrands || null,
        content_niche: contentNiche || null,
        turnaround_days: turnaroundDays ? parseInt(turnaroundDays) : null,
        is_ncaa_athlete: isNcaaAthlete,
      } as any).eq('id', profile.id)
      if (error) { setProfileError('Save failed — please try again.'); return }
      setProfileSaved(true)
      setTimeout(() => setProfileSaved(false), 3000)
    })
  }

  async function signOut() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  async function handleDeleteAccount() {
    if (deleteConfirmText !== 'DELETE') return
    setDeleting(true)
    setDeleteError('')
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { setDeleteError('Session expired — please log in again.'); setDeleting(false); return }
    const res = await fetch('/api/delete-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
    })
    const data = await res.json()
    if (!res.ok) {
      setDeleteError(data.error || 'Failed to delete account. Please try again.')
      setDeleting(false)
      return
    }
    window.location.href = '/'
  }

  const engagementNum = parseFloat(engagement) || 0
  const followerNum = parseInt(followers) || 0
  const publicUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/c/${profile.slug}`
  const newInquiries = inquiries.filter(i => i.status === 'new').length
  const hasChanges = dirty.size > 0 || metricsDirty

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-gray-900">RateRef</span>
          <span className="text-gray-300">|</span>
          <span className="text-sm text-gray-500">{profile.display_name}</span>
        </div>
        <div className="flex items-center gap-3">
          <a href={publicUrl} target="_blank" className="text-sm text-emerald-600 hover:underline flex items-center gap-1">View my card ↗</a>
          <button onClick={signOut} className="text-sm text-gray-400 hover:text-gray-600">Sign out</button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard label="Followers" value={followerNum.toLocaleString()} />
          <StatCard label="Engagement rate" value={`${engagementNum.toFixed(1)}%`} sub={engagementNum >= 3 ? '⚡ Bonus tier active' : undefined} />
          <StatCard label="Pending inquiries" value={String(newInquiries)} sub={newInquiries > 0 ? 'Needs attention' : undefined} />
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">{monthlyInquiryCount} inquir{monthlyInquiryCount === 1 ? 'y' : 'ies'} this month</p>
            <p className="text-xs text-gray-400 mt-0.5">Unlimited on every plan</p>
          </div>
          <span className="text-xs font-medium bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full">
            Pro ($19/mo) coming soon — remove footer branding
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Update your pricing metrics</p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Total followers</label>
              <input value={followers} onChange={e => handleMetricChange(setFollowers, e.target.value)} type="number" min="0"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Engagement rate %</label>
              <input value={engagement} onChange={e => handleMetricChange(setEngagement, e.target.value)} type="number" min="0" max="100" step="0.1"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Avg. views per video</label>
              <input value={avgMonthlyViews} onChange={e => handleMetricChange(setAvgMonthlyViews, e.target.value)} type="number" min="0" placeholder="e.g. 125000"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Avg. views: check your last 5–10 Instagram posts and estimate the per-video average. Affects your pricing.</p>
        </div>

        <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
          {(['rates', 'inquiries', 'settings'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
              {t === 'inquiries' && newInquiries > 0 && (
                <span className="ml-1.5 bg-red-100 text-red-700 text-xs px-1.5 py-0.5 rounded-full">{newInquiries}</span>
              )}
            </button>
          ))}
        </div>

        {tab === 'rates' && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Post types</p>
              <p className="text-xs text-gray-400">Toggle off to hide from your public card</p>
            </div>
            {configs.map(cfg => {
              const result = calculatePrice(followerNum, engagementNum, cfg.multiplier, cfg.manual_override_cents)
              const isDirty = dirty.has(cfg.id)
              return (
                <div key={cfg.id} className={`px-5 py-4 border-b border-gray-100 last:border-0 ${!cfg.is_enabled ? 'opacity-50' : ''}`}>
                  <div className="flex items-start gap-4">
                    <button onClick={() => updateConfig(cfg.id, { is_enabled: !cfg.is_enabled })}
                      className={`mt-0.5 w-9 h-5 rounded-full transition-colors flex-shrink-0 ${cfg.is_enabled ? 'bg-emerald-500' : 'bg-gray-200'}`}>
                      <div className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transform transition-transform mx-0.5 ${cfg.is_enabled ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{cfg.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{cfg.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-medium text-gray-900">{result.priceFormatted}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {result.isManualOverride ? 'Custom price' : result.bonusApplied ? '⚡ Bonus applied' : 'Formula rate'}
                      </p>
                      <div className="mt-2 flex items-center gap-1">
                        <span className="text-xs text-gray-400">$</span>
                        <input type="text" inputMode="decimal" placeholder="Override"
                          value={cfg.manual_override_cents ? (cfg.manual_override_cents / 100).toFixed(0) : ''}
                          onChange={e => handleOverrideInput(cfg.id, e.target.value)}
                          className="w-20 px-2 py-1 border border-gray-200 rounded-md text-xs text-right focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                      </div>
                    </div>
                  </div>
                  {isDirty && <p className="text-xs text-amber-500 mt-1 text-right">Unsaved changes</p>}
                </div>
              )
            })}
            <div className="px-5 py-4 bg-gray-50 flex items-center justify-between">
              {error && <p className="text-sm text-red-600">{error}</p>}
              {saved && <p className="text-sm text-emerald-600">✓ Saved</p>}
              {!error && !saved && <p className="text-xs text-gray-400">{hasChanges ? 'Unsaved changes' : 'All changes saved'}</p>}
              <button onClick={handleSave} disabled={saving || !hasChanges}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-40 transition-colors">
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </div>
        )}

        {tab === 'inquiries' && (
          <div className="space-y-3">
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800">
              <strong>Never miss a booking request:</strong> Add notifications@rateref.co to your contacts so inquiry emails land in your inbox.
            </div>
            {inquiries.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                <p className="text-gray-400 text-sm">No inquiries yet.</p>
                <p className="text-gray-400 text-sm mt-1">Share your rate card link to start getting brand requests.</p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <input readOnly value={publicUrl} className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 w-72" />
                  <button onClick={() => navigator.clipboard.writeText(publicUrl)}
                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">Copy</button>
                </div>
              </div>
            )}
            {inquiries.map(inq => {
              const status = (inq.status as Status) ?? 'new'
              return (
                <div key={inq.id} className="bg-white rounded-2xl border border-gray-200 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">{inq.brand_name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{inq.contact_email}</p>
                      {inq.message && <p className="text-sm text-gray-600 mt-2">{inq.message}</p>}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {inq.selected_post_types.map(pt => (
                          <span key={pt} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">{pt}</span>
                        ))}
                      </div>
                      <a href={`mailto:${inq.contact_email}`}
                        className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-emerald-600 hover:text-emerald-700 hover:underline">
                        Reply to {inq.brand_name} →
                      </a>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-medium text-gray-900 text-sm">{formatCents(inq.quoted_total_cents)}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{new Date(inq.created_at).toLocaleDateString()}</p>
                      <select value={status} disabled={updatingId === inq.id}
                        onChange={e => handleStatusChange(inq.id, e.target.value as Status)}
                        className={`mt-2 inline-block px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500 ${STATUS_STYLES[status]}`}>
                        {STATUS_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {tab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">Public profile</p>

              {/* Header media */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-xs font-medium text-gray-700 mb-1">Header media</p>
                <p className="text-xs text-gray-400 mb-4">Upload a photo or short video clip that plays at the top of your rate card. Any photo format works — vertical, square, or landscape. If nothing is uploaded, your card shows a clean gradient based on your niche.</p>

                {/* Header photo */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Photo</p>
                  {headerPhotoUrl && (
                    <div className="relative w-full h-24 rounded-lg overflow-hidden border border-gray-200 mb-2">
                      <img src={headerPhotoUrl} alt="Header" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <label className="inline-block px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-100 cursor-pointer">
                      {uploadingHeaderPhoto ? 'Uploading…' : headerPhotoUrl ? 'Change photo' : 'Upload photo'}
                      <input type="file" accept="image/*" onChange={handleHeaderPhotoUpload} disabled={uploadingHeaderPhoto} className="hidden" />
                    </label>
                    {headerPhotoUrl && (
                      <button onClick={handleDeleteHeaderPhoto} className="px-3 py-1.5 rounded-lg border border-red-200 text-xs text-red-500 hover:bg-red-50">
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                {/* Header video */}
                <div>
                  <p className="text-xs text-gray-500 mb-2">Video clip <span className="text-gray-400">(MP4, max 50MB — plays muted on loop)</span></p>
                  {headerVideoUrl && (
                    <div className="relative w-full h-24 rounded-lg overflow-hidden border border-gray-200 mb-2 bg-black">
                      <video src={headerVideoUrl} className="w-full h-full object-cover" muted loop playsInline autoPlay />
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <label className="inline-block px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-100 cursor-pointer">
                      {uploadingHeaderVideo ? 'Uploading…' : headerVideoUrl ? 'Change video' : 'Upload video'}
                      <input type="file" accept="video/mp4,video/mov,video/quicktime" onChange={handleHeaderVideoUpload} disabled={uploadingHeaderVideo} className="hidden" />
                    </label>
                    {headerVideoUrl && (
                      <button onClick={handleDeleteHeaderVideo} className="px-3 py-1.5 rounded-lg border border-red-200 text-xs text-red-500 hover:bg-red-50">
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Avatar upload */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center flex-shrink-0 border border-gray-200">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-gray-400">No photo</span>
                  )}
                </div>
                <div>
                  <label className="inline-block px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">
                    {uploading ? 'Uploading…' : 'Upload profile photo'}
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} className="hidden" />
                  </label>
                  <p className="text-xs text-gray-400 mt-1">Shown as your circular profile photo on your card</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-xs text-gray-500 mb-1 block">Display name</label>
                <input value={displayName} onChange={e => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>

              <div className="mb-4">
                <label className="text-xs text-gray-500 mb-1 block">Bio</label>
                <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
              </div>

              <div className="mb-4">
                <label className="text-xs text-gray-500 mb-1 block">Content niche</label>
                <select value={contentNiche} onChange={e => setContentNiche(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                  {NICHE_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1">Shown on your public card to help brands identify fit.</p>
              </div>

              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
                <input
                  type="checkbox"
                  id="ncaa-athlete"
                  checked={isNcaaAthlete}
                  onChange={e => setIsNcaaAthlete(e.target.checked)}
                  style={{ marginTop: '3px', flexShrink: 0, width: '15px', height: '15px', cursor: 'pointer' }}
                />
                <label htmlFor="ncaa-athlete" className="text-xs text-blue-800 cursor-pointer">
                  <span className="font-medium">I am a current NCAA student-athlete.</span>
                  <span className="block text-blue-600 mt-0.5">This adds an NCAA compliance disclaimer to your public rate card.</span>
                </label>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Instagram</label>
                  <input value={instagramHandle} onChange={e => setInstagramHandle(e.target.value)} placeholder="handle"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">TikTok</label>
                  <input value={tiktokHandle} onChange={e => setTiktokHandle(e.target.value)} placeholder="handle"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">YouTube</label>
                  <input value={youtubeHandle} onChange={e => setYoutubeHandle(e.target.value)} placeholder="handle"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>

              <div className="mb-4">
                <label className="text-xs text-gray-500 mb-1 block">Standard turnaround (days)</label>
                <input value={turnaroundDays} onChange={e => setTurnaroundDays(e.target.value)} type="number" min="1" max="90" placeholder="e.g. 7"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                <p className="text-xs text-gray-400 mt-1">How long brands should expect for delivery.</p>
              </div>

              <div className="mb-4">
                <label className="text-xs text-gray-500 mb-1 block">Past brand partnerships</label>
                <input value={pastBrands} onChange={e => setPastBrands(e.target.value)} placeholder="e.g. Nike, Honey Stinger, Gameplan Skincare"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                <p className="text-xs text-gray-400 mt-1">Comma-separated. Shown as credential badges on your public card.</p>
              </div>

              <div className="mb-4">
                <label className="text-xs text-gray-500 mb-1 block">Brand deal terms & requirements</label>
                <textarea
                  value={customTerms}
                  onChange={e => setCustomTerms(e.target.value)}
                  rows={5}
                  placeholder="e.g. 50% deposit required upfront. No alcohol or gambling brands. Usage rights limited to 30 days unless negotiated separately. All content subject to creator approval before posting."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">Shown on your public rate card above the booking form.</p>
              </div>

              <div className="flex items-center justify-between pt-2">
                {profileError && <p className="text-sm text-red-600">{profileError}</p>}
                {profileSaved && !profileError && <p className="text-sm text-emerald-600">✓ Saved</p>}
                {!profileError && !profileSaved && <span />}
                <button onClick={handleProfileSave} disabled={profileSaving}
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-40 transition-colors">
                  {profileSaving ? 'Saving…' : 'Save profile'}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <p className="text-sm font-medium text-gray-700 mb-4">Your public link</p>
              <div className="flex items-center gap-2 mb-6">
                <input readOnly value={publicUrl} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600" />
                <button onClick={() => navigator.clipboard.writeText(publicUrl)}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50">Copy</button>
                <a href={publicUrl} target="_blank" className="px-3 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50">Open ↗</a>
              </div>
              <p className="text-xs text-gray-400">
                Share this link in your Instagram bio, email signature, or DMs. Brands will see your live rates and can submit booking requests directly.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-red-200 p-6">
              <p className="text-sm font-medium text-red-600 mb-1">Danger zone</p>
              <p className="text-xs text-gray-500 mb-4">Permanently delete your account, rate card, and all inquiry history. This cannot be undone.</p>

              {!showDeleteConfirm && (
                <button onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 rounded-lg border border-red-300 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors">
                  Delete my account
                </button>
              )}

              {showDeleteConfirm && (
                <div className="border border-red-200 rounded-xl p-4 bg-red-50">
                  <p className="text-xs text-red-700 mb-3">
                    Type <strong>DELETE</strong> below to permanently remove your account, rate card, and all inquiries.
                  </p>
                  <input
                    value={deleteConfirmText}
                    onChange={e => setDeleteConfirmText(e.target.value)}
                    placeholder="Type DELETE"
                    className="w-full px-3 py-2 border border-red-300 rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                  {deleteError && <p className="text-xs text-red-600 mb-3">{deleteError}</p>}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleteConfirmText !== 'DELETE' || deleting}
                      className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-40 transition-colors">
                      {deleting ? 'Deleting…' : 'Permanently delete'}
                    </button>
                    <button
                      onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(''); setDeleteError('') }}
                      disabled={deleting}
                      className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-100 transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
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
