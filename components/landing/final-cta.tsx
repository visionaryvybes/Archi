'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, AlertCircle, Loader2 } from 'lucide-react';

function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function FinalCTA() {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value.length > 0) {
      setIsValid(validateEmail(value));
    } else {
      setIsValid(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-cyan-900/20 to-blue-900/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />

      {/* Grain texture overlay */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, -50, 0],
          y: [0, 30, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="relative max-w-3xl mx-auto text-center">
        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-emerald-500"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm text-white/80">No credit card required</span>
          </motion.div>

          {/* Headline */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Start designing in{' '}
            <span className="gradient-text">2 minutes</span>
          </h2>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-xl mx-auto">
            Start transforming spaces with AI-powered interior design.
          </p>

          {/* Email capture form */}
          {!isSubmitted ? (
            <motion.form
              onSubmit={handleSubmit}
              className="relative max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email"
                  className={`w-full px-6 py-4 pr-36 rounded-2xl bg-white/10 backdrop-blur-sm border text-white placeholder-slate-400 focus:outline-none transition-colors ${
                    isValid === false
                      ? 'border-red-500/50 focus:border-red-500'
                      : isValid === true
                      ? 'border-emerald-500/50 focus:border-emerald-500'
                      : 'border-white/10 focus:border-emerald-500/50'
                  }`}
                />

                {/* Validation icon */}
                {isValid !== null && (
                  <motion.div
                    className="absolute right-32 top-1/2 -translate-y-1/2"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    {isValid ? (
                      <Check className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    )}
                  </motion.div>
                )}

                {/* Submit button */}
                <motion.button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  whileHover={{ scale: isValid ? 1.02 : 1 }}
                  whileTap={{ scale: isValid ? 0.98 : 1 }}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Get Started
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </div>

              {/* Error message */}
              {isValid === false && email.length > 0 && (
                <motion.p
                  className="absolute mt-2 text-sm text-red-400 text-left"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Please enter a valid email address
                </motion.p>
              )}
            </motion.form>
          ) : (
            <motion.div
              className="max-w-md mx-auto p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">You&apos;re in!</h3>
              </div>
              <p className="text-slate-300">
                Check your email for the next steps. We can&apos;t wait to see what you create.
              </p>
            </motion.div>
          )}

          {/* Trust indicators */}
          <motion.div
            className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            {['Free to start', 'No credit card required', 'Cancel anytime'].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{item}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default FinalCTA;
