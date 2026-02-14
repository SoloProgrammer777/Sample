import type { Metadata, Viewport } from 'next'
import { Dancing_Script, Inter } from 'next/font/google'

import './globals.css'

const _inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const _dancing = Dancing_Script({ subsets: ['latin'], variable: '--font-dancing' })

export const metadata: Metadata = {
  title: 'A Surprise For You',
  description: 'Something special awaits...',
}

export const viewport: Viewport = {
  themeColor: '#fce4ec',
  width: 'device-width',
  initialScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${_inter.variable} ${_dancing.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
