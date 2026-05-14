import { Navigate, Route, Routes } from 'react-router-dom'
import DashboardPage from '../pages/DashboardPage.jsx'
import EmployeesPage from '../pages/EmployeesPage.jsx'
import ReviewsPage from '../pages/ReviewsPage.jsx'
import DevelopmentPlansPage from '../pages/DevelopmentPlansPage.jsx'
import SkillsPage from '../pages/SkillsPage.jsx'
import TrainingPage from '../pages/TrainingPage.jsx'
import LoginPage from '../pages/LoginPage.jsx'
import RegisterPage from '../pages/RegisterPage.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'
import UnauthorizedPage from '../pages/UnauthorizedPage.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin', 'hr', 'manager', 'employee']}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employees"
        element={
          <ProtectedRoute allowedRoles={['admin', 'hr', 'manager', 'employee']}>
            <EmployeesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reviews"
        element={
          <ProtectedRoute allowedRoles={['admin', 'hr', 'manager', 'employee']}>
            <ReviewsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/development-plans"
        element={
          <ProtectedRoute allowedRoles={['admin', 'hr', 'manager', 'employee']}>
            <DevelopmentPlansPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/skills"
        element={
          <ProtectedRoute allowedRoles={['admin', 'hr', 'manager', 'employee']}>
            <SkillsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/training"
        element={
          <ProtectedRoute allowedRoles={['admin', 'hr', 'manager', 'employee']}>
            <TrainingPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRoutes
