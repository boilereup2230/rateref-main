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
      </body>
    </html>
  )
}
