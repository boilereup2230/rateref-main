import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { creatorEmail, creatorName, brandName, contactEmail, message, total } = await req.json()

    await resend.emails.send({
      from: 'RateRef <notifications@rateref.co>',
      to: creatorEmail,
      subject: `New booking inquiry from ${brandName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #111;">You have a new booking inquiry</h2>
          <p>Hi ${creatorName},</p>
          <p><strong>${brandName}</strong> has submitted a booking request through your RateRef rate card.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Brand</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${brandName}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Contact Email</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${contactEmail}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Quote Total</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${total}</td></tr>
            <tr><td style="padding: 8px;"><strong>Message</strong></td><td style="padding: 8px;">${message || 'No message provided'}</td></tr>
          </table>
          <a href="https://rateref.co/dashboard" style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View in Dashboard</a>
          <p style="margin-top: 24px; color: #666; font-size: 14px;">— The RateRef Team</p>
        </div>
      `
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
