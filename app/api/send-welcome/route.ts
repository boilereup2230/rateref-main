import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { creatorEmail, creatorName, cardUrl } = await req.json()
    if (!creatorEmail || !creatorName || !cardUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await resend.emails.send({
      from: 'RateRef <notifications@rateref.co>',
      to: creatorEmail,
      subject: 'Your rate card is live 🎉',
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; color: #111827;">
          <div style="margin-bottom: 24px;">
            <span style="background: #059669; color: white; font-weight: 700; font-size: 13px; padding: 4px 10px; border-radius: 6px;">RateRef</span>
          </div>
          <h1 style="font-size: 22px; font-weight: 700; margin-bottom: 8px;">Your rate card is live, ${creatorName}.</h1>
          <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">Brands can now find you, see your rates, and submit booking requests directly — no back-and-forth required.</p>
          <a href="${cardUrl}" style="display: inline-block; background: #059669; color: white; font-weight: 600; font-size: 14px; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-bottom: 24px;">View your rate card →</a>
          <p style="color: #6b7280; font-size: 13px; line-height: 1.6;">Your link: <a href="${cardUrl}" style="color: #059669;">${cardUrl}</a><br/>Share it in your Instagram bio, email signature, or DMs.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          <p style="color: #9ca3af; font-size: 12px;">You're receiving this because you created a RateRef account. <a href="https://rateref.co" style="color: #9ca3af;">rateref.co</a></p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Welcome email error:', error)
    return NextResponse.json({ error: 'Failed to send welcome emails' }, { status: 500 })
  }
}
