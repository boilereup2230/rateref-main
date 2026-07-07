'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { calculatePrice, formatCents, DEFAULT_RATE_CONFIGS } from '@/lib/pricing'

function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

const POST_TYPE_DESCRIPTIONS: Record<string, string> = {
  reel:   'Instagram Reel',
  story:  'Instagram Story',
  tiktok: 'TikTok Video',
  static: 'Static Feed Post',
  bundle: 'Reel + Story Bundle',
}

function PreviewContent() {
  const params = useSearchParams()

  const name       = params.get('name')       || 'Your Name'
  const handle     = params.get('handle')     || 'yourcreatorname'
  const followers  = parseInt(params.get('followers')  || '25000')
  const engagement = parseFloat(params.get('engagement') || '3.5')
  const platform   = params.get('platform')   || 'instagram'

  const bonusApplied = engagement > 2.5
  const initials = name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
  const slug     = handle.replace('@', '').toLowerCase().replace(/[^a-z0-9-]/g, '')
  const claimUrl = `/setup?slug=${slug}`

  const visibleTypes = DEFAULT_RATE_CONFIGS.filter(pt => {
    if (platform === 'instagram') return ['reel', 'story', 'static', 'bundle'].includes(pt.post_type)
    if (platform === 'tiktok')    return ['tiktok', 'static'].includes(pt.post_type)
    return true
  })

  const dmSans = { fontFamily: 'DM Sans, sans-serif' }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', ...dmSans }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* Preview banner */}
      <div style={{ background: '#1e40af', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ background: '#fbbf24', color: '#92400e', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase' as const, letterSpacing: '.05em' }}>Preview</span>
          <span style={{ color: '#bfdbfe', fontSize: 13 }}>
            This is a preview of what your free RateRef rate card would look like.
          </span>
        </div>
        <a href={claimUrl} style={{ background: '#10b981', color: '#fff', padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' as const }}>
          Claim rateref.co/c/{slug} →
        </a>
      </div>

      <div style={{ maxWidth: 520, margin: '0 auto', padding: '24px 16px 80px' }}>

        {/* Profile card */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb', padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', fontWeight: 700, fontSize: 18, flexShrink: 0 }}>
              {initials}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 style={{ fontWeight: 600, fontSize: 16, color: '#111827' }}>{name}</h1>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#ecfdf5', color: '#059669', fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 20 }}>
                  <svg width="10" height="10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  Verified
                </span>
              </div>
              <div style={{ color: '#6b7280', fontSize: 13, marginTop: 2 }}>@{slug}</div>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right' as const }}>
              <div style={{ fontSize: 11, color: '#9ca3af' }}>Live rates</div>
              <div style={{ fontSize: 11, color: '#10b981' }}>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '12px 8px', textAlign: 'center' as const }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#111827' }}>{formatFollowers(followers)}</div>
            <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>Followers</div>
          </div>
          <div style={{ background: '#fff', border: `1px solid ${bonusApplied ? '#a7f3d0' : '#e5e7eb'}`, borderRadius: 12, padding: '12px 8px', textAlign: 'center' as const }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: bonusApplied ? '#059669' : '#111827' }}>{engagement.toFixed(1)}%</div>
            <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>Engagement</div>
            {bonusApplied && <div style={{ fontSize: 10, color: '#10b981', marginTop: 2 }}>⚡ Bonus tier</div>}
          </div>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '12px 8px', textAlign: 'center' as const }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#111827' }}>{formatFollowers(Math.round(followers * engagement / 100))}</div>
            <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>Est. reach</div>
          </div>
        </div>

        {/* Bonus tier explainer */}
        {bonusApplied && (
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 12, padding: '12px 16px', marginBottom: 16, fontSize: 12, color: '#065f46', lineHeight: 1.5 }}>
            <strong>⚡ Bonus Tier Pricing Active</strong> — This creator&apos;s {engagement.toFixed(1)}% engagement rate is above average, applying a pricing multiplier. Their audience is more engaged than average, reflecting higher commercial value for brand partnerships.
          </div>
        )}

        {/* Deliverables */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #f3f4f6' }}>
            <p style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase' as const, letterSpacing: '.06em' }}>Available deliverables</p>
          </div>
          {visibleTypes.map((pt, i) => {
            const result = calculatePrice(followers, engagement, pt.multiplier, null, pt.post_type, null, null)
            return (
              <div key={pt.post_type} style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: i < visibleTypes.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 4, border: '1.5px solid #d1d5db', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500, color: '#111827' }}>{pt.label}</p>
                    <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 1 }}>{pt.description}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' as const }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{result.priceFormatted}</p>
                  {result.bonusApplied && <p style={{ fontSize: 10, color: '#10b981', marginTop: 1 }}>⚡ Bonus tier</p>}
                </div>
              </div>
            )
          })}
        </div>

        {/* Add-ons */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 20, marginBottom: 16 }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase' as const, letterSpacing: '.06em', marginBottom: 12 }}>Add-ons</p>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
            {[
              { label: 'Whitelisting +20%', desc: 'Brand runs ads through your account' },
              { label: 'Exclusivity +30%',  desc: 'No competing brands for 30 days' },
              { label: 'Rush fee +15%',     desc: 'Delivery in under 48 hours' },
            ].map((addon, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, border: '1px solid #f3f4f6', background: '#fafafa' }}>
                <div style={{ width: 16, height: 16, borderRadius: 4, border: '1.5px solid #d1d5db', flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>{addon.label}</p>
                  <p style={{ fontSize: 11, color: '#9ca3af' }}>{addon.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking form preview */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 20, marginBottom: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase' as const, letterSpacing: '.06em', marginBottom: 16 }}>Send booking request</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: 11, color: '#6b7280', display: 'block', marginBottom: 4 }}>Brand name *</label>
              <div style={{ padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, color: '#9ca3af', background: '#fafafa' }}>Acme Co.</div>
            </div>
            <div>
              <label style={{ fontSize: 11, color: '#6b7280', display: 'block', marginBottom: 4 }}>Email *</label>
              <div style={{ padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, color: '#9ca3af', background: '#fafafa' }}>you@brand.com</div>
            </div>
          </div>
          <div style={{ padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, color: '#9ca3af', background: '#fafafa', marginBottom: 12, minHeight: 60 }}>Campaign brief (optional)</div>
          <div style={{ width: '100%', padding: '14px 0', textAlign: 'center' as const, borderRadius: 12, background: '#d1fae5', color: '#065f46', fontSize: 14, fontWeight: 500 }}>
            Select deliverables above to see total
          </div>
        </div>

        {/* Claim CTA */}
        <div style={{ background: 'linear-gradient(135deg, #064e3b, #065f46)', borderRadius: 16, padding: 24, textAlign: 'center' as const }}>
          <p style={{ color: '#a7f3d0', fontSize: 12, fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '.08em', marginBottom: 8 }}>This is your free rate card</p>
          <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>
            rateref.co/c/<span style={{ color: '#6ee7b7' }}>{slug}</span>
          </h2>
          <p style={{ color: '#a7f3d0', fontSize: 13, marginBottom: 20, lineHeight: 1.5 }}>
            Claim your link in 2 minutes. Brands can find you, see your rates, and book you directly — no back-and-forth.
          </p>
          <a href={claimUrl} style={{ display: 'inline-block', background: '#10b981', color: '#fff', padding: '14px 32px', borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>
            Claim rateref.co/c/{slug} — it&apos;s free →
          </a>
          <p style={{ color: '#6ee7b7', fontSize: 11, marginTop: 12 }}>No credit card · Takes 2 minutes · Free forever</p>
        </div>

        <p style={{ textAlign: 'center' as const, fontSize: 11, color: '#9ca3af', marginTop: 20 }}>
          Powered by <a href="/" style={{ color: '#6b7280', fontWeight: 500 }}>RateRef</a> · The live rate card for creators who do brand deals.
        </p>
      </div>
    </div>
  )
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>Loading preview...</div>}>
      <PreviewContent />
    </Suspense>
  )
}
