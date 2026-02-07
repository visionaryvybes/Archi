import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://visionary-studio.vercel.app'),
  title: 'Visionary Studio — AI Interior Design',
  description: 'Transform any room with AI. Upload a photo, choose a style, get a photorealistic render in seconds.',
  keywords: ['interior design', 'AI', 'room design', 'architecture', 'visualization'],
  authors: [{ name: 'Visionary Studio' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://visionary-studio.vercel.app',
    siteName: 'Visionary Studio',
    title: 'Visionary Studio — AI Interior Design',
    description: 'Transform any room with AI. Upload a photo, choose a style, get a photorealistic render in seconds.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Visionary Studio — AI Interior Design',
    description: 'Transform any room with AI in seconds.',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#09090b',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable} dark`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-[#09090b] text-zinc-50 min-h-screen">
        {children}
      </body>
    </html>
  )
}
