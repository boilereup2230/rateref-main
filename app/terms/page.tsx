export default function TermsPage() {
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
        <h1 style={{fontSize:40,fontWeight:800,marginBottom:8}}>Terms of Service</h1>
        <p style={{color:'#6b7280',fontSize:14,marginBottom:48}}>Last updated: May 2026</p>

        {[
          {title:'1. Acceptance of Terms',body:'By accessing or using RateRef ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service. RateRef is operated by RateRef LLC.'},
          {title:'2. Description of Service',body:'RateRef is a platform that allows content creators ("Creators") to publish live rate cards for brand partnership deals, and allows brands and agencies ("Brands") to discover creators and submit booking inquiries. RateRef is a marketplace tool only and does not guarantee any brand deals, transactions, payments, or partnerships.'},
          {title:'3. User Accounts',body:'You must provide accurate and complete information when creating an account. You are responsible for maintaining the security of your account credentials. You may not use another user\'s account without permission. You must be at least 18 years old to use the Service.'},
          {title:'4. Creator Responsibilities',body:'Creators are responsible for ensuring that all information on their rate card — including follower counts, engagement rates, and pricing — is accurate and up to date. RateRef does not independently verify creator metrics. Creators are solely responsible for fulfilling any brand deals arranged through the platform.'},
          {title:'5. Brand Responsibilities',body:'Brands using the directory or submitting booking inquiries represent that they have the authority to enter into creator partnerships on behalf of their organization. All inquiries submitted through the platform are non-binding until a separate agreement is reached between the Creator and the Brand.'},
          {title:'6. No Guarantee of Results',body:'RateRef makes no representations or warranties that use of the Service will result in brand deals, revenue, partnerships, or any other specific outcome. The Service is provided as a tool to facilitate connections between Creators and Brands only.'},
          {title:'7. Payments and Fees',body:'The free tier of RateRef is available at no cost subject to usage limits. Premium features, when available, will be billed as described at the time of purchase. All fees are non-refundable except as required by law. RateRef reserves the right to change pricing with reasonable notice.'},
          {title:'8. Intellectual Property',body:'You retain ownership of all content you submit to RateRef. By submitting content, you grant RateRef a limited license to display and use that content to operate the Service. RateRef\'s branding, design, and technology remain the property of RateRef LLC.'},
          {title:'9. Prohibited Conduct',body:'You may not use RateRef to submit false or misleading information, spam other users, engage in fraudulent activity, violate any applicable laws or regulations, or interfere with the operation of the Service.'},
          {title:'10. Termination',body:'RateRef reserves the right to suspend or terminate any account at any time for violation of these terms or for any other reason at our discretion. You may delete your account at any time by contacting us.'},
          {title:'11. Limitation of Liability',body:'To the maximum extent permitted by law, RateRef LLC shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service. Our total liability to you shall not exceed the amount you paid to RateRef in the 12 months preceding the claim.'},
          {title:'12. Governing Law',body:'These Terms are governed by the laws of the State of Indiana, United States. Any disputes shall be resolved in the courts of Indiana.'},
          {title:'13. Changes to Terms',body:'We may update these Terms from time to time. We will notify users of material changes by email or by posting a notice on the Service. Continued use of the Service after changes constitutes acceptance of the new Terms.'},
          {title:'14. Contact',body:'For questions about these Terms, contact us at hello@rateref.co'},
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
