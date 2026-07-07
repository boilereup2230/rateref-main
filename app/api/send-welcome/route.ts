import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { creatorEmail, creatorName, cardUrl } = await req.json()
    if (!creatorEmail || !creatorName || !cardUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const now = new Date()
    const day3 = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString()
    const day7 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()

    const unsubscribeUrl = `https://rateref.co/unsubscribe?email=${encodeURIComponent(creatorEmail)}`

    const unsubscribeFooter = `
      <p style="color: #9ca3af; font-size: 12px;">You're receiving this because you created a RateRef account. <a href="https://rateref.co" style="color: #9ca3af;">rateref.co</a> · <a href="${unsubscribeUrl}" style="color: #9ca3af;">Unsubscribe</a></p>
    `

    // Email 1 — immediate welcome
    await resend.emails.send({
      from: 'RateRef <notifications@rateref.co>',
      to: creatorEmail,
      subject: 'Your rate card is live 🎉',
      headers: {
        'List-Unsubscribe': `<${unsubscribeUrl}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
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
          ${unsubscribeFooter}
        </div>
      `,
    })

    // Email 2 — day 3 — make your card stand out
    await resend.emails.send({
      from: 'RateRef <notifications@rateref.co>',
      to: creatorEmail,
      subject: 'Make your card stand out to brands',
      scheduledAt: day3,
      headers: {
        'List-Unsubscribe': `<${unsubscribeUrl}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; color: #111827;">
          <div style="margin-bottom: 24px;">
            <span style="background: #059669; color: white; font-weight: 700; font-size: 13px; padding: 4px 10px; border-radius: 6px;">RateRef</span>
          </div>
          <h1 style="font-size: 22px; font-weight: 700; margin-bottom: 8px;">A few quick wins for your card, ${creatorName}.</h1>
          <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">Creators with complete profiles get taken more seriously by brand managers. Here's what makes the biggest difference:</p>
          <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <div style="margin-bottom: 16px;">
              <p style="font-weight: 600; font-size: 14px; margin: 0 0 2px;">📸 Add a profile photo</p>
              <p style="color: #6b7280; font-size: 13px; margin: 0;">Brands want to see who they're working with.</p>
            </div>
            <div style="margin-bottom: 16px;">
              <p style="font-weight: 600; font-size: 14px; margin: 0 0 2px;">🏷️ Set your content niche</p>
              <p style="color: #6b7280; font-size: 13px; margin: 0;">Helps brands find the right fit — and improves your pricing.</p>
            </div>
            <div>
              <p style="font-weight: 600; font-size: 14px; margin: 0 0 2px;">🤝 List your past brand partnerships</p>
              <p style="color: #6b7280; font-size: 13px; margin: 0;">Social proof shown directly on your card.</p>
            </div>
          </div>
          <a href="https://rateref.co/dashboard" style="display: inline-block; background: #059669; color: white; font-weight: 600; font-size: 14px; padding: 12px 24px; border-radius: 8px; text-decoration: none;">Update your card →</a>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          ${unsubscribeFooter}
        </div>
      `,
    })

    // Email 3 — day 7 — share your link
    await resend.emails.send({
      from: 'RateRef <notifications@rateref.co>',
      to: creatorEmail,
      subject: 'One move that gets you brand deals faster',
      scheduledAt: day7,
      headers: {
        'List-Unsubscribe': `<${unsubscribeUrl}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; color: #111827;">
          <div style="margin-bottom: 24px;">
            <span style="background: #059669; color: white; font-weight: 700; font-size: 13px; padding: 4px 10px; border-radius: 6px;">RateRef</span>
          </div>
          <h1 style="font-size: 22px; font-weight: 700; margin-bottom: 8px;">The #1 thing creators miss, ${creatorName}.</h1>
          <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">Your rate card is live — but if it's not in your Instagram bio, brands can't find it. Most creators who start getting inbound requests do one thing differently: they put the link where brands actually look.</p>
          <div style="background: #ecfdf5; border: 1px solid #6ee7b7; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <p style="font-weight: 600; font-size: 14px; margin: 0 0 8px;">Add your RateRef link to:</p>
            <ul style="color: #6b7280; font-size: 13px; margin: 0; padding-left: 18px; line-height: 2;">
              <li>Your Instagram bio</li>
              <li>Your TikTok bio</li>
              <li>Your email signature</li>
              <li>Your Linktree or link-in-bio tool</li>
            </ul>
          </div>
          <a href="${cardUrl}" style="display: inline-block; background: #059669; color: white; font-weight: 600; font-size: 14px; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-bottom: 16px;">View your rate card →</a>
          <p style="color: #6b7280; font-size: 13px;">Your link: <a href="${cardUrl}" style="color: #059669;">${cardUrl}</a></p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          ${unsubscribeFooter}
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Welcome email error:', error)
    return NextResponse.json({ error: 'Failed to send welcome emails' }, { status: 500 })
  }
}
