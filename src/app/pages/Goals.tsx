import { PageHeader } from '../components/PageHeader'
import { GoalCard } from '../components/goals/GoalCard'
import { useProfile } from '../context/ProfileContext'

export function Goals() {
  const { model } = useProfile()

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Goals"
        title="What you're working toward"
        subtitle="Based on what you told Sparly during onboarding. Adjust any goal's monthly contribution to see how it changes your timeline."
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {model.goals.map((g, i) => (
          <GoalCard key={g.id} goal={g} delay={i * 0.1} />
        ))}
      </div>
    </div>
  )
}
