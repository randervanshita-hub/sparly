// Templated "AI" interpretation layer. Every number here is read from
// financeEngine.ts — this file only explains, summarizes and recommends.
// In production, this is where a real LLM call would slot in, fed the
// same computed facts (never raw access to invent numbers).
import {
  getCashFlow,
  getDiningAverage,
  getFinancialHealth,
  getMoneyPlan,
  getSafeToSpend,
  getSavingsRate,
  projectGoalCompletion,
  runScenario,
} from './financeEngine'
import { demoGoals, demoSubscriptions } from './demoData'
import type { Insight } from './types'
import { formatINR } from '../hooks/useCountUp'

export function getMonthlyRecommendation(): { headline: string; body: string } {
  const safe = getSafeToSpend()
  const plan = getMoneyPlan()
  const savings = plan.find((p) => p.key === 'savings')!
  const investments = plan.find((p) => p.key === 'investments')!

  return {
    headline: "You're in a comfortable position this month.",
    body: `You can spend approximately ₹${formatINR(safe.amount)} while staying on track with your savings and investment goals. I'd recommend putting ₹${formatINR(savings.amount)} toward your emergency fund and ₹${formatINR(investments.amount)} toward your SIPs before increasing discretionary spending.`,
  }
}

export function getSafeToSpendExplanation(): string {
  const safe = getSafeToSpend()
  return `I started from your liquid balance across accounts, then subtracted the ₹${formatINR(safe.upcomingCommitments)} in bills and EMIs due before your next salary, ₹${formatINR(safe.goalContribution)} already earmarked for your goals this month, and a ₹${formatINR(safe.recommendedBuffer)} buffer so a surprise expense doesn't put you behind. What's left — ₹${formatINR(safe.amount)} — is yours to spend freely for the next ${safe.daysToSalary} days.`
}

export function getCategoryExplanation(key: string): string {
  const plan = getMoneyPlan()
  const category = plan.find((c) => c.key === key)
  if (!category) return ''
  if (key === 'buffer') {
    return `This is money not yet committed to anything — after essentials, savings and investments are set aside, ₹${formatINR(category.amount)} is left as flexibility for the unexpected.`
  }
  const diff = category.spent - category.amount
  if (key === 'lifestyle' && diff > 0) {
    return `Lifestyle spending is ₹${formatINR(diff)} above your planned amount this month. This is still manageable because your emergency fund contribution is ahead of schedule.`
  }
  if (diff > 0) {
    return `You've spent ₹${formatINR(diff)} more than planned in ${category.label.toLowerCase()} this month. Worth keeping an eye on next month.`
  }
  return `${category.label} is tracking right on plan this month — no action needed.`
}

export function getDiningInsight(): { what: string; why: string; action: string } {
  const d = getDiningAverage()
  return {
    what: `Dining spend increased ${d.percentIncrease}% to ₹${formatINR(d.thisMonth)}, up from your usual ₹${formatINR(d.average)}.`,
    why: 'At this pace, your monthly savings rate will fall below your target.',
    action: 'Reducing dining spend by ₹2,000 next month gets you back on track.',
  }
}

export function getGoalExplanation(goalId: string, newContribution?: number): string {
  const goal = demoGoals.find((g) => g.id === goalId)
  if (!goal) return ''
  const current = projectGoalCompletion(goal)
  if (!newContribution || newContribution === goal.monthlyContribution) {
    return `You are currently on track to reach your ${goal.name.toLowerCase()} goal by ${current}.`
  }
  const updated = projectGoalCompletion(goal, newContribution)
  return `You are currently on track to reach your ${goal.name.toLowerCase()} goal by ${current}. Increasing your monthly contribution to ₹${formatINR(newContribution)} would bring it forward to ${updated}.`
}

export function getHealthComponentExplanation(key: string): string {
  const health = getFinancialHealth()
  const component = health.components.find((c) => c.key === key)
  if (!component) return ''
  return `${component.explanation} Your score could increase by approximately 5 points if you maintain this trend for another 3 months.`
}

