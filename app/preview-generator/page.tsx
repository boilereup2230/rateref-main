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

  const firstName = name.split(' ')[0] || 'there'
  const isValid = !!(name && handle && followers && engagement)

  function generate() {
    if (!isValid) return
    const slug = handle.replace('@', '').toLowerCase().replace(/[^a-z0-9-]/g, '')
    const encoded = name.trim().replace(/\s+/g, '+')
    setGenerated(`https://rateref.co/preview?name=${encoded}&handle=${slug}&followers=${followers}&engagement=${engagement}&platform=${platform}`)
    setCopied(false)
  }

  function copy() {
    navigator.clipboard.writeText(generated)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const s: Record<string, React.CSSProperties> = {
    page: { minHeight: '100vh', background: '#0a0a0a', fontFamily: 'system-ui, sans-serif', color: '#f5f0e8', padding: '0' },
    nav: { padding: '16px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '8px' },
    logo: { width: '28px', height: '28px', background: '#059669', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    logoText: { color: '#fff', fontWeight: 700, fontSize: '11px' },
    siteTitle: { color: '#f5f0e8', fontWeight: 700, fontSize: '16px', textDecoration: 'none' },
    subTitle: { color: '#374151', fontSize: '14px', marginLeft: '8px' },
    content: { maxWidth: '600px', margin: '0 auto', padding: '48px 24px' },
    h1: { fontSize: '28px', fontWeight: 700, marginBottom: '8px', color: '#f5f0e8' },
    subtitle: { color: '#6b7280', fontSize: '15px', lineHeight: '1.6', marginBottom: '40px' },
    card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '28px', marginBottom: '24px' },
    label: { display: 'block', color: '#9ca3af', fontSize: '12px', fontWeight: 500, marginBottom: '8px' },
    input: { width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '12px 16px', color: '#f5f0e8', fontSize: '15px', outline: 'none', marginBottom: '20px' },
    grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' },
    hint: { color: '#4b5563', fontSize: '12px', marginTop: '4px' },
    platformRow: { display: 'flex', gap: '10px', marginBottom: '28px' },
    genBtn: { width: '100%', padding: '14px 0', borderRadius: '12px', color: '#fff', fontSize: '15px', fontWeight: 600, border: 'none' },
    result: { background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '16px', padding: '24px' },
    resultLabel: { color: '#6ee7b7', fontSize: '12px', fontWeight: 500, marginBottom: '12px' },
    urlBox: { background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', wordBreak: 'break-all' },
    urlText: { color: '#d1fae5', fontSize: '13px', lineHeight: '1.6' },
    btnRow: { display: 'flex', gap: '10px', marginBottom: '20px' },
    copyBtn: { flex: 1, padding: '12px 0', borderRadius: '10px', color: '#fff', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer' },
    previewLink: { flex: 1, padding: '12px 0', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', color: '#9ca3af', fontSize: '14px', fontWeight: 500, border: '1px solid rgba(255,255,255,0.1)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    divider: { paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)' },
    dmLabel: { color: '#6b7280', fontSize: '12px', fontWeight: 500, marginBottom: '10px' },
    dmBox: { background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '14px 16px', color: '#9ca3af', fontSize: '13px', lineHeight: '1.8' },
    tips: { marginTop: '32px', padding: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px' },
    tipsLabel: { color: '#6b7280', fontSize: '12px', fontWeight: 500, marginBottom: '16px' },
    tipRow: { display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '10px' },
    tipArrow: { color: '#10b981', fontSize: '14px' },
    tipSite: { color: '#d1d5db', fontSize: '13px', fontWeight: 500 },
    tipDesc: { color: '#4b5563', fontSize: '13px' },
  }

  return (
    <div style={s.page}>
      <div style={s.nav}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div style={s.logo}><span style={s.logoText}>RR</span></div>
          <span style={s.siteTitle}>RateRef</span>
        </a>
        <span style={s.subTitle}>/ Preview Generator</span>
      </div>

      <div style={s.content}>
        <h1 style={s.h1}>Preview Link Generator</h1>
        <p style={s.subtitle}>Fill in a creator&apos;s public stats to generate a personalized preview link. Send it to them so they can see exactly what their free RateRef rate card would look like.</p>

        <div style={s.card}>
          <label style={s.label}>FULL NAME *</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Laura Brocato" style={s.input} />

          <label style={s.label}>HANDLE (no @) *</label>
          <input type="text" value={handle} onChange={e => setHandle(e.target.value.replace('@', ''))} placeholder="theicymom" style={s.input} />

          <div style={s.grid2}>
            <div>
              <label style={s.label}>FOLLOWERS (numbers only) *</label>
              <input type="number" value={followers} onChange={e => setFollowers(e.target.value)} placeholder="70000" style={{ ...s.input, marginBottom: '0' }} />
              <p style={s.hint}>No K or M</p>
            </div>
            <div>
              <label style={s.label}>ENGAGEMENT % *</label>
              <input type="number" step="0.1" value={engagement} onChange={e => setEngagement(e.target.value)} placeholder="4.1" style={{ ...s.input, marginBottom: '0' }} />
              <p style={s.hint}>e.g. 4.1 for 4.1%</p>
            </div>
          </div>

          <label style={{ ...s.label, marginTop: '20px' }}>PLATFORM *</label>
          <div style={s.platformRow}>
            {['instagram', 'tiktok', 'youtube'].map(p => (
              <button key={p} onClick={() => setPlatform(p)} style={{ flex: 1, padding: '10px 0', borderRadius: '10px', border: platform === p ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.12)', background: platform === p ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)', color: platform === p ? '#10b981' : '#6b7280', fontSize: '13px', fontWeight: 500, cursor: 'pointer', textTransform: 'capitalize' }}>
                {p}
              </button>
            ))}
          </div>

          <button onClick={generate} disabled={!isValid} style={{ ...s.genBtn, background: isValid ? '#059669' : 'rgba(5,150,105,0.3)', cursor: isValid ? 'pointer' : 'not-allowed' }}>
            Generate Preview Link →
          </button>
        </div>

        {generated && (
          <div style={s.result}>
            <p style={s.resultLabel}>✓ PREVIEW LINK READY</p>
            <div style={s.urlBox}><span style={s.urlText}>{generated}</span></div>
            <div style={s.btnRow}>
              <button onClick={copy} style={{ ...s.copyBtn, background: copied ? 'rgba(16,185,129,0.3)' : '#059669' }}>
                {copied ? '✓ Copied!' : 'Copy Link'}
              </button>
              <a href={generated} target="_blank" rel="noreferrer" style={s.previewLink}>Preview →</a>
            </div>
            <div style={s.divider}>
              <p style={s.dmLabel}>READY-TO-SEND DM SCRIPT</p>
              <div style={s.dmBox}>
                Hey {firstName}! I noticed you handle brand deals directly — wanted to put something on your radar. I went ahead and built a free rate card for you: {generated} — Brands can click it, see your pricing, and book you directly. Completely free to claim, takes 2 minutes!
              </div>
            </div>
          </div>
        )}

        <div style={s.tips}>
          <p style={s.tipsLabel}>HOW TO FIND ENGAGEMENT RATE</p>
          {[
            { site: 'phlanx.com', desc: 'Free Instagram calculator — paste handle, instant result' },
            { site: 'hypeauditor.com', desc: 'Free estimates for IG and TikTok' },
            { site: 'TikTok manual', desc: '(avg likes + comments) ÷ followers × 100' },
          ].map((item, i) => (
            <div key={i} style={s.tipRow}>
              <span style={s.tipArrow}>→</span>
              <div><span style={s.tipSite}>{item.site}</span><span style={s.tipDesc}> — {item.desc}</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
