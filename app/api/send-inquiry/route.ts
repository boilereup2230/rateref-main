import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { creatorEmail, creatorName, brandName, contactEmail, message, total } = await req.json()

    // Creator notification
    await resend.emails.send({
      from: 'RateRef <notifications@rateref.co>',
      to: creatorEmail,
      replyTo: contactEmail,
      subject: `${brandName} wants to book you`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; color: #111;">
          <p style="font-size: 18px; font-weight: 600; margin-bottom: 4px;">New booking request</p>
          <p style="color: #666; margin-top: 0;">via your RateRef rate card</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p>Hi ${creatorName},</p>
          <p><strong>${brandName}</strong> submitted a booking request through your rate card.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 14px;">
            <tr><td style="padding: 10px 8px; border-bottom: 1px solid #f3f4f6; color: #666; width: 140px;">Brand</td><td style="padding: 10px 8px; border-bottom: 1px solid #f3f4f6; font-weight: 500;">${brandName}</td></tr>
            <tr><td style="padding: 10px 8px; border-bottom: 1px solid #f3f4f6; color: #666;">Contact</td><td style="padding: 10px 8px; border-bottom: 1px solid #f3f4f6;">${contactEmail}</td></tr>
            <tr><td style="padding: 10px 8px; border-bottom: 1px solid #f3f4f6; color: #666;">Quote total</td><td style="padding: 10px 8px; border-bottom: 1px solid #f3f4f6; font-weight: 600; color: #16a34a;">${total}</td></tr>
            <tr><td style="padding: 10px 8px; color: #666; vertical-align: top;">Message</td><td style="padding: 10px 8px;">${message || 'No message provided'}</td></tr>
          </table>
          <a href="https://rateref.co/dashboard" style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 500; font-size: 14px;">View in Dashboard →</a>
          <p style="margin-top: 32px; color: #999; font-size: 13px;">You received this because a brand submitted a request through your RateRef rate card at rateref.co/c/${creatorName.toLowerCase().replace(/\s+/g, '')}. Reply directly to this email to contact ${brandName}.</p>
        </div>
      `
    })

    // Brand confirmation
    await resend.emails.send({
      from: 'RateRef <notifications@rateref.co>',
      to: contactEmail,
      subject: `Your request to ${creatorName} is on its way`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; color: #111;">
          <p style="font-size: 18px; font-weight: 600; margin-bottom: 4px;">Request sent</p>
          <p style="color: #666; margin-top: 0;">via RateRef</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p>Hi ${brandName},</p>
          <p>Your booking request to <strong>${creatorName}</strong> was sent successfully. Expect to hear back within 48 hours.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 14px;">
            <tr><td style="padding: 10px 8px; border-bottom: 1px solid #f3f4f6; color: #666; width: 140px;">Creator</td><td style="padding: 10px 8px; border-bottom: 1px solid #f3f4f6; font-weight: 500;">${creatorName}</td></tr>
            <tr><td style="padding: 10px 8px; border-bottom: 1px solid #f3f4f6; color: #666;">Quote total</td><td style="padding: 10px 8px; border-bottom: 1px solid #f3f4f6; font-weight: 600; color: #16a34a;">${total}</td></tr>
            <tr><td style="padding: 10px 8px; color: #666; vertical-align: top;">Your message</td><td style="padding: 10px 8px;">${message || 'No message provided'}</td></tr>
          </table>
          <p style="margin-top: 32px; color: #999; font-size: 13px;">Powered by <a href="https://rateref.co" style="color: #16a34a; text-decoration: none;">RateRef</a> — the live rate card for creators who do brand deals.</p>
        </div>
      `
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
