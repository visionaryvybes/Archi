'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const navItems = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
          isScrolled ? 'bg-[#09090b]/80 backdrop-blur-md border-b border-zinc-800/50' : 'bg-transparent'
        }`}
      >
        <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-zinc-50 font-semibold text-lg tracking-tight">
            Visionary Studio
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors duration-150"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors duration-150 px-3 py-1.5"
            >
              Sign in
            </Link>
            <Link
              href="/studio"
              className="text-sm font-medium text-zinc-950 bg-zinc-50 hover:bg-white px-4 py-2 rounded-lg transition-colors duration-150"
            >
              Open Studio
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-zinc-400 hover:text-zinc-50 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-x-0 top-16 z-40 md:hidden bg-[#09090b]/95 backdrop-blur-md border-b border-zinc-800/50"
          >
            <nav className="flex flex-col px-6 py-4 gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="py-3 text-zinc-300 hover:text-zinc-50 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-3 mt-2 border-t border-zinc-800 flex flex-col gap-2">
                <Link href="/login" className="py-2 text-zinc-400 hover:text-zinc-50 transition-colors">
                  Sign in
                </Link>
                <Link
                  href="/studio"
                  className="text-center font-medium text-zinc-950 bg-zinc-50 hover:bg-white px-4 py-2.5 rounded-lg transition-colors"
                >
                  Open Studio
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navigation