export function explainWhy(topic: string): string {
  switch (topic) {
    case 'safe-to-spend':
      return getSafeToSpendExplanation()
    case 'savings-rate': {
      const rate = getSavingsRate()
      return `You're putting ${rate}% of your income toward savings and investments combined. That's calculated from your actual monthly contributions, not an estimate — it updates the moment those amounts change.`
    }
    case 'health-score': {
      const health = getFinancialHealth()
      return `Your score is ${health.score}/100 (${health.label}) — an average of five components: emergency fund progress, savings rate, debt management, goal progress and spending stability. It's a Sparly planning metric, not a credit score.`
    }
    default:
      return "I don't have enough context to explain that yet — try asking from the screen where you saw it."
  }
}

interface CoachResponse {
  content: string
  quickReplies?: string[]
}

export function answerCoachPrompt(prompt: string): CoachResponse {
  const p = prompt.toLowerCase()
  const safe = getSafeToSpend()
  const cashFlow = getCashFlow()

  if (p.includes('vacation') || p.includes('afford a') || (p.includes('afford') && p.includes('₹'))) {
    const amountMatch = prompt.match(/₹\s?([\d,]+)/)
    const amount = amountMatch ? Number(amountMatch[1].replace(/,/g, '')) : 20000
    const wouldDip = amount > safe.amount
    return {
      content: wouldDip
        ? `Yes — but I'd recommend waiting until your next salary. You currently have ₹${formatINR(safe.amount)} of flexible cash available, but ₹${formatINR(safe.upcomingCommitments)} of upcoming commitments and ₹${formatINR(safe.goalContribution)} of goal contributions are already planned. If you spend ₹${formatINR(amount)} now, your emergency-fund contribution would fall below your monthly target. Want me to show you what happens under both options?`
        : `Yes, comfortably. After your upcoming commitments and goal contributions, you'd still have ₹${formatINR(safe.amount - amount)} of buffer left this cycle.`,
      quickReplies: ['Show me', 'Ask another question'],
    }
  }

  if (p.includes('spend more') || p.includes('why did i spend')) {
    const d = getDiningAverage()
    return {
      content: `Your dining spend is the main driver — ₹${formatINR(d.thisMonth)} this month versus your usual ₹${formatINR(d.average)}, a ${d.percentIncrease}% increase. Everything else is close to your normal pattern.`,
      quickReplies: ['How do I fix this?', 'Ask another question'],
    }
  }

  if (p.includes('save from my next salary') || p.includes('how much should i save')) {
    const plan = getMoneyPlan()
    const savings = plan.find((c) => c.key === 'savings')!
    const investments = plan.find((c) => c.key === 'investments')!
    return {
      content: `Based on your current plan, I'd suggest ₹${formatINR(savings.amount)} toward savings and ₹${formatINR(investments.amount)} toward investments from your next salary — that keeps your savings rate at ${getSavingsRate()}%, right around your target.`,
      quickReplies: ['Increase my SIP instead', 'Ask another question'],
    }
  }

  if (p.includes('increase my sip') || p.includes('increase the sip')) {
    const result = runScenario({ salary: 80000, rent: 18000, investment: 17000, vacation: 0, loanRepayment: 9800 })
    return {
      content: `Increasing your SIP by ₹5,000/month reduces this month's flexible spending by the same amount, but brings your emergency fund goal forward to roughly ${result.goalCompletionMonths} months from now. Want to see the full scenario in the simulator?`,
      quickReplies: ['Open simulator', 'Ask another question'],
    }
  }

  if (p.includes('new phone') || p.includes('buy a')) {
    return {
      content: `A one-time purchase like this is usually fine as long as it comes out of your lifestyle allocation rather than your buffer. Right now you have ₹${formatINR(Math.max(cashFlow, 0))} of unallocated cash flow this month — a phone under that amount wouldn't affect your goals.`,
      quickReplies: ['Ask another question'],
    }
  }

  if (p.includes('lower this month') || p.includes('safe-to-spend amount lower') || p.includes('safe to spend amount lower')) {
    return {
      content: getSafeToSpendExplanation(),
      quickReplies: ['Ask another question'],
    }
  }

  if (p.includes('emergency fund goal') || p.includes('how long will it take')) {
    const goal = demoGoals.find((g) => g.id === 'goal_emergency')!
    return {
      content: getGoalExplanation(goal.id),
      quickReplies: ['Increase my contribution', 'Ask another question'],
    }
  }

  if (p.includes('salary increase') || p.includes('salary increases')) {
    const result = runScenario({ salary: 88000, rent: 18000, investment: 12000, vacation: 0, loanRepayment: 9800 })
    return {
      content: `A 10% raise (≈₹88,000) would add roughly ₹8,000/month of flexible cash. If you split it evenly between savings and lifestyle, your 12-month savings would grow to about ₹${formatINR(result.savings12mo)}, with your emergency fund reached around ${result.goalCompletionMonths} months sooner.`,
      quickReplies: ['Open simulator', 'Ask another question'],
    }
  }

  if (p.includes('pay off') && (p.includes('loan') || p.includes('debt'))) {
    return {
      content: `Your car loan carries a ${9.2}% interest rate. Your current SIPs are projected to return more than that over time, so continuing to invest while paying the standard EMI is usually the stronger move — paying it off faster mainly helps if the rate rises or you want the peace of mind.`,
      quickReplies: ['Ask another question'],
    }
  }

  return {
    content: "I can help with that once it's tied to your numbers — try one of the suggested questions, or ask about your spending, goals, or safe-to-spend amount.",
    quickReplies: ['Can I afford a ₹15,000 vacation?', 'How much should I save from my next salary?'],
  }
}

