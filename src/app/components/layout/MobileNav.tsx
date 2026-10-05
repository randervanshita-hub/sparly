import { NavLink } from 'react-router-dom'
import { MOBILE_NAV } from './navItems'

export function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-bg/95 backdrop-blur-xl lg:hidden">
      <ul className="flex items-stretch justify-between px-2 pb-[env(safe-area-inset-bottom)]">
        {MOBILE_NAV.map((item) => (
          <li key={item.to} className="flex-1">
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-2 py-2.5 text-[11px] font-medium transition-colors ${
                  isActive ? 'text-orange-soft' : 'text-muted'
                }`
              }
            >
              <item.icon size={19} />
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
