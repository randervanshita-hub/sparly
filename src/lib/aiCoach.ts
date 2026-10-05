// Templated "AI" interpretation layer. Every number here comes from a
// FinancialModel built in userModel.ts/financeEngine.ts — this file only
// explains, summarizes and recommends. In production, this is where a real
// LLM call would slot in, fed the same computed facts (never raw access to
// invent numbers).
import { projectGoalCompletion, runScenario, type ScenarioInput } from './financeEngine'
import type { FinancialModel } from './userModel'
import type { Goal, Insight } from './types'
import { formatINR } from '../hooks/useCountUp'

export function getMonthlyRecommendation(model: FinancialModel): { headline: string; body: string } {
  const savings = model.moneyPlan.find((p) => p.key === 'savings')!
  const investments = model.moneyPlan.find((p) => p.key === 'investments')!
  const primaryGoal = model.goals[0]

  return {
    headline: "Here's your plan for this cycle.",
    body: `You have approximately ₹${formatINR(model.safeToSpend.amount)} to spend freely while staying on track. I'd recommend putting ₹${formatINR(savings.amount)} toward${primaryGoal ? ` ${primaryGoal.name.toLowerCase()}` : ' savings'} and ₹${formatINR(investments.amount)} toward investments before increasing discretionary spending.`,
  }
}

export function getSafeToSpendExplanation(model: FinancialModel): string {
  const s = model.safeToSpend
  return `Your plan sets aside ₹${formatINR(s.upcomingCommitments)} for essentials and debt, ₹${formatINR(s.goalContribution)} for savings and investments, and a ₹${formatINR(s.recommendedBuffer)} buffer — what's left, ₹${formatINR(s.amount)}, is your lifestyle allowance for the next ${s.daysToSalary} days. Sparly doesn't track your transactions automatically yet, so this is your full allowance for the cycle, not allowance-minus-what-you've-spent.`
}

export function getCategoryExplanation(model: FinancialModel, key: string): string {
  const category = model.moneyPlan.find((c) => c.key === key)
  if (!category) return ''
  switch (key) {
    case 'essentials':
      return `Rent, EMIs, bills and other fixed costs you told Sparly about — ₹${formatINR(category.amount)} that happens every cycle regardless of your choices.`
    case 'savings':
      return `Money set aside toward your goals — ₹${formatINR(category.amount)} this cycle, split across ${model.goals.length} goal${model.goals.length === 1 ? '' : 's'}.`
    case 'investments':
      return `Your recommended recurring investment contribution — ₹${formatINR(category.amount)} this cycle, based on a balanced allocation.`
    case 'lifestyle':
      return `Your discretionary allowance for everything else — food, shopping, entertainment — ₹${formatINR(category.amount)} this cycle.`
    case 'buffer':
      return `Money not yet committed to anything — after essentials, savings and investments are set aside, ₹${formatINR(category.amount)} is left as flexibility for the unexpected.`
    default:
      return `${category.label} is ₹${formatINR(category.amount)} this cycle.`
  }
}

export function getGoalExplanation(goal: Goal, today: Date, newContribution?: number): string {
  const current = projectGoalCompletion(goal, today)
  if (!newContribution || newContribution === goal.monthlyContribution) {
    return `At ₹${formatINR(goal.monthlyContribution)}/month, you're projected to reach your ${goal.name.toLowerCase()} goal by ${current}.`
  }
  const updated = projectGoalCompletion(goal, today, newContribution)
  return `At ₹${formatINR(goal.monthlyContribution)}/month you'd reach your ${goal.name.toLowerCase()} goal by ${current}. Increasing your monthly contribution to ₹${formatINR(newContribution)} would bring it forward to ${updated}.`
}

export function getHealthComponentExplanation(model: FinancialModel, key: string): string {
  const component = model.health.components.find((c) => c.key === key)
  if (!component) return ''
  return `${component.explanation} Your score could increase by approximately 5 points if you maintain this trend for another 3 months.`
}

export function explainWhy(model: FinancialModel, topic: string): string {
  switch (topic) {
    case 'safe-to-spend':
      return getSafeToSpendExplanation(model)
    case 'savings-rate':
      return `You're putting ${model.savingsRate}% of your income toward savings and investments combined. That's calculated from your actual plan, not an estimate — it updates the moment your income or expenses change.`
    case 'health-score':
      return `Your score is ${model.health.score}/100 (${model.health.label}) — an average of five components: emergency fund progress, savings rate, debt management, goal progress and expense coverage. It's a Sparly planning metric, not a credit score.`
    default:
      return "I don't have enough context to explain that yet — try asking from the screen where you saw it."
  }
}

interface CoachResponse {
  content: string
  quickReplies?: string[]
}

