'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Switch from '@radix-ui/react-switch';
import { Check, ArrowRight } from 'lucide-react';

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingTier {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  features: PricingFeature[];
  cta: string;
  highlighted?: boolean;
  badge?: string;
}

const tiers: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for trying out Visionary',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      { text: '5 generations per month', included: true },
      { text: 'Standard quality output', included: true },
      { text: '10 design styles', included: true },
      { text: 'Basic support', included: true },
      { text: 'Watermarked images', included: true },
      { text: 'API access', included: false },
      { text: 'Video walkthroughs', included: false },
      { text: '3D exploration', included: false },
    ],
    cta: 'Get Started Free',
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For professionals and growing teams',
    monthlyPrice: 29,
    yearlyPrice: 24,
    features: [
      { text: 'Unlimited generations', included: true },
      { text: '4K quality output', included: true },
      { text: '50+ design styles', included: true },
      { text: 'Priority support', included: true },
      { text: 'No watermarks', included: true },
      { text: 'API access', included: true },
      { text: 'Video walkthroughs', included: true },
      { text: '3D exploration', included: true },
    ],
    cta: 'Start Pro Trial',
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations',
    monthlyPrice: null,
    yearlyPrice: null,
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Custom model training', included: true },
      { text: 'Dedicated GPU clusters', included: true },
      { text: 'SLA guarantee', included: true },
      { text: 'SSO & SAML', included: true },
      { text: 'Custom integrations', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'On-premise deployment', included: true },
    ],
    cta: 'Contact Sales',
  },
];

function AnimatedCheckmark({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      className="w-5 h-5 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center flex-shrink-0"
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true }}
      transition={{
        delay,
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
    >
      <motion.div
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ delay: delay + 0.2, duration: 0.3 }}
      >
        <Check className="w-3 h-3 text-white" />
      </motion.div>
    </motion.div>
  );
}

function PricingCard({ tier, isYearly, index }: { tier: PricingTier; isYearly: boolean; index: number }) {
  const price = isYearly ? tier.yearlyPrice : tier.monthlyPrice;
  const savings = tier.monthlyPrice && tier.yearlyPrice
    ? Math.round((1 - tier.yearlyPrice / tier.monthlyPrice) * 100)
    : 0;

  return (
    <motion.div
      className={`relative flex flex-col rounded-2xl p-1 ${
        tier.highlighted
          ? 'bg-gradient-to-b from-emerald-500 via-cyan-500 to-blue-500'
          : ''
      }`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Badge */}
      {tier.badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <motion.div
            className="px-4 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-medium shadow-glow"
            initial={{ y: -10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {tier.badge}
          </motion.div>
        </div>
      )}

      <div
        className={`flex flex-col h-full rounded-xl p-6 lg:p-8 ${
          tier.highlighted ? 'bg-slate-900' : 'glass'
        }`}
      >
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-2">{tier.name}</h3>
          <p className="text-sm text-slate-400">{tier.description}</p>
        </div>

        {/* Price */}
        <div className="mb-6">
          {price !== null ? (
            <div className="flex items-baseline gap-1">
              <span className="text-4xl lg:text-5xl font-bold text-white">${price}</span>
              <span className="text-slate-400">/mo</span>
            </div>
          ) : (
            <div className="text-4xl lg:text-5xl font-bold text-white">Custom</div>
          )}
          {isYearly && tier.monthlyPrice && tier.yearlyPrice && (
            <motion.p
              className="text-sm text-emerald-400 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Save {savings}% with yearly billing
            </motion.p>
          )}
        </div>

        {/* CTA */}
        <motion.button
          className={`w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 group mb-8 ${
            tier.highlighted
              ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-glow'
              : 'btn-gradient-border text-white'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {tier.cta}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </motion.button>

        {/* Features */}
        <ul className="space-y-4 flex-1">
          {tier.features.map((feature, i) => (
            <li key={feature.text} className="flex items-start gap-3">
              {feature.included ? (
                <AnimatedCheckmark delay={0.1 + i * 0.05} />
              ) : (
                <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-0.5 bg-slate-600 rounded" />
                </div>
              )}
              <span
                className={`text-sm ${
                  feature.included ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden" id="pricing">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-950 to-black" />
      <div className="absolute inset-0 bg-mesh-gradient opacity-30" />

      <div className="relative max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Simple, Transparent{' '}
            <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
            Start free and scale as you grow. No hidden fees, no surprises.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-4 p-1.5 rounded-full bg-slate-800/50 border border-slate-700/50">
            <span
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                !isYearly ? 'text-white' : 'text-slate-400'
              }`}
            >
              Monthly
            </span>
            <Switch.Root
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="relative w-12 h-6 bg-slate-700 rounded-full transition-colors data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-emerald-500 data-[state=checked]:to-cyan-500"
            >
              <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-lg transition-transform duration-300 translate-x-0.5 data-[state=checked]:translate-x-6" />
            </Switch.Root>
            <span
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                isYearly ? 'text-white' : 'text-slate-400'
              }`}
            >
              Yearly
              <span className="ml-1.5 px-2 py-0.5 text-xs rounded-full bg-emerald-500/20 text-emerald-400">
                Save 17%
              </span>
            </span>
          </div>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {tiers.map((tier, index) => (
            <PricingCard
              key={tier.id}
              tier={tier}
              isYearly={isYearly}
              index={index}
            />
          ))}
        </div>

        {/* Money-back guarantee */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-slate-400 text-sm">
            All paid plans come with a{' '}
            <span className="text-emerald-400">30-day money-back guarantee</span>.
            No questions asked.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default Pricing;
