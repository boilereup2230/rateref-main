import { createClient } from '@supabase/supabase-js'

async function unsubscribeEmail(email: string) {
  if (!email) return { success: false, message: 'No email provided.' }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('id, welcome_email_ids')
    .eq('email', email)
    .single()

  if (fetchError || !profile) {
    return { success: false, message: 'We couldn\'t find an account with that email.' }
  }

  // Cancel any pending scheduled emails (day 3 / day 7 welcome sequence)
  const scheduledIds = (profile as any).welcome_email_ids as string[] | null
  if (scheduledIds && scheduledIds.length > 0) {
    const resendApiKey = process.env.RESEND_API_KEY
    for (const id of scheduledIds) {
      try {
        await fetch(`https://api.resend.com/emails/${id}/cancel`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${resendApiKey}` },
        })
      } catch {
        // ignore individual cancel failures — best effort
      }
    }
  }

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ email_opted_out: true } as any)
    .eq('id', profile.id)

  if (updateError) {
    return { success: false, message: 'Something went wrong. Please try again.' }
  }

  return { success: true, message: 'You\'ve been unsubscribed from RateRef emails.' }
}

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: { email?: string }
}) {
  const email = searchParams.email || ''
  const result = await unsubscribeEmail(email)

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif', padding: '24px' }}>
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '40px', maxWidth: '440px', textAlign: 'center' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: result.success ? '#d1fae5' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <span style={{ fontSize: '24px' }}>{result.success ? '✓' : '⚠️'}</span>
        </div>
        <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
          {result.success ? 'Unsubscribed' : 'Something went wrong'}
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.6 }}>{result.message}</p>
        <a href="https://rateref.co" style={{ display: 'inline-block', marginTop: '24px', fontSize: '13px', color: '#059669', textDecoration: 'none', fontWeight: 500 }}>
          ← Back to RateRef
        </a>
      </div>
    </div>
  )
}