export function answerCoachPrompt(model: FinancialModel, prompt: string): CoachResponse {
  const p = prompt.toLowerCase()
  const safe = model.safeToSpend
  const buffer = model.moneyPlan.find((c) => c.key === 'buffer')?.amount ?? 0
  const primaryGoal = model.goals[0]

  if (p.includes('vacation') || p.includes('afford a') || (p.includes('afford') && p.includes('₹'))) {
    const amountMatch = prompt.match(/₹\s?([\d,]+)/)
    const amount = amountMatch ? Number(amountMatch[1].replace(/,/g, '')) : 20000
    const wouldDip = amount > safe.amount
    return {
      content: wouldDip
        ? `It would stretch your plan. You have ₹${formatINR(safe.amount)} of lifestyle allowance this cycle, with ₹${formatINR(safe.goalContribution)} already earmarked for your goals. Spending ₹${formatINR(amount)} now would mean dipping into your buffer. Want me to show you what happens if you wait until next cycle instead?`
        : `Yes, comfortably. After your essentials and goal contributions, you'd still have ₹${formatINR(safe.amount - amount)} of lifestyle allowance left this cycle.`,
      quickReplies: ['Show me', 'Ask another question'],
    }
  }

  if (p.includes('spend more') || p.includes('why did i spend')) {
    return {
      content: "I don't have your transaction history yet, so I can't compare month to month. Once Sparly can see your actual spending, I'll be able to spot changes like this automatically.",
      quickReplies: ['Ask another question'],
    }
  }

  if (p.includes('save from my next salary') || p.includes('how much should i save')) {
    const savings = model.moneyPlan.find((c) => c.key === 'savings')!
    const investments = model.moneyPlan.find((c) => c.key === 'investments')!
    return {
      content: `Based on your current plan, I'd suggest ₹${formatINR(savings.amount)} toward savings and ₹${formatINR(investments.amount)} toward investments from your next income — that keeps your savings rate at ${model.savingsRate}%.`,
      quickReplies: ['Increase my SIP instead', 'Ask another question'],
    }
  }

  if (p.includes('increase my sip') || p.includes('increase the sip')) {
    const baseInvestment = model.moneyPlan.find((c) => c.key === 'investments')?.amount ?? 0
    const scenario: ScenarioInput = {
      salary: model.profile.takeHomeIncome,
      essentials: model.profile.fixedExpenses,
      investment: baseInvestment + 5000,
      vacation: 0,
      loanRepayment: model.profile.monthlyDebt,
    }
    const result = runScenario(scenario, model.profile, primaryGoal, model.today)
    return {
      content: `Increasing your investment contribution by ₹5,000/month reduces this cycle's lifestyle allowance by the same amount${primaryGoal ? `, but brings your ${primaryGoal.name.toLowerCase()} goal forward to roughly ${result.goalCompletionMonths} months from now` : ''}. Want to see the full scenario in the simulator?`,
      quickReplies: ['Open simulator', 'Ask another question'],
    }
  }

  if (p.includes('new phone') || p.includes('buy a')) {
    return {
      content: `A one-time purchase like this usually fits if it comes out of your lifestyle allowance rather than your buffer. Right now you have ₹${formatINR(safe.amount)} of lifestyle allowance this cycle — a purchase under that amount shouldn't affect your goals.`,
      quickReplies: ['Ask another question'],
    }
  }

  if (p.includes('lower this month') || p.includes('safe-to-spend amount lower') || p.includes('safe to spend amount lower')) {
    return {
      content: getSafeToSpendExplanation(model),
      quickReplies: ['Ask another question'],
    }
  }

  if (p.includes('emergency fund') || p.includes('how long will it take')) {
    const goal = model.goals.find((g) => g.name.toLowerCase().includes('emergency')) ?? primaryGoal
    if (!goal) {
      return { content: "You don't have an emergency fund goal set up yet — add one from the Goals page.", quickReplies: ['Ask another question'] }
    }
    return {
      content: getGoalExplanation(goal, model.today),
      quickReplies: ['Increase my contribution', 'Ask another question'],
    }
  }

  if (p.includes('salary increase') || p.includes('salary increases')) {
    const income = model.profile.takeHomeIncome
    const scenario: ScenarioInput = {
      salary: Math.round(income * 1.1),
      essentials: model.profile.fixedExpenses,
      investment: model.moneyPlan.find((c) => c.key === 'investments')?.amount ?? 0,
      vacation: 0,
      loanRepayment: model.profile.monthlyDebt,
    }
    const result = runScenario(scenario, model.profile, primaryGoal, model.today)
    return {
      content: `A 10% raise (≈₹${formatINR(scenario.salary)}) would add roughly ₹${formatINR(Math.round(income * 0.1))}/month of flexible cash. Split toward savings and lifestyle, your 12-month savings would grow to about ₹${formatINR(result.savings12mo)}.`,
      quickReplies: ['Open simulator', 'Ask another question'],
    }
  }

  if (p.includes('pay off') && (p.includes('loan') || p.includes('debt'))) {
    return {
      content: `Paying down debt faster guarantees you avoid future interest, while investing offers potentially higher but uncertain returns. If your current payments already fit comfortably in your plan — and yours do, with ₹${formatINR(buffer)} of buffer left over — continuing to invest alongside your regular payments is usually the balanced choice.`,
      quickReplies: ['Ask another question'],
    }
  }

  return {
    content: "I can help with that once it's tied to your numbers — try one of the suggested questions, or ask about your spending, goals, or safe-to-spend amount.",
    quickReplies: ['Can I afford a ₹15,000 vacation?', 'How much should I save from my next salary?'],
  }
}

