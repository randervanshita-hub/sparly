import { PageHeader } from '../components/PageHeader'

const FAQS = [
  { q: 'Is Sparly financial advice?', a: 'No. Sparly is a planning tool that helps you organize and understand your own money. It is not a registered investment advisor.' },
  { q: 'Does Sparly move my money?', a: 'No. Sparly never executes trades, transfers, investments or loan payments automatically — every action requires your explicit confirmation.' },
  { q: 'How is my data protected?', a: 'Your data is encrypted in transit and at rest, and is never sold.' },
  { q: 'Can I change my plan?', a: 'Yes — redo onboarding any time from Settings, or adjust individual goals and categories directly.' },
]

export function Help() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader eyebrow="Help" title="Questions about Sparly" />
      <div className="flex flex-col gap-3">
        {FAQS.map((f) => (
          <div key={f.q} className="rounded-2xl border border-hairline bg-card p-5">
            <p className="mb-2 text-sm font-medium text-cream">{f.q}</p>
            <p className="text-sm leading-relaxed text-muted">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
