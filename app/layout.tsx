import type { Metadata, Viewport } from 'next'
import { DM_Sans, Outfit, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://visionary-studio.vercel.app'),
  title: 'Visionary Studio | AI Interior Design Platform',
  description: 'Professional interior renders in 30 seconds. The only AI design tool using Google Gemini 2.0. Instant, photorealistic results.',
  keywords: ['interior design', 'AI', 'render', 'architecture', 'Gemini', 'design tool'],
  authors: [{ name: 'Visionary Studio' }],
  creator: 'Visionary Studio',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://visionary-studio.vercel.app',
    siteName: 'Visionary Studio',
    title: 'Visionary Studio | AI Interior Design Platform',
    description: 'Professional interior renders in 30 seconds. Powered by Google Gemini 2.0.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Visionary Studio - AI Interior Design',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Visionary Studio | AI Interior Design Platform',
    description: 'Professional interior renders in 30 seconds. Powered by Google Gemini 2.0.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${outfit.variable} ${jetbrainsMono.variable} dark`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased bg-black text-white min-h-screen">
        {children}
      </body>
    </html>
  )
}
