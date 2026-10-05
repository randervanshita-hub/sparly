import { NavLink, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { Logo } from '../../../components/Logo'
import { PRIMARY_NAV, SECONDARY_NAV } from './navItems'
import { useProfile } from '../../context/ProfileContext'

export function Sidebar() {
  const { logout, displayName, model } = useProfile()
  const navigate = useNavigate()

  const handleLogout = async () => {
    // Navigate away from the AppShell-guarded tree *before* clearing the
    // session: otherwise AppShell's own "no session -> /app/auth" redirect
    // fires at the same time as this one and can win the race, landing the
    // user on the sign-in form instead of the marketing page.
    navigate('/')
    await logout()
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-hairline bg-card/60 backdrop-blur-xl lg:flex">
      <div className="px-6 py-6">
        <NavLink to="/app/overview">
          <Logo />
        </NavLink>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <ul className="flex flex-col gap-1">
          {PRIMARY_NAV.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? 'bg-white/[0.06] text-cream' : 'text-muted hover:bg-white/[0.03] hover:text-cream'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={17} className={isActive ? 'text-orange-soft' : ''} />
                    {item.label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="my-4 h-px bg-hairline" />

        <ul className="flex flex-col gap-1">
          {SECONDARY_NAV.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? 'bg-white/[0.06] text-cream' : 'text-muted hover:bg-white/[0.03] hover:text-cream'
                  }`
                }
              >
                <item.icon size={17} />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mx-3 mb-4 flex items-center gap-2 rounded-xl border border-hairline bg-white/[0.02] pr-2 transition-colors hover:bg-white/[0.04]">
        <NavLink to="/app/settings" className="flex min-w-0 flex-1 items-center gap-3 px-3.5 py-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange to-orange-soft text-sm font-semibold text-[#140a04]">
            {displayName[0]?.toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-cream">{displayName}</p>
            <p className="truncate text-xs text-muted">
              Financial Health: <span className="text-orange-soft">{model.health.label}</span>
            </p>
          </div>
        </NavLink>
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Log out"
          title="Log out"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-white/[0.06] hover:text-cream"
        >
          <LogOut size={15} />
        </button>
      </div>
    </aside>
  )
}
