import { Navigate } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'

export function AppEntry() {
  const { session, onboarded, loading } = useProfile()

  if (loading) return null
  if (!session) return <Navigate to="/app/auth" replace />
  return <Navigate to={onboarded ? '/app/overview' : '/app/onboarding'} replace />
}
