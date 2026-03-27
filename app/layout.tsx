import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Cursor from '@/components/Cursor'
import AudioPlayer from '@/components/AudioPlayer'

export const metadata: Metadata = {
  title: 'UniFLOWs Label',
  description: 'UniFLOWs Label — An independent Hybrid music label from Saigon, Vietnam. Building artists, creating culture.',
  openGraph: {
    title: 'UniFLOWs Label',
    description: 'UniFLOWs Label — An independent Hybrid music label from Saigon, Vietnam. Building artists, creating culture.',
    url: 'https://uniflowslabel.com',
    siteName: 'UniFLOWs Label',
    images: [{ url: 'https://uniflowslabel.com/images/og-cover.jpg' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UniFLOWs Label',
    description: 'An independent Hybrid music label from Saigon, Vietnam.',
    images: ['https://uniflowslabel.com/images/og-cover.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <Cursor />
        <Nav />
        <main>{children}</main>
        <Footer />
        <AudioPlayer />
      </body>
    </html>
  )
}
