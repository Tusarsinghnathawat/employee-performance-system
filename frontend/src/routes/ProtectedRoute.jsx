import { Navigate, useLocation } from 'react-router-dom'
import { Box } from '@mui/material'
import { useAuth } from '../context/AuthContext.jsx'
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx'
import DashboardLayout from '../layouts/DashboardLayout.jsx'

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <LoadingSpinner />
      </Box>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <DashboardLayout>{children}</DashboardLayout>
}

export default ProtectedRoute
