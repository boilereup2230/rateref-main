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

  const firstName = name.split(' ')[0] || 'there'
  const isValid = name && handle && followers && engagement

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: 'system-ui, sans-serif', color: '#f5f0e8' }}>

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

        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Preview Link Generator</h1>
        <p style={{ color: '#6b7280', fontSize: 15, lineHeight: 1.6, marginBottom: 40 }}>
          Fill in a creator&apos;s public stats to generate a personalized preview link.
        </p>

        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 28, marginBottom: 24 }}>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', color: '#9ca3af', fontSize: 12, fontWeight: 500, marginBottom: 8 }}>FULL NAME *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Laura Brocato"
              style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '12px 16px', color: '#f5f0e8', fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', color: '#9ca3af', fontSize: 12, fontWeight: 500, marginBottom: 8 }}>HANDLE (no @) *</label>
            <input
              type="text"
              value={handle}
              onChange={e => setHandle(e.target.value.replace('@', ''))}
              placeholder="theicymom"
              style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '12px 16px', color: '#f5f0e8', fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div>
              <label style={{ display: 'block', color: '#9ca3af', fontSize: 12, fontWeight: 500, marginBottom: 8 }}>FOLLOWERS (numbers only) *</label>
              <input
                type="number"
                value={followers}
                onChange={e => setFollowers(e.target.value)}
                placeholder="70000"
                style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '12px 16px', color: '#f5f0e8', fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#9ca3af', fontSize: 12, fontWeight: 500, marginBottom: 8 }}>ENGAGEMENT % *</label>
              <input
                type="number"
                step="0.1"
                value={engagement}
                onChange={e => setEngagement(e.target.value)}
                placeholder="4.1"
                style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '12px 16px', color: '#f5f0e8', fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'block', color: '#9ca3af', fontSize: 12, fontWeight: 500, marginBottom: 8 }}>PLATFORM *</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { key: 'instagram', label: 'Instagram' },
                { key: 'tiktok', label: 'TikTok' },
                { key: 'youtube', label: 'YouTube' },
              ].map(p => (
                <button
                  key={p.key}
                  onClick={() => setPlatform(p.key)}
                  style={{
                    flex: 1,
                    padding: '10px 0',
                    borderRadius: 10,
                    border: platform === p.key ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.12)',
                    background: platform === p.key ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)',
                    color: platform === p.key ? '#10b981' : '#6b7280',
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generate}
            disabled={!isValid}
            style={{
              width: '100%',
              padding: '14px 0',
              borderRadius: 12,
              background: isValid ? '#059669' : 'rgba(5,150,105,0.3)',
              color: '#fff',
              fontSize: 15,
              fontWeight: 600,
              border: 'none',
              cursor: isValid ? 'pointer' : 'not-allowed',
            }}>
            Generate Preview Link →
          </button>
        </div>

        {generated && (
          <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 16, padding: 24 }}>
            <p style={{ color: '#6ee7b7', fontSize: 12, fontWeight: 500, marginBottom: 12 }}>✓ PREVIEW LINK READY</p>
            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 16, wordBreak: 'break-all' }}>
              <span style={{ color: '#d1fae5', fontSize: 13, lineHeight: 1.6 }}>{generated}</span>
            </div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
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

            <div style={{ paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ color: '#6b7280', fontSize: 12, fontWeight: 500, marginBottom: 10 }}>READY-TO-SEND DM SCRIPT</p>
              <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 10, padding: '14px 16px', color: '#9ca3af', fontSize: 13, lineHeight: 1.8 }}>
                Hey {firstName}! I noticed you handle brand deals directly — wanted to put something on your radar. I went ahead and built a free rate card for you so you can see what it looks like: {generated} — Brands can click it, see your pricing, and book you directly. No back-and-forth. Completely free to claim, takes 2 minutes!
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: 32, padding: 24, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16 }}>
          <p style={{ color: '#6b7280', fontSize: 12, fontWeight: 500, marginBottom: 16 }}>HOW TO FIND ENGAGEMENT RATE</p>
          {[
            { site: 'phlanx.com', desc: 'Free Instagram engagement calculator — paste handle, instant result' },
            { site: 'hypeauditor.com', desc: 'Free estimates for IG and TikTok — search any public account' },
            { site: 'TikTok manual calc', desc: '(avg likes + comments) ÷ followers × 100' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
              <span style={{ color: '#10b981', fontSize: 14 }}>→</span>
              <div>
                <span style={{ color: '#d1d5db', fontSize: 13, fontWeight: 500 }}>{item.site}</span>
                <span style={{ color: '#4b5563', fontSize: 13 }}> — {item.desc}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
