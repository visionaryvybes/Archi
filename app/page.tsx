import dynamic from 'next/dynamic'
import { Navigation } from '@/components/landing/navigation'

// Dynamic imports for better code splitting
const Hero = dynamic(() => import('@/components/landing/hero'), {
  loading: () => <div className="h-screen bg-black" />,
})

const TrustBar = dynamic(() => import('@/components/landing/trust-bar'), {
  loading: () => <div className="h-32 bg-black" />,
})

const ProblemSolution = dynamic(() => import('@/components/landing/problem-solution'), {
  loading: () => <div className="h-96 bg-black" />,
})

const GeminiShowcase = dynamic(() => import('@/components/landing/gemini-showcase'), {
  loading: () => <div className="h-96 bg-black" />,
})

const ModesShowcase = dynamic(() => import('@/components/landing/modes-showcase'), {
  loading: () => <div className="h-96 bg-black" />,
})

const DemoSection = dynamic(() => import('@/components/landing/demo-section'), {
  loading: () => <div className="h-96 bg-black" />,
})

const FeatureGrid = dynamic(() => import('@/components/landing/feature-grid'), {
  loading: () => <div className="h-96 bg-black" />,
})

const Pricing = dynamic(() => import('@/components/landing/pricing'), {
  loading: () => <div className="h-96 bg-black" />,
})

const FAQ = dynamic(() => import('@/components/landing/faq'), {
  loading: () => <div className="h-64 bg-black" />,
})

const FinalCTA = dynamic(() => import('@/components/landing/final-cta'), {
  loading: () => <div className="h-64 bg-black" />,
})

const Footer = dynamic(() => import('@/components/landing/footer'), {
  loading: () => <div className="h-48 bg-black" />,
})

export default function Home() {
  return (
    <main className="relative bg-black min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <Hero />

      {/* Trust Bar */}
      <TrustBar />

      {/* Problem/Solution */}
      <ProblemSolution />

      {/* Gemini Showcase */}
      <section id="features">
        <GeminiShowcase />
      </section>

      {/* Three Modes */}
      <ModesShowcase />

      {/* Live Demo */}
      <DemoSection />

      {/* Feature Grid */}
      <section id="api">
        <FeatureGrid />
      </section>

      {/* Pricing */}
      <section id="pricing">
        <Pricing />
      </section>

      {/* FAQ */}
      <section id="faq">
        <FAQ />
      </section>

      {/* Final CTA */}
      <FinalCTA />

      {/* Footer */}
      <Footer />
    </main>
  )
}
