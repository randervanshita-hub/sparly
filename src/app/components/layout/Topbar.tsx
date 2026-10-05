import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, LogOut } from 'lucide-react'
import { Logo } from '../../../components/Logo'
import { PRIMARY_NAV, SECONDARY_NAV } from './navItems'
import { getFinancialHealth } from '../../../lib/financeEngine'
import { useProfile } from '../../context/ProfileContext'

export function Topbar() {
  const [open, setOpen] = useState(false)
  const health = getFinancialHealth()
  const navigate = useNavigate()
  const { logout } = useProfile()

  const handleLogout = async () => {
    setOpen(false)
    // See Sidebar's handleLogout for why navigate happens before logout.
    navigate('/')
    await logout()
  }

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-hairline bg-bg/90 px-5 py-3.5 backdrop-blur-xl lg:hidden">
      <NavLink to="/app/overview">
        <Logo />
      </NavLink>
      <div className="flex items-center gap-3">
        <span className="hidden items-center gap-1.5 rounded-full border border-hairline px-3 py-1.5 text-xs text-muted sm:flex">
          Health <span className="font-semibold text-orange-soft">{health.score}</span>
        </span>
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-cream"
        >
          {open ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-full overflow-hidden border-b border-hairline bg-bg/98 backdrop-blur-xl"
          >
            <ul className="flex flex-col gap-1 p-4">
              {[...PRIMARY_NAV, ...SECONDARY_NAV].map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium ${
                        isActive ? 'bg-white/[0.06] text-cream' : 'text-muted'
                      }`
                    }
                  >
                    <item.icon size={17} />
                    {item.label}
                  </NavLink>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-medium text-muted"
                >
                  <LogOut size={17} />
                  Log out
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