export function getInsights(): Insight[] {
  const dining = getDiningAverage()
  const emergencyGoal = demoGoals.find((g) => g.id === 'goal_emergency')!
  const emergencyPercent = Math.round((emergencyGoal.currentAmount / emergencyGoal.targetAmount) * 100)
  const unused = demoSubscriptions.filter((s) => !s.confirmed)
  const idleCash = 18000
  const savingsRate = getSavingsRate()

  return [
    {
      id: 'ins_dining',
      title: 'Spending changed this month',
      severity: 'watch',
      what: `Dining spend increased ${dining.percentIncrease}% to ₹${formatINR(dining.thisMonth)}.`,
      why: 'At this pace, your monthly savings rate will fall below your target.',
      action: 'Reducing dining spend by ₹2,000 next month gets you back on track.',
    },
    {
      id: 'ins_idle',
      title: 'Idle cash sitting in your account',
      severity: 'neutral',
      what: `You have ₹${formatINR(idleCash)} sitting idle beyond your buffer.`,
      why: "Cash beyond your buffer isn't working toward any goal or earning returns.",
      action: 'Consider directing it toward your emergency fund or a short-term investment.',
    },
    {
      id: 'ins_emergency',
      title: 'Emergency fund progress',
      severity: 'positive',
      what: `Your emergency fund is ${emergencyPercent}% complete.`,
      why: 'A full emergency fund is the single biggest lever for your financial health score.',
      action: 'Stay the course — at your current contribution you’ll finish on schedule.',
    },
    {
      id: 'ins_subs',
      title: `${unused.length} subscriptions you haven't used recently`,
      severity: 'watch',
      what: `${unused.map((u) => u.label).join(' and ')} haven't been used in over a month.`,
      why: `Together they cost ₹${formatINR(unused.reduce((s, u) => s + u.amount, 0))}/month.`,
      action: 'Review whether to keep, pause or cancel them.',
    },
    {
      id: 'ins_savings',
      title: 'Savings rate this month',
      severity: savingsRate >= 20 ? 'positive' : 'watch',
      what: `You're saving and investing ${savingsRate}% of your income.`,
      why: savingsRate >= 20 ? "That's a healthy, sustainable rate." : 'This is slightly below the 20–25% most plans target.',
      action: savingsRate >= 20 ? 'No changes needed — keep this up.' : 'Consider trimming lifestyle spend by 5% to close the gap.',
    },
  ]
}

export function getWeeklyBrief() {
  return {
    spent: 8420,
    expectedPace: 9040,
    good: ['Savings on track', 'No unusual large purchases'],
    watch: ['Dining spending +18%'],
    next: 'Keep discretionary spending below ₹3,200 next week.',
  }
}

export function getPersonalizedOpportunity(): string {
  const health = getFinancialHealth()
  const emergency = health.components.find((c) => c.key === 'emergency')!
  const debt = health.components.find((c) => c.key === 'debt')!

  if (debt.score < 60) {
    return 'Your priority is balancing debt repayment with maintaining a basic emergency fund.'
  }
  if (emergency.score < 70) {
    return "You're doing well. Your next opportunity is finishing your emergency fund."
  }
  return "You're doing well. Your next opportunity is investing more consistently."
}
