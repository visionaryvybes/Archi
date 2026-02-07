import { Navigation } from '@/components/landing/navigation'
import { Hero } from '@/components/landing/hero'
import { Showcase } from '@/components/landing/showcase'
import { GeminiShowcase } from '@/components/landing/gemini-showcase'
import { ModesShowcase } from '@/components/landing/modes-showcase'
import { StyleGallery } from '@/components/landing/style-gallery'
import { Pricing } from '@/components/landing/pricing'
import { FAQ } from '@/components/landing/faq'
import { FinalCTA } from '@/components/landing/final-cta'
import { Footer } from '@/components/landing/footer'

export default function Home() {
  return (
    <main className="relative bg-[#09090b] min-h-screen">
      <Navigation />
      <Hero />
      <Showcase />
      <GeminiShowcase />
      <ModesShowcase />
      <StyleGallery />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  )
}
