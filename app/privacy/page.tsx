export default function PrivacyPage() {
  return (
    <div style={{background:'#0a0a0a',minHeight:'100vh',color:'#f1f5f9',fontFamily:"'DM Sans',-apple-system,sans-serif"}}>
      <nav style={{padding:'20px 40px',borderBottom:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <a href="/" style={{display:'flex',alignItems:'center',gap:8,textDecoration:'none'}}>
          <div style={{width:32,height:32,background:'#059669',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <span style={{color:'#fff',fontWeight:700,fontSize:13}}>RR</span>
          </div>
          <span style={{fontSize:18,fontWeight:700,color:'#f1f5f9'}}>RateRef</span>
        </a>
        <a href="/" style={{color:'#6b7280',fontSize:14,textDecoration:'none'}}>← Back to home</a>
      </nav>
      <div style={{maxWidth:720,margin:'0 auto',padding:'60px 40px'}}>
        <h1 style={{fontSize:40,fontWeight:800,marginBottom:8}}>Privacy Policy</h1>
        <p style={{color:'#6b7280',fontSize:14,marginBottom:48}}>Last updated: May 2026</p>

        {[
          {title:'1. Introduction',body:'RateRef LLC ("we", "us", or "our") operates rateref.co. This Privacy Policy explains how we collect, use, and protect information about you when you use our Service.'},
          {title:'2. Information We Collect',body:'We collect information you provide directly: your email address and password when you create an account; your display name, social media handles, follower count, and engagement rate when you set up a creator profile; and brand name, email, and campaign brief when a brand submits an inquiry. We also collect basic usage data such as pages visited and features used.'},
          {title:'3. How We Use Your Information',body:'We use your information to operate and improve the Service; to display your public rate card to brand visitors; to send you account-related emails including confirmation and notifications; to respond to your questions and support requests; and to analyze usage patterns to improve the product.'},
          {title:'4. Public Information',body:'Creator profiles marked as published are publicly visible. This includes your display name, social handles, bio, follower count, engagement rate, and rates. Do not include information on your profile that you do not want to be publicly visible.'},
          {title:'5. Third-Party Services',body:'We use Supabase to store your data securely. We use Vercel to host and serve the application. These services have their own privacy policies and security practices. We do not sell your personal information to any third party.'},
          {title:'6. Data Security',body:'We implement reasonable security measures to protect your information. Your password is encrypted and never stored in plain text. However, no method of internet transmission is 100% secure and we cannot guarantee absolute security.'},
          {title:'7. Data Retention',body:'We retain your account information for as long as your account is active. You may request deletion of your account and associated data at any time by contacting us at hello@rateref.co. We will process deletion requests within 30 days.'},
          {title:'8. Your Rights',body:'You have the right to access the personal information we hold about you; to correct inaccurate information; to request deletion of your information; and to opt out of marketing communications. To exercise these rights, contact us at hello@rateref.co.'},
          {title:'9. Cookies',body:'RateRef uses essential cookies to maintain your login session. We do not use advertising or tracking cookies. You can disable cookies in your browser settings but this may affect your ability to use the Service.'},
          {title:'10. Children\'s Privacy',body:'RateRef is not intended for users under 18 years of age. We do not knowingly collect personal information from children under 18. If we become aware that a child under 18 has provided us with personal information, we will delete it.'},
          {title:'11. Changes to This Policy',body:'We may update this Privacy Policy from time to time. We will notify you of significant changes by email or by posting a notice on the Service. Your continued use of the Service after changes constitutes acceptance of the updated policy.'},
          {title:'12. Contact Us',body:'If you have questions about this Privacy Policy or how we handle your data, please contact us at hello@rateref.co'},
        ].map((s,i) => (
          <div key={i} style={{marginBottom:32}}>
            <h2 style={{fontSize:18,fontWeight:700,color:'#f1f5f9',marginBottom:8}}>{s.title}</h2>
            <p style={{color:'#9ca3af',lineHeight:1.7,fontSize:15}}>{s.body}</p>
          </div>
        ))}
      </div>
      <footer style={{borderTop:'1px solid rgba(255,255,255,0.06)',padding:'24px 40px',display:'flex',gap:24,justifyContent:'center'}}>
        <a href="/terms" style={{color:'#6b7280',fontSize:13,textDecoration:'none'}}>Terms of Service</a>
        <a href="/privacy" style={{color:'#6b7280',fontSize:13,textDecoration:'none'}}>Privacy Policy</a>
        <a href="/" style={{color:'#6b7280',fontSize:13,textDecoration:'none'}}>Home</a>
      </footer>
    </div>
  )
}
