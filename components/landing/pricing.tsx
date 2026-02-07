'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const tiers = [
  {
    name: 'Free',
    description: 'For exploring',
    monthly: 0,
    yearly: 0,
    features: ['5 renders per month', 'Standard resolution', '15 design styles', 'Watermarked output'],
    cta: 'Get started',
    href: '/studio',
  },
  {
    name: 'Pro',
    description: 'For professionals',
    monthly: 29,
    yearly: 24,
    features: ['Unlimited renders', '4K resolution', '55+ styles', 'Conversational editing', 'No watermark', 'API access'],
    cta: 'Start free trial',
    href: '/studio',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    description: 'For teams',
    monthly: null,
    yearly: null,
    features: ['Everything in Pro', 'Custom model training', 'SSO & SAML', 'SLA guarantee', 'Dedicated support', 'On-premise option'],
    cta: 'Contact us',
    href: '/contact',
  },
]

export function Pricing() {
  const [yearly, setYearly] = useState(false)

  return (
    <section className="py-24 md:py-32 border-t border-zinc-800/50" id="pricing">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <p className="text-sm font-medium text-violet-400 mb-3">Pricing</p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-50 mb-4">
            Start free. Upgrade when ready.
          </h2>

          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={() => setYearly(false)}
              className={`text-sm px-3 py-1.5 rounded-md transition-colors ${!yearly ? 'bg-zinc-800 text-zinc-50' : 'text-zinc-500 hover:text-zinc-400'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`text-sm px-3 py-1.5 rounded-md transition-colors ${yearly ? 'bg-zinc-800 text-zinc-50' : 'text-zinc-500 hover:text-zinc-400'}`}
            >
              Yearly <span className="text-violet-400 ml-1">-17%</span>
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-800/50 rounded-xl overflow-hidden border border-zinc-800">
          {tiers.map((tier, index) => {
            const price = yearly ? tier.yearly : tier.monthly
            return (
              <motion.div
                key={tier.name}
                className={`bg-[#09090b] p-8 flex flex-col ${tier.highlighted ? 'bg-zinc-900/30' : ''}`}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
              >
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-medium text-zinc-50">{tier.name}</h3>
                    {tier.highlighted && (
                      <span className="text-xs font-medium text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded">Popular</span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-500">{tier.description}</p>
                </div>

                <div className="mb-6">
                  {price !== null ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-semibold text-zinc-50">${price}</span>
                      <span className="text-sm text-zinc-500">/mo</span>
                    </div>
                  ) : (
                    <span className="text-4xl font-semibold text-zinc-50">Custom</span>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-400">
                      <svg className="w-4 h-4 mt-0.5 text-zinc-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={tier.href}
                  className={`block text-center text-sm font-medium px-4 py-2.5 rounded-lg transition-colors duration-150 ${
                    tier.highlighted
                      ? 'bg-zinc-50 text-zinc-950 hover:bg-white'
                      : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
                  }`}
                >
                  {tier.cta}
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Pricing
