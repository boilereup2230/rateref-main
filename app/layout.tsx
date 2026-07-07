import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'
export const metadata: Metadata = {
  title:       'RateRef',
  description: 'Dynamic rate cards for creators',
  verification: {
    google: 'judsTlchmc13VJExldFVGEuXYtEAcrOeYNcdnMCQ_RI',
  },
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
        <footer style={{
          borderTop: '1px solid #e5e7eb',
          padding: '16px 24px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#9ca3af',
          fontFamily: 'system-ui, sans-serif',
        }}>
          © {new Date().getFullYear()} RateRef LLC · 
          <a href="https://app.termly.io/document/privacy-policy/5a3ff5e4-3918-4232-aee3-fc86409a75b7"
            target="_blank" rel="noopener noreferrer"
            style={{ color: '#6b7280', marginLeft: '8px', textDecoration: 'none' }}>
            Privacy Policy
          </a>
          <span style={{ margin: '0 8px' }}>·</span>
          <a href="https://app.termly.io/document/terms-of-service/5a3ff5e4-3918-4232-aee3-fc86409a75b7"
            target="_blank" rel="noopener noreferrer"
            style={{ color: '#6b7280', textDecoration: 'none' }}>
            Terms & Conditions
          </a>
          <span style={{ margin: '0 8px' }}>·</span>
          <a href="/cookie-policy"
            style={{ color: '#6b7280', textDecoration: 'none' }}>
            Cookie Policy
          </a>
        </footer>
      </body>
    </html>
  )
}
