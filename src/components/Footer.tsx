import { Logo } from './Logo'

const COLUMNS = [
  {
    title: 'Product',
    links: ['How it works', 'Features', 'Plans', 'FAQ'],
  },
  {
    title: 'Company',
    links: ['About', 'Careers', 'Contact'],
  },
  {
    title: 'Legal',
    links: ['Privacy', 'Terms', 'Security'],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-hairline py-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted">
              Sparly turns your salary into a clear, monthly money plan — what to spend, save, invest, and keep as a
              buffer.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title} className="flex flex-col gap-3.5">
              <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted">{col.title}</p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#top" className="text-sm text-cream/80 transition-colors hover:text-cream">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-hairline pt-8 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Sparly. All rights reserved.</p>
          <p className="max-w-md sm:text-right">
            Sparly is a planning tool, not a registered investment advisor. Nothing here is personalized financial
            advice.
          </p>
        </div>
      </div>
    </footer>
  )
}
