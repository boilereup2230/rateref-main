'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'

// Pricing engine (mirrors lib/pricing.ts logic)
function calculateRate(followers: number, engagement: number, multiplier: number): number {
  const base = followers * 0.01 * multiplier
  const engagementBonus = engagement >= 3 ? 1.5 : 1.0
  return Math.round(base * engagementBonus)
}

function formatCents(cents: number): string {
  return '$' + (cents).toLocaleString()
}

function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

const POST_TYPES = [
  { key: 'reel', label: 'Instagram Reel', desc: '60-sec branded video', multiplier: 1.5 },
  { key: 'story', label: 'Instagram Story', desc: '3-frame story set', multiplier: 0.6 },
  { key: 'feed', label: 'Static Feed Post', desc: 'Single image or carousel', multiplier: 0.8 },
  { key: 'tiktok', label: 'TikTok Video', desc: '30–60 second', multiplier: 1.2 },
  { key: 'youtube', label: 'YouTube Integration', desc: '60-sec mid-roll mention', multiplier: 2.0 },
]

function PreviewContent() {
  const params = useSearchParams()
  const router = useRouter()

  const name = params.get('name') || 'Your Name'
  const handle = params.get('handle') || 'yourcreatorname'
  const followers = parseInt(params.get('followers') || '25000')
  const engagement = parseFloat(params.get('engagement') || '3.5')
  const platform = params.get('platform') || 'instagram'

  const bonusApplied = engagement >= 3
  const initials = name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
  const claimUrl = `/setup?slug=${handle.replace('@', '').toLowerCase().replace(/[^a-z0-9-]/g, '')}`

  const slug = handle.replace('@', '').toLowerCase().replace(/[^a-z0-9-]/g, '')

  // Filter post types by platform
  const visibleTypes = POST_TYPES.filter(pt => {
    if (platform === 'instagram') return ['reel', 'story', 'feed'].includes(pt.key)
    if (platform === 'tiktok') return ['tiktok', 'feed'].includes(pt.key)
    if (platform === 'youtube') return ['youtube', 'feed'].includes(pt.key)
    return true
  })

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: "'Inter', 'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      {/* Preview banner */}
      <div style={{ background: '#1e40af', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ background: '#fbbf24', color: '#92400e', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '.05em' }}>Preview</span>
          <span style={{ color: '#bfdbfe', fontSize: 13, fontFamily: 'DM Sans, sans-serif' }}>
            This is a preview of what your free RateRef rate card would look like.
          </span>
        </div>
        
          href={claimUrl}
          style={{ background: '#10b981', color: '#fff', padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap' }}>
          Claim rateref.co/c/{slug} →
        </a>
      </div>

      <div style={{ maxWidth: 520, margin: '0 auto', padding: '24px 16px 80px' }}>

        {/* Profile card */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb', padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', fontWeight: 700, fontSize: 18, flexShrink: 0 }}>
              {initials}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 style={{ fontWeight: 600, fontSize: 16, color: '#111827', fontFamily: 'DM Sans, sans-serif' }}>{name}</h1>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#ecfdf5', color: '#059669', fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 20, fontFamily: 'DM Sans, sans-serif' }}>
                  <svg width="10" height="10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  Verified
                </span>
              </div>
              <div style={{ color: '#6b7280', fontSize: 13, marginTop: 2, fontFamily: 'DM Sans, sans-serif' }}>@{slug}</div>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: '#9ca3af', fontFamily: 'DM Sans, sans-serif' }}>Live rates</div>
              <div style={{ fontSize: 11, color: '#10b981', fontFamily: 'DM Sans, sans-serif' }}>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '12px 8px', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#111827', fontFamily: 'DM Sans, sans-serif' }}>{formatFollowers(followers)}</div>
            <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2, fontFamily: 'DM Sans, sans-serif' }}>Followers</div>
          </div>
          <div style={{ background: '#fff', border: `1px solid ${bonusApplied ? '#a7f3d0' : '#e5e7eb'}`, borderRadius: 12, padding: '12px 8px', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: bonusApplied ? '#059669' : '#111827', fontFamily: 'DM Sans, sans-serif' }}>{engagement.toFixed(1)}%</div>
            <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2, fontFamily: 'DM Sans, sans-serif' }}>Engagement</div>
            {bonusApplied && <div style={{ fontSize: 10, color: '#10b981', marginTop: 2, fontFamily: 'DM Sans, sans-serif' }}>⚡ Bonus tier</div>}
          </div>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '12px 8px', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#111827', fontFamily: 'DM Sans, sans-serif' }}>{formatFollowers(Math.round(followers * engagement / 100))}</div>
            <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2, fontFamily: 'DM Sans, sans-serif' }}>Est. reach</div>
          </div>
        </div>

        {/* Bonus tier explainer */}
        {bonusApplied && (
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 12, padding: '12px 16px', marginBottom: 16, fontSize: 12, color: '#065f46', lineHeight: 1.5, fontFamily: 'DM Sans, sans-serif' }}>
            <strong>⚡ Bonus Tier Pricing Active</strong> — This creator's {engagement.toFixed(1)}% engagement rate exceeds the 3% threshold, applying a 1.5× pricing multiplier. Their audience is significantly more engaged than average, reflecting higher commercial value for brand partnerships.
          </div>
        )}

        {/* Deliverables */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #f3f4f6' }}>
            <p style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', fontFamily: 'DM Sans, sans-serif' }}>Available deliverables</p>
          </div>
          {visibleTypes.map((pt, i) => {
            const price = calculateRate(followers, engagement, pt.multiplier)
            return (
              <div key={pt.key} style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: i < visibleTypes.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 4, border: '1.5px solid #d1d5db', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500, color: '#111827', fontFamily: 'DM Sans, sans-serif' }}>{pt.label}</p>
                    <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 1, fontFamily: 'DM Sans, sans-serif' }}>{pt.desc}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', fontFamily: 'DM Sans, sans-serif' }}>{formatCents(price)}</p>
                  {bonusApplied && <p style={{ fontSize: 10, color: '#10b981', marginTop: 1, fontFamily: 'DM Sans, sans-serif' }}>⚡ Bonus tier</p>}
                </div>
              </div>
            )
          })}
        </div>

        {/* Add-ons */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 20, marginBottom: 16 }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12, fontFamily: 'DM Sans, sans-serif' }}>Add-ons</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Whitelisting +20%', desc: 'Brand runs ads through your account' },
              { label: 'Exclusivity +30%', desc: 'No competing brands for 30 days' },
              { label: 'Rush fee +15%', desc: 'Delivery in under 48 hours' },
            ].map((addon, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, border: '1px solid #f3f4f6', background: '#fafafa' }}>
                <div style={{ width: 16, height: 16, borderRadius: 4, border: '1.5px solid #d1d5db', flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#111827', fontFamily: 'DM Sans, sans-serif' }}>{addon.label}</p>
                  <p style={{ fontSize: 11, color: '#9ca3af', fontFamily: 'DM Sans, sans-serif' }}>{addon.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking form preview */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 20, marginBottom: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 16, fontFamily: 'DM Sans, sans-serif' }}>Send booking request</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: 11, color: '#6b7280', display: 'block', marginBottom: 4, fontFamily: 'DM Sans, sans-serif' }}>Brand name *</label>
              <div style={{ padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, color: '#9ca3af', background: '#fafafa', fontFamily: 'DM Sans, sans-serif' }}>Acme Co.</div>
            </div>
            <div>
              <label style={{ fontSize: 11, color: '#6b7280', display: 'block', marginBottom: 4, fontFamily: 'DM Sans, sans-serif' }}>Email *</label>
              <div style={{ padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, color: '#9ca3af', background: '#fafafa', fontFamily: 'DM Sans, sans-serif' }}>you@brand.com</div>
            </div>
          </div>
          <div style={{ padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, color: '#9ca3af', background: '#fafafa', marginBottom: 12, minHeight: 60, fontFamily: 'DM Sans, sans-serif' }}>Campaign brief (optional)</div>
          <div style={{ width: '100%', padding: '14px 0', textAlign: 'center', borderRadius: 12, background: '#d1fae5', color: '#065f46', fontSize: 14, fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>
            Select deliverables above to see total
          </div>
        </div>

        {/* Claim CTA */}
        <div style={{ background: 'linear-gradient(135deg, #064e3b, #065f46)', borderRadius: 16, padding: 24, textAlign: 'center' }}>
          <p style={{ color: '#a7f3d0', fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8, fontFamily: 'DM Sans, sans-serif' }}>This is your free rate card</p>
          <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 700, marginBottom: 8, fontFamily: 'DM Sans, sans-serif', lineHeight: 1.3 }}>
            rateref.co/c/<span style={{ color: '#6ee7b7' }}>{slug}</span>
          </h2>
          <p style={{ color: '#a7f3d0', fontSize: 13, marginBottom: 20, lineHeight: 1.5, fontFamily: 'DM Sans, sans-serif' }}>
            Claim your link in 2 minutes. Brands can find you, see your rates, and book you directly — no back-and-forth.
          </p>
          
            href={claimUrl}
            style={{ display: 'inline-block', background: '#10b981', color: '#fff', padding: '14px 32px', borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif' }}>
            Claim rateref.co/c/{slug} — it's free →
          </a>
          <p style={{ color: '#6ee7b7', fontSize: 11, marginTop: 12, fontFamily: 'DM Sans, sans-serif' }}>No credit card · Takes 2 minutes · Free forever</p>
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, color: '#9ca3af', marginTop: 20, fontFamily: 'DM Sans, sans-serif' }}>
          Powered by <a href="/" style={{ color: '#6b7280', fontWeight: 500 }}>RateRef</a> · The live rate card for creators who do brand deals.
        </p>
      </div>
    </div>
  )
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, sans-serif', color: '#6b7280' }}>Loading preview...</div>}>
      <PreviewContent />
    </Suspense>
  )
}
