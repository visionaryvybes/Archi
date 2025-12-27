import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Studio | Visionary Studio',
  description: 'Create stunning interior designs with AI-powered rendering',
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen w-screen overflow-hidden bg-black">
      {children}
    </div>
  )
}
