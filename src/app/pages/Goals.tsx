import { PageHeader } from '../components/PageHeader'
import { GoalCard } from '../components/goals/GoalCard'
import { demoGoals } from '../../lib/demoData'

export function Goals() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Goals"
        title="What you're working toward"
        subtitle="Adjust your monthly contribution on any goal to see how it changes your timeline."
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {demoGoals.map((g, i) => (
          <GoalCard key={g.id} goal={g} delay={i * 0.1} />
        ))}
      </div>
    </div>
  )
}
