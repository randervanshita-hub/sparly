import { Navigate, Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { MobileNav } from './MobileNav'
import { useProfile } from '../../context/ProfileContext'

export function AppShell() {
  const { session, loading } = useProfile()

  if (loading) return null
  if (!session) return <Navigate to="/app/auth" replace />

  return (
    <div className="min-h-screen bg-bg">
      <Sidebar />
      <Topbar />
      <main className="pb-24 lg:ml-64 lg:pb-10">
        <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8 lg:py-10">
          <Outlet />
        </div>
      </main>
      <MobileNav />
    </div>
  )
}
