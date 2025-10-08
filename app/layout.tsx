import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ClientLayout from '@/components/ClientLayout'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Wikident - Videotéka',
  description: 'Modul správy videí pro Wikident',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="cs">
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}