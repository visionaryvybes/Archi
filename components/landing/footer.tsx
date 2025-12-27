'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Twitter, Github, Linkedin, Instagram, Youtube } from 'lucide-react';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerSections: FooterSection[] = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'API Docs', href: '/docs' },
      { label: 'Integrations', href: '/integrations' },
      { label: 'Changelog', href: '/changelog' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press Kit', href: '/press' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'GDPR', href: '/gdpr' },
    ],
  },
];

const socialLinks = [
  { icon: Twitter, href: 'https://twitter.com/visionarystudio', label: 'Twitter' },
  { icon: Github, href: 'https://github.com/visionarystudio', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com/company/visionarystudio', label: 'LinkedIn' },
  { icon: Instagram, href: 'https://instagram.com/visionarystudio', label: 'Instagram' },
  { icon: Youtube, href: 'https://youtube.com/@visionarystudio', label: 'YouTube' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/5 bg-black">
      {/* Subtle gradient at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 group mb-6">
              <motion.div
                className="relative w-10 h-10"
                whileHover={{ rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl group-hover:shadow-glow transition-shadow duration-300" />
                <div className="absolute inset-[2px] bg-black rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                </div>
              </motion.div>
              <span className="font-display font-bold text-xl text-white">
                Visionary Studio
              </span>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-xs mb-6">
              Transform your interior design workflow with AI-powered room visualization.
              Professional results in seconds, not hours.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-900 text-slate-500 hover:text-emerald-400 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/30 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link Sections */}
          {footerSections.map((section, sectionIndex) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-white mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: sectionIndex * 0.1 + linkIndex * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-emerald-400 transition-colors duration-200 inline-block"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-slate-800/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              {currentYear} Visionary Studio. All rights reserved.
            </p>

            <div className="flex items-center gap-6">
              {/* Status indicator */}
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <motion.span
                  className="w-2 h-2 rounded-full bg-emerald-500"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                All systems operational
              </div>

              {/* Language/Region (placeholder) */}
              <button className="text-sm text-slate-500 hover:text-white transition-colors">
                English (US)
              </button>
            </div>
          </div>
        </div>

        {/* Built with love message */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-xs text-slate-600">
            Built with care in San Francisco. Powered by Google Gemini.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}

export default Footer;
