import { Navigation } from '@/components/landing/navigation'
import { Hero } from '@/components/landing/hero'
import { GeminiShowcase } from '@/components/landing/gemini-showcase'
import { ModesShowcase } from '@/components/landing/modes-showcase'
import { Pricing } from '@/components/landing/pricing'
import { FAQ } from '@/components/landing/faq'
import { Footer } from '@/components/landing/footer'

export default function Home() {
  return (
    <main className="relative bg-[#09090b] min-h-screen">
      <Navigation />
      <Hero />
      <GeminiShowcase />
      <ModesShowcase />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  )
}
