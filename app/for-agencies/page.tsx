export default function ForAgenciesPage() {

  return (
    <div style={{ margin: 0, padding: 0, fontFamily: "'Georgia', 'Times New Roman', serif", background: '#0a0a0a', color: '#f5f0e8', minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0a; }
        .hero-text { font-family: 'Playfair Display', serif; }
        .body-text { font-family: 'DM Sans', sans-serif; }
        .cta-btn { display: inline-flex; align-items: center; gap: 8px; background: #059669; color: #fff; padding: 16px 32px; border-radius: 12px; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 500; text-decoration: none; transition: all .2s; border: none; cursor: pointer; letter-spacing: .01em; white-space: nowrap; }
        .cta-btn:hover { background: #047857; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(5,150,105,0.3); }
        .feature-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 28px; transition: all .2s; }
        .feature-card:hover { background: rgba(255,255,255,0.06); border-color: rgba(16,185,129,0.2); transform: translateY(-2px); }
        .divider { height: 1px; background: linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent); margin: 80px 0; }
        .navbar { padding: 20px 40px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.06); position: sticky; top: 0; background: rgba(10,10,10,0.9); backdrop-filter: blur(12px); z-index: 50; }
        .nav-links { display: flex; gap: 32px; }
        .nav-link { font-family: 'DM Sans', sans-serif; font-size: 14px; color: #9ca3af; text-decoration: none; transition: color .15s; }
        .nav-link:hover { color: #f5f0e8; }
        .nav-link.active { color: #10b981; }
        .nil-callout { background: rgba(16,185,129,0.06); border: 1px solid rgba(16,185,129,0.2); border-radius: 16px; padding: 28px; }
        .step-num { font-family: 'Playfair Display', serif; font-size: 48px; font-weight: 900; color: rgba(16,185,129,0.15); line-height: 1; margin-bottom: 12px; }
        .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-family: 'DM Sans', sans-serif; font-weight: 500; }
        .badge-green { background: rgba(16,185,129,0.15); color: #6ee7b7; }
        @media(max-width:768px) {
          .nav-links { display: none; }
          .navbar { padding: 16px 20px; }
          .hero-title { font-size: 42px !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Nav */}
      <nav className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, background: '#059669', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 13, fontFamily: 'DM Sans, sans-serif' }}>RR</span>
          </div>
          <a href="/" style={{ textDecoration: 'none' }}>
            <span className="hero-text" style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-.01em', color: '#f5f0e8' }}>RateRef</span>
          </a>
        </div>
        <div className="nav-links">
          <a href="/#how" className="nav-link">How it works</a>
          <a href="/for-agencies" className="nav-link active">For Agencies</a>
          <a href="/#pricing" className="nav-link">Pricing</a>
        </div>
        <a href="/login" className="cta-btn" style={{ padding: '10px 20px', fontSize: 14 }}>Get started free →</a>
      </nav>

      {/* Hero */}
      <section style={{ padding: '100px 40px 80px', maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="badge badge-green body-text" style={{ marginBottom: 24, display: 'inline-block' }}>For Agencies, Collectives & Talent Managers</span>
          <h1 className="hero-text hero-title" style={{ fontSize: 68, fontWeight: 900, lineHeight: 1.05, letterSpacing: '-.03em', marginBottom: 24, color: '#f5f0e8' }}>
            Give every creator on<br/>your roster a professional<br/><em style={{ background: 'linear-gradient(135deg,#f5f0e8 0%,#10b981 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>rate card. In minutes.</em>
          </h1>
          <p className="body-text" style={{ fontSize: 20, color: '#9ca3af', maxWidth: 580, margin: '0 auto 48px', lineHeight: 1.6, fontWeight: 300 }}>
            One live link per talent. Real-time pricing. Brand inquiries delivered directly — no back-and-forth, no PDF rate sheets, no "what should I charge?" conversations. Free for your entire roster.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/setup" className="cta-btn" style={{ fontSize: 17, padding: '18px 36px' }}>Set up your first talent free →</a>
            <a href="/#how" className="body-text" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#9ca3af', padding: '18px 24px', fontSize: 15, textDecoration: 'none', transition: 'color .2s' }}>See how it works ↓</a>
          </div>
          <p className="body-text" style={{ color: '#374151', fontSize: 13, marginTop: 16 }}>Free forever on the free tier · No credit card · Takes 2 minutes per talent</p>
        </div>

        {/* Mock rate card preview */}
        <div style={{ maxWidth: 460, margin: '0 auto', background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>
          <div style={{ background: '#1f2937', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
            <span className="body-text" style={{ color: '#6b7280', fontSize: 12, marginLeft: 8 }}>rateref.co/c/saracreates</span>
          </div>
          <div style={{ padding: '20px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', fontWeight: 700, fontFamily: 'DM Sans,sans-serif' }}>SC</div>
              <div>
                <span style={{ color: '#f5f0e8', fontWeight: 600, fontSize: 14, fontFamily: 'DM Sans,sans-serif' }}>Sara Chen</span>
                <div style={{ display: 'flex', gap: 12, marginTop: 2 }}>
                  <span style={{ color: '#4b5563', fontSize: 12, fontFamily: 'DM Sans,sans-serif' }}>46.2K followers</span>
                  <span style={{ color: '#10b981', fontSize: 12, fontFamily: 'DM Sans,sans-serif' }}>⚡ 4.1% eng.</span>
                </div>
              </div>
            </div>
            {[
              { label: 'Instagram Reel', price: '$693', bonus: true },
              { label: 'Instagram Story', price: '$312', bonus: true },
              { label: 'TikTok Video', price: '$624', bonus: true },
            ].map((item, i) => (
              <div key={i} style={{ padding: '12px 0', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color: '#d1d5db', fontSize: 13, fontFamily: 'DM Sans,sans-serif' }}>{item.label}</span>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: '#f5f0e8', fontSize: 13, fontFamily: 'DM Sans,sans-serif', fontWeight: 600 }}>{item.price}</span>
                  {item.bonus && <div style={{ color: '#10b981', fontSize: 10, fontFamily: 'DM Sans,sans-serif' }}>⚡ Bonus tier</div>}
                </div>
              </div>
            ))}
            <div style={{ paddingTop: 12, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#f5f0e8', fontSize: 14, fontFamily: 'DM Sans,sans-serif', fontWeight: 600 }}>Total</span>
              <span style={{ color: '#10b981', fontSize: 14, fontFamily: 'DM Sans,sans-serif', fontWeight: 700 }}>$1,629</span>
            </div>
          </div>
        </div>
        <p className="body-text" style={{ textAlign: 'center', color: '#374151', fontSize: 12, marginTop: 12 }}>↑ What a brand sees when they click your talent's link</p>
      </section>

      <div className="divider" style={{ maxWidth: 1100, margin: '0 auto' }} />

      {/* Who this is for */}
      <section style={{ padding: '0 40px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 className="hero-text" style={{ fontSize: 48, fontWeight: 800, letterSpacing: '-.02em', marginBottom: 16 }}>Built for anyone<br/>who manages talent.</h2>
          <p className="body-text" style={{ color: '#9ca3af', fontSize: 18, fontWeight: 300 }}>If your talent does brand deals, they need a rate card. We make that effortless at scale.</p>
        </div>
        <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
          {[
            { icon: '🏈', title: 'NIL Collectives & Directors', desc: 'College athletes are navigating brand deals with zero infrastructure. Give your entire roster a professional rate card in an afternoon — free, compliant, and ready to share with local and national brands.' },
            { icon: '📸', title: 'Talent & Model Agencies', desc: 'Stop emailing custom rate sheets for every inquiry. Each model or influencer on your roster gets their own live link. Brands self-serve the quote and submit directly — you stay in the loop without being in the middle of every conversation.' },
            { icon: '🎬', title: 'UGC & Creator Agencies', desc: 'Your creators produce content for brands every day. Make it easy for brands to find, price, and book them. One link per creator, always showing current rates — no more back-and-forth on what a deliverable costs.' },
          ].map((item, i) => (
            <div key={i} className="feature-card">
              <div style={{ fontSize: 32, marginBottom: 16 }}>{item.icon}</div>
              <h3 className="hero-text" style={{ fontSize: 22, fontWeight: 700, marginBottom: 12, letterSpacing: '-.01em' }}>{item.title}</h3>
              <p className="body-text" style={{ color: '#9ca3af', lineHeight: 1.6, fontSize: 15, fontWeight: 300 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" style={{ maxWidth: 1100, margin: '0 auto' }} />

      {/* How it works */}
      <section style={{ padding: '0 40px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 className="hero-text" style={{ fontSize: 48, fontWeight: 800, letterSpacing: '-.02em', marginBottom: 16 }}>Your whole roster live<br/>in an afternoon.</h2>
          <p className="body-text" style={{ color: '#9ca3af', fontSize: 18, fontWeight: 300 }}>No design tools. No software to learn. No per-seat fees.</p>
        </div>
        <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
          {[
            { n: '01', title: 'Set up each talent', desc: 'Go to rateref.co/setup for each person on your roster. Enter their display name, follower count, and engagement rate. Takes about 2 minutes per talent. They get a live rate card at rateref.co/c/theirname.' },
            { n: '02', title: 'Share their link', desc: "Each talent adds their RateRef link to their Instagram bio, Beacons page, email signature, or anywhere brands reach out. You can also include it in your agency's pitch decks and media kits." },
            { n: '03', title: 'Brands book directly', desc: 'When a brand clicks the link, they select deliverables (Reels, Stories, TikToks, etc.), see a live pricing quote with add-ons like exclusivity and whitelisting, and submit a booking request. No negotiation required.' },
          ].map((s, i) => (
            <div key={i} className="feature-card">
              <div className="step-num">{s.n}</div>
              <h3 className="hero-text" style={{ fontSize: 22, fontWeight: 700, marginBottom: 12, letterSpacing: '-.01em' }}>{s.title}</h3>
              <p className="body-text" style={{ color: '#9ca3af', lineHeight: 1.6, fontSize: 15, fontWeight: 300 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" style={{ maxWidth: 1100, margin: '0 auto' }} />

      {/* Pricing clarity */}
      <section style={{ padding: '0 40px 80px', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <h2 className="hero-text" style={{ fontSize: 48, fontWeight: 800, letterSpacing: '-.02em', marginBottom: 16 }}>Free for your<br/>entire roster.</h2>
        <p className="body-text" style={{ color: '#9ca3af', fontSize: 18, marginBottom: 48, lineHeight: 1.6, fontWeight: 300 }}>
          No per-seat pricing. No contracts. No setup fees. Every talent on your roster gets a full live rate card, unlimited brand inquiries, and all post types and add-ons — free, forever on the free tier.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 600, margin: '0 auto 48px' }}>
          {[
            'Full live rate card per talent',
            'Unlimited brand inquiries',
            'All post types & add-ons',
            'Real-time pricing engine',
            'Booking request dashboard',
            'Instagram, TikTok, YouTube',
          ].map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: '#10b981', fontSize: 14 }}>✓</span>
              <span className="body-text" style={{ color: '#9ca3af', fontSize: 14 }}>{f}</span>
            </div>
          ))}
        </div>
        <a href="/setup" className="cta-btn" style={{ fontSize: 17, padding: '18px 40px' }}>Set up your first talent free →</a>
        <p className="body-text" style={{ color: '#374151', fontSize: 13, marginTop: 16 }}>No credit card · No contract · Cancel anytime</p>
      </section>

      <div className="divider" style={{ maxWidth: 1100, margin: '0 auto' }} />

      {/* NIL Compliance callout */}
      <section style={{ padding: '0 40px 80px', maxWidth: 800, margin: '0 auto' }}>
        <div className="nil-callout">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <span style={{ fontSize: 28, flexShrink: 0 }}>⚖️</span>
            <div>
              <h3 className="hero-text" style={{ fontSize: 26, fontWeight: 700, marginBottom: 12, letterSpacing: '-.01em' }}>A note for NIL directors & college athletic departments.</h3>
              <p className="body-text" style={{ color: '#9ca3af', lineHeight: 1.7, fontSize: 15, fontWeight: 300, marginBottom: 16 }}>
                RateRef is a <strong style={{ color: '#f5f0e8' }}>presentation and inquiry tool only</strong> — it does not facilitate payments, execute contracts, or act as a deal intermediary of any kind. Student-athletes simply use it to present their rates and receive initial brand inquiries.
              </p>
              <p className="body-text" style={{ color: '#9ca3af', lineHeight: 1.7, fontSize: 15, fontWeight: 300, marginBottom: 16 }}>
                Any actual deal execution, compensation, and NIL Go reporting happens through your existing compliance processes, exactly as it does today. There are no compliance concerns for student-athletes simply having a RateRef profile.
              </p>
              <p className="body-text" style={{ color: '#9ca3af', lineHeight: 1.7, fontSize: 15, fontWeight: 300 }}>
                Think of it the same way you'd think of a student-athlete having a Linktree or Beacons page — it's infrastructure for brand discovery and inquiry, not a financial or contractual instrument.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" style={{ maxWidth: 1100, margin: '0 auto' }} />

      {/* Final CTA */}
      <section style={{ padding: '0 40px 120px', maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
        <h2 className="hero-text" style={{ fontSize: 56, fontWeight: 900, letterSpacing: '-.03em', marginBottom: 20, lineHeight: 1.05 }}>
          Your roster deserves<br/><em style={{ color: '#10b981' }}>better than a PDF.</em>
        </h2>
        <p className="body-text" style={{ color: '#9ca3af', fontSize: 18, marginBottom: 40, lineHeight: 1.6, fontWeight: 300 }}>
          Set up your first talent's rate card in 2 minutes. Free forever. No catch.
        </p>
        <a href="/setup" className="cta-btn" style={{ fontSize: 17, padding: '18px 40px' }}>
          Set up your first talent free →
        </a>
        <p className="body-text" style={{ color: '#374151', fontSize: 13, marginTop: 16 }}>Takes 2 minutes · Free forever · No credit card</p>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, background: '#059669', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 11, fontFamily: 'DM Sans,sans-serif' }}>RR</span>
          </div>
          <span className="hero-text" style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-.01em' }}>RateRef</span>
        </div>
        <p className="body-text" style={{ color: '#374151', fontSize: 13 }}>The live rate card for creators who do brand deals.</p>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <a href="/terms" style={{ color: '#6b7280', fontSize: 13, textDecoration: 'none', fontFamily: 'DM Sans,sans-serif' }}>Terms</a>
          <a href="/privacy" style={{ color: '#6b7280', fontSize: 13, textDecoration: 'none', fontFamily: 'DM Sans,sans-serif' }}>Privacy</a>
          <a href="/login" style={{ color: '#6b7280', fontSize: 13, textDecoration: 'none', fontFamily: 'DM Sans,sans-serif' }}>Sign in →</a>
        </div>
      </footer>
    </div>
  )
}
