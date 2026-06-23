'use client'

import { useState } from 'react'

export default function PreviewGenerator() {
  const [name, setName] = useState('')
  const [handle, setHandle] = useState('')
  const [followers, setFollowers] = useState('')
  const [engagement, setEngagement] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [generated, setGenerated] = useState('')
  const [copied, setCopied] = useState(false)

  function generate() {
    if (!name || !handle || !followers || !engagement) return
    const slug = handle.replace('@', '').toLowerCase().replace(/[^a-z0-9-]/g, '')
    const encodedName = name.trim().replace(/\s+/g, '+')
    const url = `https://rateref.co/preview?name=${encodedName}&handle=${slug}&followers=${followers}&engagement=${engagement}&platform=${platform}`
    setGenerated(url)
    setCopied(false)
  }

  function copy() {
    navigator.clipboard.writeText(generated)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const dmSans = { fontFamily: 'DM Sans, sans-serif' }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', ...dmSans }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* Nav */}
      <div style={{ padding: '16px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 28, height: 28, background: '#059669', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 11 }}>RR</span>
          </div>
          <span style={{ color: '#f5f0e8', fontWeight: 700, fontSize: 16 }}>RateRef</span>
        </a>
        <span style={{ color: '#374151', fontSize: 14, marginLeft: 8 }}>/ Preview Generator</span>
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '48px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ color: '#f5f0e8', fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Preview Link Generator</h1>
          <p style={{ color: '#6b7280', fontSize: 15, lineHeight: 1.6 }}>
            Fill in a creator's public stats to generate a personalized preview link. Send it to them so they can see exactly what their free RateRef rate card would look like.
          </p>
        </div>

        {/* Form */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 28, marginBottom: 24 }}>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', color: '#9ca3af', fontSize: 12, fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '.06em', marginBottom: 8 }}>
              Creator's Full Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Laura Brocato"
              style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '12px 16px', color: '#f5f0e8', fontSize: 15, outline: 'none' }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', color: '#9ca3af', fontSize: 12, fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '.06em', marginBottom: 8 }}>
              Instagram / TikTok Handle *
            </label>
            <input
              type="text"
              value={handle}
              onChange={e => setHandle(e.target.value.replace('@', ''))}
              placeholder="theicymom"
              style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '12px 16px', color: '#f5f0e8', fontSize: 15, outline: 'none' }}
            />
            <p style={{ color: '#4b5563', fontSize: 12, marginTop: 4 }}>No @ needed</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div>
              <label style={{ display: 'block', color: '#9ca3af', fontSize: 12, fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '.06em', marginBottom: 8 }}>
                Follower Count *
              </label>
              <input
                type="number"
                value={followers}
                onChange={e => setFollowers(e.target.value)}
                placeholder="70000"
                style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '12px 16px', color: '#f5f0e8', fontSize: 15, outline: 'none' }}
              />
              <p style={{ color: '#4b5563', fontSize: 12, marginTop: 4 }}>Numbers only, no K or M</p>
            </div>
            <div>
              <label style={{ display: 'block', color: '#9ca3af', fontSize: 12, fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '.06em', marginBottom: 8 }}>
                Engagement Rate % *
              </label>
              <input
                type="number"
                step="0.1"
                value={engagement}
                onChange={e => setEngagement(e.target.value)}
                placeholder="4.1"
                style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '12px 16px', color: '#f5f0e8', fontSize: 15, outline: 'none' }}
              />
              <p style={{ color: '#4b5563', fontSize: 12, marginTop: 4 }}>e.g. 4.1 for 4.1%</p>
            </div>
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'block', color: '#9ca3af', fontSize: 12, fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '.06em', marginBottom: 8 }}>
              Primary Platform *
            </label>
            <div style={{ display: 'flex', gap: 10 }}>
              {['instagram', 'tiktok', 'youtube'].map(p => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  style={{
                    flex: 1,
                    padding: '10px 0',
                    borderRadius: 10,
                    border: platform === p ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.12)',
                    background: platform === p ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)',
                    color: platform === p ? '#10b981' : '#6b7280',
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: 'pointer',
                    textTransform: 'capitalize' as const,
                  }}>
                  {p === 'instagram' ? '📸 Instagram' : p === 'tiktok' ? '🎵 TikTok' : '▶️ YouTube'}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generate}
            disabled={!name || !handle || !followers || !engagement}
            style={{
              width: '100%',
              padding: '14px 0',
              borderRadius: 12,
              background: (!name || !handle || !followers || !engagement) ? 'rgba(5,150,105,0.3)' : '#059669',
              color: '#fff',
              fontSize: 15,
              fontWeight: 600,
              border: 'none',
              cursor: (!name || !handle || !followers || !engagement) ? 'not-allowed' : 'pointer',
            }}>
            Generate Preview Link →
          </button>
        </div>

        {/* Result */}
        {generated && (
          <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 16, padding: 24 }}>
            <p style={{ color: '#6ee7b7', fontSize: 12, fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '.06em', marginBottom: 12 }}>
              ✓ Preview link ready
            </p>
            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 16, wordBreak: 'break-all' as const }}>
              <span style={{ color: '#d1fae5', fontSize: 13, lineHeight: 1.6 }}>{generated}</span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={copy}
                style={{ flex: 1, padding: '12px 0', borderRadius: 10, background: copied ? 'rgba(16,185,129,0.3)' : '#059669', color: '#fff', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                {copied ? '✓ Copied!' : 'Copy Link'}
              </button>
              
                href={generated}
                target="_blank"
                rel="noreferrer"
                style={{ flex: 1, padding: '12px 0', borderRadius: 10, background: 'rgba(255,255,255,0.06)', color: '#9ca3af', fontSize: 14, fontWeight: 500, border: '1px solid rgba(255,255,255,0.1)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Preview →
              </a>
            </div>

            {/* DM script */}
            <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ color: '#6b7280', fontSize: 12, fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '.06em', marginBottom: 10 }}>DM Script</p>
              <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 10, padding: '14px 16px', color: '#9ca3af', fontSize: 13, lineHeight: 1.7 }}>
                Hey {name.split(' ')[0]}! I noticed you handle brand deals directly — wanted to put something on your radar. I went ahead and built a free rate card for you so you can see what it looks like: <span style={{ color: '#6ee7b7' }}>{generated}</span><br/><br/>
                Brands can click it, see your pricing, and book you directly — no back-and-forth. Completely free to claim, takes 2 minutes. Let me know if you have any questions!
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div style={{ marginTop: 32, padding: 24, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16 }}>
          <p style={{ color: '#6b7280', fontSize: 12, fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '.06em', marginBottom: 16 }}>How to find engagement rate</p>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
            {[
              { site: 'phlanx.com', desc: 'Free Instagram engagement calculator — paste handle, instant result' },
              { site: 'hypeauditor.com', desc: 'Free estimates for IG and TikTok — search any public account' },
              { site: 'TikTok profile', desc: 'For TikTok: (avg likes + comments) ÷ followers × 100' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ color: '#10b981', fontSize: 14, marginTop: 1 }}>→</span>
                <div>
                  <span style={{ color: '#d1d5db', fontSize: 13, fontWeight: 500 }}>{item.site}</span>
                  <span style={{ color: '#4b5563', fontSize: 13 }}> — {item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
