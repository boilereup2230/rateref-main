import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title:       'RateRef',
  description: 'Dynamic rate cards for creators',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
