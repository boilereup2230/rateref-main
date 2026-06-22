export default function LandingPage() {

  return (
    <div style={{margin:0,padding:0,fontFamily:"'Georgia', 'Times New Roman', serif",background:'#0a0a0a',color:'#f5f0e8',minHeight:'100vh',overflowX:'hidden'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#0a0a0a}
        .hero-text{font-family:'Playfair Display',serif}
        .body-text{font-family:'DM Sans',sans-serif}
        .pill{display:inline-flex;align-items:center;gap:6px;background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.3);color:#6ee7b7;padding:6px 14px;border-radius:100px;font-size:13px;font-family:'DM Sans',sans-serif;font-weight:500;letter-spacing:.02em}
        .dot{width:7px;height:7px;border-radius:50%;background:#10b981;animation:pulse 2s infinite}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.6;transform:scale(1.2)}}
        .cta-btn{display:inline-flex;align-items:center;gap:8px;background:#059669;color:#fff;padding:16px 32px;border-radius:12px;font-family:'DM Sans',sans-serif;font-size:16px;font-weight:500;text-decoration:none;transition:all .2s;border:none;cursor:pointer;letter-spacing:.01em;white-space:nowrap}
        .cta-btn:hover{background:#047857;transform:translateY(-1px);box-shadow:0 8px 24px rgba(5,150,105,0.3)}
        .cta-secondary{display:inline-flex;align-items:center;gap:8px;color:#9ca3af;padding:16px 24px;font-family:'DM Sans',sans-serif;font-size:15px;text-decoration:none;transition:color .2s}
        .cta-secondary:hover{color:#f5f0e8}
        .feature-card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:28px;transition:all .2s}
        .feature-card:hover{background:rgba(255,255,255,0.06);border-color:rgba(16,185,129,0.2);transform:translateY(-2px)}
        .step-num{font-family:'Playfair Display',serif;font-size:48px;font-weight:900;color:rgba(16,185,129,0.15);line-height:1;margin-bottom:12px}
        .divider{height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent);margin:80px 0}
        .mock-card{background:#111827;border:1px solid rgba(255,255,255,0.1);border-radius:16px;overflow:hidden;box-shadow:0 40px 80px rgba(0,0,0,0.6)}
        .mock-header{background:#1f2937;padding:14px 18px;display:flex;align-items:center;gap:8px;border-bottom:1px solid rgba(255,255,255,0.06)}
        .mock-dot{width:10px;height:10px;border-radius:50%}
        .mock-row{padding:14px 18px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.05);transition:background .15s}
        .mock-row:hover{background:rgba(16,185,129,0.04)}
        .mock-check{width:18px;height:18px;border-radius:4px;border:1.5px solid rgba(255,255,255,0.2);margin-right:12px;flex-shrink:0}
        .mock-check.checked{background:#059669;border-color:#059669;display:flex;align-items:center;justify-content:center}
        .badge{display:inline-block;padding:2px 8px;border-radius:20px;font-size:11px;font-family:'DM Sans',sans-serif;font-weight:500}
        .badge-green{background:rgba(16,185,129,0.15);color:#6ee7b7}
        .quote-card{background:#1f2937;border-radius:12px;padding:16px;margin-top:12px}
        .nav-link{font-family:'DM Sans',sans-serif;font-size:14px;color:#9ca3af;text-decoration:none;transition:color .15s}
        .nav-link:hover{color:#f5f0e8}
        .glow{position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none}
        .beacons-bar{background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.15);border-radius:10px;padding:12px 20px;display:inline-flex;align-items:center;gap:8px;font-family:'DM Sans',sans-serif;font-size:13px;color:#9ca3af;margin-top:16px}
        .beacons-bar span{color:#6ee7b7;font-weight:500}
        .navbar{padding:20px 40px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.06);position:sticky;top:0;background:rgba(10,10,10,0.9);backdrop-filter:blur(12px);z-index:50}
        .nav-links{display:flex;gap:32px}
        @media(max-width:768px){
          .hero-title{font-size:42px !important}
          .nav-links{display:none}
          .navbar{padding:16px 20px}
          .features-grid{grid-template-columns:1fr !important}
          .steps-grid{grid-template-columns:1fr !important}
          .pricing-grid{grid-template-columns:1fr !important}
        }
      `}</style>

      <div className="glow" style={{width:600,height:600,background:'rgba(5,150,105,0.08)',top:-200,left:-200,position:'absolute'}} />
      <div className="glow" style={{width:400,height:400,background:'rgba(16,185,129,0.05)',top:400,right:-100,position:'absolute'}} />

      <nav className="navbar">
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:32,height:32,background:'#059669',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <span style={{color:'#fff',fontWeight:700,fontSize:13,fontFamily:'DM Sans,sans-serif'}}>RR</span>
          </div>
          <span className="hero-text" style={{fontSize:18,fontWeight:700,letterSpacing:'-.01em'}}>RateRef</span>
        </div>
        <div className="nav-links">
          <a href="#how" className="nav-link">How it works</a>
          <a href="#why" className="nav-link">Why RateRef</a>
          <a href="#pricing" className="nav-link">Pricing</a>
        </div>
        <a href="/login" className="cta-btn" style={{padding:'10px 20px',fontSize:14}}>Get started free →</a>
      </nav>

      <section style={{padding:'100px 40px 80px',maxWidth:1100,margin:'0 auto',position:'relative'}}>
        <div style={{textAlign:'center',marginBottom:64}}>
          <div style={{display:'flex',justifyContent:'center',marginBottom:24}}>
            <span className="pill"><span className="dot"/>&nbsp;Free to start · No credit card</span>
          </div>
          <h1 className="hero-text hero-title" style={{fontSize:72,fontWeight:900,lineHeight:1.05,letterSpacing:'-.03em',marginBottom:24,color:'#f5f0e8'}}>
            Stop emailing your rates.<br/>
            Let brands <em style={{background:'linear-gradient(135deg,#f5f0e8 0%,#10b981 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>book instantly.</em>
          </h1>
          <p className="body-text" style={{fontSize:20,color:'#9ca3af',maxWidth:560,margin:'0 auto 40px',lineHeight:1.6,fontWeight:300}}>
            Paste your RateRef link in your bio or email signature. Brands select deliverables, see real-time pricing with add-ons like exclusivity and whitelisting, and submit a firm booking request. Zero back-and-forth.
          </p>

          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:12}}>
            <a href="/setup" className="cta-btn" style={{fontSize:17,padding:'18px 40px'}}>Create your free rate card →</a>
            <p className="body-text" style={{color:'#4b5563',fontSize:13}}>Takes 3 minutes · Free forever · No credit card</p>
          </div>

          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:12,flexWrap:'wrap',marginTop:16}}>
            <a href="#how" className="cta-secondary">See how it works ↓</a>
          </div>
          <div style={{display:'flex',justifyContent:'center',marginTop:16}}>
            <div className="beacons-bar">
              <span>✓</span> Already on Beacons or Linktree? Just add your RateRef link as a <span>"Brand partnerships"</span> button. 30 seconds.
            </div>
          </div>
        </div>

        <div style={{maxWidth:420,margin:'0 auto'}}>
          <div className="mock-card">
            <div className="mock-header">
              <div className="mock-dot" style={{background:'#ef4444'}}/>
              <div className="mock-dot" style={{background:'#f59e0b'}}/>
              <div className="mock-dot" style={{background:'#10b981'}}/>
              <span className="body-text" style={{color:'#6b7280',fontSize:12,marginLeft:8}}>rateref.co/c/saracreates</span>
            </div>
            <div style={{padding:'20px 18px 8px'}}>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
                <div style={{width:44,height:44,borderRadius:'50%',background:'rgba(16,185,129,0.15)',display:'flex',alignItems:'center',justifyContent:'center',color:'#10b981',fontWeight:700,fontFamily:'DM Sans,sans-serif'}}>SC</div>
                <div>
                  <div style={{display:'flex',alignItems:'center',gap:6}}>
                    <span style={{color:'#f5f0e8',fontWeight:600,fontSize:14,fontFamily:'DM Sans,sans-serif'}}>Sara Chen</span>
                    <span className="badge badge-green">✓ Verified</span>
                  </div>
                  <div style={{display:'flex',gap:12,marginTop:2}}>
                    <span style={{color:'#4b5563',fontSize:12,fontFamily:'DM Sans,sans-serif'}}>46.2K followers</span>
                    <span style={{color:'#10b981',fontSize:12,fontFamily:'DM Sans,sans-serif'}}>⚡ 4.1% eng.</span>
                  </div>
                </div>
              </div>
              <p style={{color:'#6b7280',fontSize:11,fontFamily:'DM Sans,sans-serif',marginBottom:12,textTransform:'uppercase',letterSpacing:'.06em'}}>Select deliverables</p>
            </div>
            {[
              {label:'Instagram Reel',desc:'60-sec branded video',price:'$693',checked:true},
              {label:'Instagram Story',desc:'3-frame story set',price:'$312',checked:true},
              {label:'TikTok Video',desc:'30–60 second',price:'$624',checked:false},
            ].map((item,i) => (
              <div key={i} className="mock-row">
                <div style={{display:'flex',alignItems:'center'}}>
                  <div className={`mock-check${item.checked?' checked':''}`}>
                    {item.checked && <svg width="10" height="10" viewBox="0 0 20 20" fill="white"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>}
                  </div>
                  <div>
                    <p style={{color:'#f5f0e8',fontSize:13,fontFamily:'DM Sans,sans-serif',fontWeight:500}}>{item.label}</p>
                    <p style={{color:'#4b5563',fontSize:11,fontFamily:'DM Sans,sans-serif'}}>{item.desc}</p>
                  </div>
                </div>
                <div style={{textAlign:'right'}}>
                  <p style={{color:'#f5f0e8',fontSize:13,fontFamily:'DM Sans,sans-serif',fontWeight:600}}>{item.price}</p>
                  <p style={{color:'#10b981',fontSize:10,fontFamily:'DM Sans,sans-serif'}}>⚡ Bonus tier</p>
                </div>
              </div>
            ))}
            <div className="quote-card" style={{margin:'12px 18px 18px'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                <span style={{color:'#6b7280',fontSize:12,fontFamily:'DM Sans,sans-serif'}}>Instagram Reel</span>
                <span style={{color:'#f5f0e8',fontSize:12,fontFamily:'DM Sans,sans-serif'}}>$693</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
                <span style={{color:'#6b7280',fontSize:12,fontFamily:'DM Sans,sans-serif'}}>Instagram Story</span>
                <span style={{color:'#f5f0e8',fontSize:12,fontFamily:'DM Sans,sans-serif'}}>$312</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',paddingTop:10,borderTop:'1px solid rgba(255,255,255,0.08)'}}>
                <span style={{color:'#f5f0e8',fontSize:14,fontFamily:'DM Sans,sans-serif',fontWeight:600}}>Total</span>
                <span style={{color:'#10b981',fontSize:14,fontFamily:'DM Sans,sans-serif',fontWeight:700}}>$1,005</span>
              </div>
            </div>
          </div>
          <p className="body-text" style={{textAlign:'center',color:'#374151',fontSize:12,marginTop:12}}>↑ What a brand manager sees when they click your link</p>
        </div>
      </section>

      <div className="divider" style={{maxWidth:1100,margin:'0 auto'}}/>

      <section id="how" style={{padding:'0 40px 80px',maxWidth:1100,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:56}}>
          <h2 className="hero-text" style={{fontSize:48,fontWeight:800,letterSpacing:'-.02em',marginBottom:16}}>Three minutes to live.</h2>
          <p className="body-text" style={{color:'#9ca3af',fontSize:18,fontWeight:300}}>No media kit software. No design tools. No waiting.</p>
        </div>
        <div className="steps-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:24}}>
          {[
            {n:'01',title:'Set up your profile',desc:'Enter your display name, handle, follower count, and engagement rate. Takes 2 minutes. Edit anytime.'},
            {n:'02',title:'Get your link',desc:'Your live rate card is instantly published at rateref.co/c/yourname. Drop it in your Instagram bio, Beacons page, email signature, or DMs.'},
            {n:'03',title:'Brands book you',desc:'When a brand clicks your link, they build their own campaign quote, see real-time pricing, and submit a booking request directly to your dashboard.'},
          ].map((s,i) => (
            <div key={i} className="feature-card">
              <div className="step-num">{s.n}</div>
              <h3 className="hero-text" style={{fontSize:22,fontWeight:700,marginBottom:12,letterSpacing:'-.01em'}}>{s.title}</h3>
              <p className="body-text" style={{color:'#9ca3af',lineHeight:1.6,fontSize:15,fontWeight:300}}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" style={{maxWidth:1100,margin:'0 auto'}}/>

      <section id="why" style={{padding:'0 40px 80px',maxWidth:1100,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:56}}>
          <h2 className="hero-text" style={{fontSize:48,fontWeight:800,letterSpacing:'-.02em',marginBottom:16}}>
            Built for creators<br/>who are serious<br/><em>about brand deals.</em>
          </h2>
        </div>
        <div className="features-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24}}>
          {[
            {icon:'⚡',title:'Engagement bonus pricing',desc:'If your engagement rate is above 3%, your rates automatically apply a 1.5× bonus multiplier. Your pricing reflects your actual value, not just your follower count.'},
            {icon:'🔄',title:'Live rates, always current',desc:'Unlike a PDF that goes stale the moment your metrics change, your RateRef card always shows your latest rates. Update your metrics in seconds anytime from your dashboard.'},
            {icon:'📊',title:'Real-time quote builder',desc:'Brands select exactly what they want — Reels, Stories, TikToks — and see a live campaign total build in real time. They show up to your inbox knowing the number.'},
            {icon:'➕',title:'Add-ons built in',desc:'Whitelisting (+20%), exclusivity (+30%), and rush fees (+15%) are standard options on every card. No more negotiating these separately.'},
            {icon:'📥',title:'Inquiry dashboard',desc:"Every booking request comes with the brand's name, email, campaign brief, and the exact quote they saw. Everything you need to respond fast."},
            {icon:'🔗',title:'One link does everything',desc:'Add your RateRef link to your Beacons page, email signature, or anywhere you talk to brands. Your media kit, rate sheet, and booking form all in one place.'},
          ].map((f,i) => (
            <div key={i} className="feature-card">
              <div style={{fontSize:28,marginBottom:14}}>{f.icon}</div>
              <h3 className="hero-text" style={{fontSize:20,fontWeight:700,marginBottom:10,letterSpacing:'-.01em'}}>{f.title}</h3>
              <p className="body-text" style={{color:'#9ca3af',lineHeight:1.6,fontSize:15,fontWeight:300}}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" style={{maxWidth:1100,margin:'0 auto'}}/>

      <section id="pricing" style={{padding:'0 40px 80px',maxWidth:1100,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:56}}>
          <h2 className="hero-text" style={{fontSize:48,fontWeight:800,letterSpacing:'-.02em',marginBottom:16}}>Free to start.<br/>Always.</h2>
          <p className="body-text" style={{color:'#9ca3af',fontSize:18,fontWeight:300}}>No credit card required. No trial period. Just sign up and go.</p>
        </div>
        <div className="pricing-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24,maxWidth:720,margin:'0 auto'}}>
          <div className="feature-card" style={{padding:36}}>
            <p className="body-text" style={{color:'#9ca3af',fontSize:13,textTransform:'uppercase',letterSpacing:'.08em',marginBottom:12}}>Free tier</p>
            <div style={{display:'flex',alignItems:'baseline',gap:4,marginBottom:24}}>
              <span className="hero-text" style={{fontSize:48,fontWeight:900}}>$0</span>
              <span className="body-text" style={{color:'#9ca3af',fontSize:15}}>/month</span>
            </div>
            {['Full live rate card','Unlimited inquiries','All post types & add-ons','Booking request dashboard','"Powered by RateRef" footer'].map((f,i) => (
              <div key={i} style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                <span style={{color:'#10b981',fontSize:14}}>✓</span>
                <span className="body-text" style={{color:'#9ca3af',fontSize:14}}>{f}</span>
              </div>
            ))}
            <a href="/login" className="cta-btn" style={{width:'100%',justifyContent:'center',marginTop:24,background:'rgba(5,150,105,0.15)',color:'#6ee7b7'}}>Get started free</a>
          </div>
          <div className="feature-card" style={{padding:36,borderColor:'rgba(16,185,129,0.3)',background:'rgba(16,185,129,0.05)',position:'relative'}}>
            <div style={{position:'absolute',top:-12,right:20,background:'#059669',color:'#fff',fontSize:11,fontFamily:'DM Sans,sans-serif',fontWeight:600,padding:'4px 12px',borderRadius:20,letterSpacing:'.05em',textTransform:'uppercase'}}>Coming soon</div>
            <p className="body-text" style={{color:'#9ca3af',fontSize:13,textTransform:'uppercase',letterSpacing:'.08em',marginBottom:12}}>Pro tier</p>
            <div style={{display:'flex',alignItems:'baseline',gap:4,marginBottom:24}}>
              <span className="hero-text" style={{fontSize:48,fontWeight:900}}>$19</span>
              <span className="body-text" style={{color:'#9ca3af',fontSize:15}}>/month</span>
            </div>
            {['Everything in free','Remove RateRef footer','Custom usage & licensing terms','Rate analytics & insights','Multiple platform configs'].map((f,i) => (
              <div key={i} style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                <span style={{color:'#10b981',fontSize:14}}>✓</span>
                <span className="body-text" style={{color:'#9ca3af',fontSize:14}}>{f}</span>
              </div>
            ))}
            <div style={{width:'100%',padding:'14px 0',textAlign:'center',marginTop:24,borderRadius:12,border:'1px solid rgba(16,185,129,0.2)',color:'#6b7280',fontFamily:'DM Sans,sans-serif',fontSize:15}}>Notify me when live</div>
          </div>
        </div>
      </section>

      <div className="divider" style={{maxWidth:1100,margin:'0 auto'}}/>

      <section style={{padding:'0 40px 120px',maxWidth:700,margin:'0 auto',textAlign:'center'}}>
        <h2 className="hero-text" style={{fontSize:56,fontWeight:900,letterSpacing:'-.03em',marginBottom:20,lineHeight:1.05,color:'#f5f0e8'}}>
          Your rates deserve<br/>a <em style={{color:'#10b981'}}>better home.</em>
        </h2>
        <p className="body-text" style={{color:'#9ca3af',fontSize:18,marginBottom:40,lineHeight:1.6,fontWeight:300}}>
          Stop losing brand deals to slow back-and-forth. Get a live rate card that works while you sleep.
        </p>
        <a href="/login" className="cta-btn" style={{fontSize:17,padding:'18px 40px'}}>Create your free rate card →</a>
        <p className="body-text" style={{color:'#374151',fontSize:13,marginTop:16}}>3 minutes to set up · No credit card · Free forever on free tier</p>
      </section>

      <footer style={{borderTop:'1px solid rgba(255,255,255,0.06)',padding:'32px 40px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:28,height:28,background:'#059669',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <span style={{color:'#fff',fontWeight:700,fontSize:11,fontFamily:'DM Sans,sans-serif'}}>RR</span>
          </div>
          <span className="hero-text" style={{fontSize:16,fontWeight:700,letterSpacing:'-.01em'}}>RateRef</span>
        </div>
        <p className="body-text" style={{color:'#374151',fontSize:13}}>The live rate card for creators who do brand deals.</p>
        <div style={{display:'flex',gap:20,alignItems:'center'}}>
          <a href="/terms" style={{color:'#6b7280',fontSize:13,textDecoration:'none',fontFamily:'DM Sans,sans-serif'}}>Terms</a>
          <a href="/privacy" style={{color:'#6b7280',fontSize:13,textDecoration:'none',fontFamily:'DM Sans,sans-serif'}}>Privacy</a>
          <a href="/login" style={{color:'#6b7280',fontSize:13,textDecoration:'none',fontFamily:'DM Sans,sans-serif'}}>Sign in →</a>
        </div>
      </footer>
    </div>
  )
}
