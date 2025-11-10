import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const ProtectedRoute = ({ requireAdmin = false }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="page-loader">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && !user.roles?.includes('admin')) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
