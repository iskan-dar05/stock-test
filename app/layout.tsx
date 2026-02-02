import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'StocksOcean - Premium Digital Assets Marketplace',
  description: 'Discover and sell premium digital assets. High-quality images, videos, and 3D objects for your creative projects.',
  icons: {
    icon: '/favicon.ico',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased dark" suppressHydrationWarning>{children}</body>
    </html>
  )
}

