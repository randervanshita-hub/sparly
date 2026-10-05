import {
  LayoutGrid,
  PieChart,
  Receipt,
  Target,
  Lightbulb,
  SlidersHorizontal,
  MessageCircle,
  Settings,
  HelpCircle,
  TrendingUp,
} from 'lucide-react'

export const PRIMARY_NAV = [
  { to: '/app/overview', label: 'Overview', icon: LayoutGrid },
  { to: '/app/plan', label: 'Money Plan', icon: PieChart },
  { to: '/app/transactions', label: 'Transactions', icon: Receipt },
  { to: '/app/goals', label: 'Goals', icon: Target },
  { to: '/app/insights', label: 'Insights', icon: Lightbulb },
  { to: '/app/simulator', label: 'Simulator', icon: SlidersHorizontal },
  { to: '/app/coach', label: 'AI Coach', icon: MessageCircle },
  { to: '/app/investments', label: 'Investments', icon: TrendingUp },
]

export const SECONDARY_NAV = [
  { to: '/app/settings', label: 'Settings', icon: Settings },
  { to: '/app/help', label: 'Help', icon: HelpCircle },
]

export const MOBILE_NAV = [
  { to: '/app/overview', label: 'Home', icon: LayoutGrid },
  { to: '/app/plan', label: 'Plan', icon: PieChart },
  { to: '/app/goals', label: 'Goals', icon: Target },
  { to: '/app/insights', label: 'Insights', icon: Lightbulb },
  { to: '/app/coach', label: 'AI', icon: MessageCircle },
]
