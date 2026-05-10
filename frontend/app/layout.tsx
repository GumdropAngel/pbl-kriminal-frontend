import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

/* ── Font loading via next/font (zero layout shift, self-hosted) ── */
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SIPEDULI — Sistem Pelaporan Kejahatan Terpadu',
  description:
    'Platform pelaporan kejahatan resmi yang terhubung langsung dengan aparat berwenang. Setiap laporan dianalisis dan diprioritaskan secara otomatis.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${inter.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  )
}
