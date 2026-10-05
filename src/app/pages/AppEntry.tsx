import { Navigate } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'

export function AppEntry() {
  const { onboarded } = useProfile()
  return <Navigate to={onboarded ? '/app/overview' : '/app/onboarding'} replace />
}
