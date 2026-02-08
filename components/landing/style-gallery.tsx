'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const featuredStyles = [
  { name: 'Coastal', image: '/images/landing/style-coastal.jpg' },
  { name: 'Art Deco', image: '/images/landing/style-artdeco.jpg' },
  { name: 'Mid-Century Modern', image: '/images/landing/style-midcentury.jpg' },
  { name: 'Bohemian', image: '/images/landing/style-bohemian.jpg' },
  { name: 'Luxury', image: '/images/landing/style-luxury.jpg' },
  { name: 'Rustic', image: '/images/landing/style-rustic.jpg' },
]

const styleCategories = [
  {
    name: 'Modern',
    styles: [
      { name: 'Modern Minimalist', image: '/images/landing/style-modern.jpg' },
      { name: 'Contemporary', image: '/images/landing/style-contemporary.jpg' },
      { name: 'Urban Loft', image: '/images/landing/style-urban-loft.jpg' },
    ],
  },
  {
    name: 'Natural',
    styles: [
      { name: 'Scandinavian', image: '/images/landing/style-scandinavian.jpg' },
      { name: 'Japandi', image: '/images/landing/style-japandi.jpg' },
    ],
  },
  {
    name: 'Classic',
    styles: [
      { name: 'Victorian', image: '/images/landing/style-victorian.jpg' },
      { name: 'French Country', image: '/images/landing/style-french-country.jpg' },
      { name: 'Mediterranean', image: '/images/landing/style-mediterranean.jpg' },
    ],
  },
  {
    name: 'Bold',
    styles: [
      { name: 'Industrial', image: '/images/landing/style-industrial.jpg' },
      { name: 'Maximalist', image: '/images/landing/style-maximalist.jpg' },
      { name: 'Tropical', image: '/images/landing/style-tropical.jpg' },
    ],
  },
]

export function StyleGallery() {
  return (
    <section className="py-20 md:py-28 border-t border-zinc-800/50">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div>
            <p className="text-sm font-medium text-violet-400 mb-3">55+ styles</p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-50 mb-2">
              Every style you can imagine
            </h2>
            <p className="text-zinc-400 max-w-xl">
              From Scandinavian simplicity to Art Deco grandeur. Apply any style to
              any room with a single click.
            </p>
          </div>
          <Link
            href="/studio"
            className="inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors whitespace-nowrap"
          >
            Browse all styles
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        {/* Featured styles grid */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredStyles.map((style, index) => (
              <motion.div
                key={style.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
              >
                <Link
                  href="/studio"
                  className="group relative aspect-[3/2] rounded-xl overflow-hidden border border-zinc-800 hover:border-violet-400/50 transition-all duration-200 block"
                >
                  <Image
                    src={style.image}
                    alt={style.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />

                  {/* Dark gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                  {/* Style name overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-sm font-semibold text-white group-hover:text-violet-400 transition-colors">
                      {style.name}
                    </p>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-violet-500/0 group-hover:bg-violet-500/10 transition-colors duration-200" />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Additional styles grid */}
        <div className="space-y-6">
          {styleCategories.map((category, catIndex) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 + catIndex * 0.05, ease: 'easeOut' }}
            >
              <p className="text-xs font-medium text-zinc-600 uppercase tracking-wider mb-3">{category.name}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {category.styles.map((style) => (
                  <Link
                    key={style.name}
                    href="/studio"
                    className="group relative aspect-[3/2] rounded-xl overflow-hidden border border-zinc-800 hover:border-violet-500/30 transition-all duration-200"
                  >
                    <Image
                      src={style.image}
                      alt={style.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                        {style.name}
                      </p>
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-violet-500/0 group-hover:bg-violet-500/5 transition-colors duration-200" />
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Plus more indicator */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <p className="text-sm text-zinc-500">
            + 39 more styles including Wabi-Sabi, Biophilic, Memphis, Brutalist, Cottagecore, and more
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default StyleGallery
