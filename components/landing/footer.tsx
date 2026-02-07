import Link from 'next/link'

const links = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Studio', href: '/studio' },
    { label: 'API', href: '/docs' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
  ],
  Legal: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-zinc-800/50 py-16">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-zinc-50 font-semibold text-lg tracking-tight">
              Visionary Studio
            </Link>
            <p className="mt-3 text-sm text-zinc-500 leading-relaxed max-w-xs">
              AI-powered interior design for professionals.
            </p>
          </div>
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h3 className="text-sm font-medium text-zinc-400 mb-3">{section}</h3>
              <ul className="space-y-2">
                {items.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-zinc-800/50 text-sm text-zinc-600">
          © {new Date().getFullYear()} Visionary Studio
        </div>
      </div>
    </footer>
  )
}

export default Footer
