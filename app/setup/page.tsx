'use client'
import { useState, useEffect, Suspense } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { DEFAULT_RATE_CONFIGS } from '@/lib/pricing'
import { useRouter, useSearchParams } from 'next/navigation'

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

function SetupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [form, setForm] = useState({ display_name:'', slug:'', bio:'', instagram_handle:'', tiktok_handle:'', youtube_handle:'', follower_count:'', engagement_rate:'' })
  const [contentNiche, setContentNiche] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const slugParam = searchParams.get('slug')
    if (slugParam) {
      const cleaned = slugParam.toLowerCase().replace(/[^a-z0-9-]/g, '')
      setForm(f => ({ ...f, slug: cleaned }))
    }
  }, [searchParams])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        const slug = searchParams.get('slug')
        const returnUrl = slug ? `/setup?slug=${slug}` : '/setup'
        router.replace(`/login?next=${encodeURIComponent(returnUrl)}`)
      } else {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single()
        if (profile) {
          router.replace('/dashboard')
        } else {
          setChecking(false)
        }
      }
    })
  }, [router, searchParams])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: name === 'slug' ? value.toLowerCase().replace(/[^a-z0-9-]/g, '') : value }))
  }

  function handleAvatarSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('You must be logged in.'); setLoading(false); return }
    const { error: profileError } = await supabase.from('profiles').insert({
      id: user.id, email: user.email, display_name: form.display_name, slug: form.slug,
      bio: form.bio || null, instagram_handle: form.instagram_handle || null,
      tiktok_handle: form.tiktok_handle || null, youtube_handle: form.youtube_handle || null,
      follower_count: parseInt(form.follower_count) || 0,
      engagement_rate: parseFloat(form.engagement_rate) || 0, is_published: true,
      content_niche: contentNiche || null,
    } as any)
    if (profileError) { setError(profileError.message.includes('slug') ? 'That link is taken — try another.' : profileError.message); setLoading(false); return }
    await supabase.from('rate_configs').insert(DEFAULT_RATE_CONFIGS.map((cfg, i) => ({
      profile_id: user.id, post_type: cfg.post_type, label: cfg.label,
      description: cfg.description, multiplier: cfg.multiplier,
      manual_override_cents: null, is_enabled: cfg.is_enabled, sort_order: i,
    })))
    if (avatarFile) {
      const fileExt = avatarFile.name.split('.').pop()
      const filePath = `${user.id}/avatar.${fileExt}`
      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, avatarFile, { upsert: true })
      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath)
        const newAvatarUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`
        await supabase.from('profiles').update({ avatar_url: newAvatarUrl }).eq('id', user.id)
      }
    }
    const cardUrl = `${window.location.origin}/c/${form.slug}`
    await fetch('/api/send-welcome', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creatorEmail: user.email,
        creatorName: form.display_name,
        cardUrl,
      }),
    })
    router.push('/dashboard')
  }

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: '13px', color: '#9ca3af' }}>Loading…</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'system-ui, sans-serif' }}>

      {/* LEFT — Value prop */}
      <div style={{ width: '45%', background: '#0a0a0a', padding: '48px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'sticky', top: 0, height: '100vh' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '48px' }}>
          <div style={{ width: '32px', height: '32px', background: '#059669', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '12px' }}>RR</span>
          </div>
          <span style={{ color: '#f5f0e8', fontWeight: 700, fontSize: '16px' }}>RateRef</span>
        </div>

        <h1 style={{ color: '#f5f0e8', fontSize: '32px', fontWeight: 800, lineHeight: 1.15, marginBottom: '16px', letterSpacing: '-0.02em' }}>
          Your rates deserve<br/>a <span style={{ color: '#10b981' }}>better home.</span>
        </h1>
        <p style={{ color: '#6b7280', fontSize: '15px', lineHeight: 1.7, marginBottom: '40px', fontWeight: 300 }}>
          Brands click your link, see real-time pricing, and submit a booking request directly. No back-and-forth. No guessing what to charge.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
          {[
            { icon: '⚡', title: 'Engagement bonus pricing', desc: 'Above 3% engagement? Your rates auto-apply a 1.5× multiplier.' },
            { icon: '➕', title: 'Add-ons built in', desc: 'Whitelisting, exclusivity, and rush fees on every card.' },
            { icon: '📥', title: 'Booking requests to your dashboard', desc: 'Brands show up knowing the number. You just respond.' },
          ].map((b, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '18px', marginTop: '2px', flexShrink: 0 }}>{b.icon}</span>
              <div>
                <p style={{ color: '#f5f0e8', fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>{b.title}</p>
                <p style={{ color: '#4b5563', fontSize: '12px', lineHeight: 1.5 }}>{b.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: '#111827', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ background: '#1f2937', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}/>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}/>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}/>
            <span style={{ color: '#6b7280', fontSize: '11px', marginLeft: '6px' }}>rateref.co/c/yourname</span>
          </div>
          {[
            { label: 'Instagram Reel', price: '$693', bonus: true },
            { label: 'Instagram Story', price: '$312', bonus: true },
            { label: 'TikTok Video', price: '$624', bonus: true },
          ].map((row, i) => (
            <div key={i} style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: '#d1d5db', fontSize: '12px' }}>{row.label}</span>
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: '#f5f0e8', fontSize: '12px', fontWeight: 600 }}>{row.price}</span>
                {row.bonus && <div style={{ color: '#10b981', fontSize: '10px' }}>⚡ Bonus tier</div>}
              </div>
            </div>
          ))}
          <div style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#6b7280', fontSize: '12px' }}>Total</span>
            <span style={{ color: '#10b981', fontSize: '13px', fontWeight: 700 }}>$1,629</span>
          </div>
        </div>

        <p style={{ color: '#374151', fontSize: '11px', marginTop: '16px' }}>
          Free forever · No credit card · Takes 2 minutes
        </p>
      </div>

      {/* RIGHT — Form */}
      <div style={{ flex: 1, background: '#f9fafb', overflowY: 'auto', padding: '48px' }}>
        <div style={{ maxWidth: '460px', margin: '0 auto' }}>
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>Set up your Rate Card</h2>
            <p style={{ fontSize: '13px', color: '#6b7280' }}>Takes 2 minutes. Edit anytime from your dashboard.</p>
          </div>

          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '32px' }}>
            {error && <div style={{ marginBottom: '20px', padding: '12px', borderRadius: '8px', background: '#fef2f2', border: '1px solid #fecaca', fontSize: '13px', color: '#dc2626' }}>{error}</div>}

            <form onSubmit={handleSubmit}>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Profile picture</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#f3f4f6', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e5e7eb', flexShrink: 0 }}>
                    {avatarPreview ? <img src={avatarPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '11px', color: '#9ca3af' }}>No photo</span>}
                  </div>
                  <label style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px', color: '#374151', cursor: 'pointer', background: '#fff' }}>
                    {avatarFile ? 'Change photo' : 'Upload photo'}
                    <input type="file" accept="image/*" onChange={handleAvatarSelect} style={{ display: 'none' }} />
                  </label>
                </div>
                <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>Optional — add later in Settings</p>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Creator name *</label>
                <input name="display_name" required value={form.display_name} onChange={handleChange} placeholder="Sara Chen"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Choose your link *</label>
                <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px', marginBottom: '6px' }}>This becomes your RateRef link — pick something simple like your name or handle.</p>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>
                  <span style={{ padding: '10px 0 10px 12px', fontSize: '14px', color: '#9ca3af', whiteSpace: 'nowrap' }}>rateref.co/c/</span>
                  <input name="slug" required value={form.slug} onChange={handleChange} placeholder="saracreates"
                    style={{ flex: 1, padding: '10px 12px 10px 2px', border: 'none', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Short bio</label>
                <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Travel & lifestyle creator" rows={2}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Content niche</label>
                <select
                  value={contentNiche}
                  onChange={e => setContentNiche(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: '#fff', color: contentNiche ? '#111827' : '#9ca3af' }}>
                  {NICHE_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>Helps calibrate your rates and shown on your public card.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                {[
                  { name: 'instagram_handle', label: 'Instagram' },
                  { name: 'tiktok_handle', label: 'TikTok' },
                  { name: 'youtube_handle', label: 'YouTube' },
                ].map(h => (
                  <div key={h.name}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>{h.label}</label>
                    <input name={h.name} value={form[h.name as keyof typeof form]} onChange={handleChange} placeholder="@handle"
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Followers *</label>
                  <input name="follower_count" required type="number" min="0" value={form.follower_count} onChange={handleChange} placeholder="46000"
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Engagement % *</label>
                  <input name="engagement_rate" required type="number" min="0" max="100" step="0.1" value={form.engagement_rate} onChange={handleChange} placeholder="4.1"
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>

              <button type="submit" disabled={loading}
                style={{ width: '100%', padding: '14px', borderRadius: '10px', background: loading ? '#d1fae5' : '#059669', color: '#fff', fontSize: '14px', fontWeight: 600, border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Creating your rate card…' : 'Create my Rate Card →'}
              </button>

            </form>
          </div>

          <p style={{ textAlign: 'center', fontSize: '11px', color: '#9ca3af', marginTop: '16px' }}>
            Free forever · No credit card required
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SetupPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: '13px', color: '#9ca3af' }}>Loading…</p>
      </div>
    }>
      <SetupForm />
    </Suspense>
  )
}
