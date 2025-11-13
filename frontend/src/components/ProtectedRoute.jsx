import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

// ProtectedRoute removed for full-access mode
const ProtectedRoute = ({ children }) => children
export default ProtectedRoute

export default ProtectedRoute
