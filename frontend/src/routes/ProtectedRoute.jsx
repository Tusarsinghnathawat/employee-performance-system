import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Box } from '@mui/material'
import { useAuth } from '../context/AuthContext.jsx'
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx'
import MainLayout from '../layouts/MainLayout.jsx'

function ProtectedRoute() {
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

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  )
}

export default ProtectedRoute