export function getInsights(model: FinancialModel): Insight[] {
  const emergencyGoal = model.goals.find((g) => g.name.toLowerCase().includes('emergency'))
  const buffer = model.moneyPlan.find((c) => c.key === 'buffer')?.amount ?? 0
  const lifestyle = model.moneyPlan.find((c) => c.key === 'lifestyle')?.amount ?? 0
  const debtRatio = model.profile.takeHomeIncome > 0 ? model.profile.monthlyDebt / model.profile.takeHomeIncome : 0

  const insights: Insight[] = [
    {
      id: 'ins_savings',
      title: 'Savings rate this cycle',
      severity: model.savingsRate >= 20 ? 'positive' : 'watch',
      what: `You're saving and investing ${model.savingsRate}% of your income.`,
      why: model.savingsRate >= 20 ? "That's a healthy, sustainable rate." : 'This is below the 20–25% most plans target.',
      action: model.savingsRate >= 20 ? 'No changes needed — keep this up.' : 'Consider trimming lifestyle spend to close the gap.',
    },
    {
      id: 'ins_debt',
      title: 'Debt load',
      severity: debtRatio > 0.3 ? 'watch' : debtRatio > 0 ? 'neutral' : 'positive',
      what: debtRatio > 0 ? `Debt payments are ${Math.round(debtRatio * 100)}% of your income.` : "You're not carrying any monthly debt.",
      why: debtRatio > 0.3 ? 'Above 30% starts to limit your flexibility.' : 'This stays well within a healthy range.',
      action: debtRatio > 0.3 ? 'Consider prioritizing debt payoff before increasing lifestyle spend.' : 'No action needed.',
    },
    {
      id: 'ins_buffer',
      title: 'Your buffer this cycle',
      severity: 'neutral',
      what: `₹${formatINR(buffer)} is unallocated after essentials, savings and investments.`,
      why: "This is your flexibility for the unexpected — it's separate from your ₹" + formatINR(lifestyle) + ' lifestyle allowance.',
      action: 'Consider directing part of it toward your fastest-growing goal.',
    },
  ]

  if (emergencyGoal) {
    const percent = Math.round((emergencyGoal.currentAmount / emergencyGoal.targetAmount) * 100)
    insights.push({
      id: 'ins_emergency',
      title: 'Emergency fund progress',
      severity: percent >= 70 ? 'positive' : 'watch',
      what: `Your emergency fund is ${percent}% complete.`,
      why: 'A full emergency fund is the single biggest lever for your financial health score.',
      action: percent >= 70 ? 'Stay the course — you’re nearly there.' : 'Consider directing more of your buffer here.',
    })
  }

  const behindGoal = [...model.goals].sort((a, b) => a.currentAmount / a.targetAmount - b.currentAmount / b.targetAmount)[0]
  if (behindGoal && behindGoal.id !== emergencyGoal?.id) {
    const percent = Math.round((behindGoal.currentAmount / behindGoal.targetAmount) * 100)
    insights.push({
      id: 'ins_behind_goal',
      title: `${behindGoal.name} needs attention`,
      severity: percent < 20 ? 'watch' : 'neutral',
      what: `${behindGoal.name} is ${percent}% funded.`,
      why: `At ₹${formatINR(behindGoal.monthlyContribution)}/month, this is your slowest-moving goal.`,
      action: 'Consider increasing its monthly contribution from the Goals page.',
    })
  }

  return insights
}

export function getPlanRecap(model: FinancialModel) {
  const lifestyle = model.moneyPlan.find((c) => c.key === 'lifestyle')?.amount ?? 0
  const savings = model.moneyPlan.find((c) => c.key === 'savings')?.amount ?? 0
  const investments = model.moneyPlan.find((c) => c.key === 'investments')?.amount ?? 0

  return {
    headline: `This cycle: ₹${formatINR(lifestyle)} for lifestyle, ₹${formatINR(savings + investments)} toward your goals and investments.`,
    good: model.savingsRate >= 20 ? ['Savings rate on target', 'Emergency fund building steadily'] : ['Plan is set up and tracking'],
    watch: model.savingsRate < 20 ? ['Savings rate below 20% target'] : [],
    next: 'Sparly will start comparing your actual spending against this plan once transaction tracking is available.',
  }
}

export function getPersonalizedOpportunity(model: FinancialModel): string {
  const emergency = model.health.components.find((c) => c.key === 'emergency')!
  const debt = model.health.components.find((c) => c.key === 'debt')!

  if (debt.score < 60) {
    return 'Your priority is balancing debt repayment with maintaining a basic emergency fund.'
  }
  if (emergency.score < 70) {
    return "You're doing well. Your next opportunity is finishing your emergency fund."
  }
  return "You're doing well. Your next opportunity is investing more consistently."
}
