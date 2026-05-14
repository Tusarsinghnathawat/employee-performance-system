import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Typography,
} from '@mui/material'
import { useAuth } from '../context/AuthContext.jsx'
import { canDeleteEmployees, canEditEmployees, isEmployeeOnly } from '../utils/roleHelpers.js'
import { deleteEmployee, getEmployeeById } from '../services/employeeService.js'
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx'
import SnackbarAlert from '../components/ui/SnackbarAlert.jsx'
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx'

function EmployeeDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [employee, setEmployee] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const userId = String(user?.id || user?._id)

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        const data = await getEmployeeById(id)
        const found = data.employee || data
        if (isEmployeeOnly(user?.role) && String(found.id || found._id) !== userId) {
          setError('You may only view your own profile.')
        } else {
          setEmployee(found)
        }
      } catch {
        setError('Employee not found.')
      } finally {
        setLoading(false)
      }
    }

    loadEmployee()
  }, [id, userId, user])

  const handleDelete = () => {
    setConfirmOpen(true)
  }

  const confirmDelete = async () => {
    try {
      const employeeId = employee.id || employee._id
      await deleteEmployee(employeeId)
      setSnackbar({ open: true, message: 'Employee removed successfully.', severity: 'success' })
      navigate('/employees')
    } catch {
      setSnackbar({ open: true, message: 'Failed to delete employee.', severity: 'error' })
    } finally {
      setConfirmOpen(false)
    }
  }

  if (loading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <LoadingSpinner />
      </Container>
    )
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    )
  }

  return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h5">{employee.name}</Typography>
                <Typography color="text.secondary">{employee.role}</Typography>
              </Box>
              <Box>
                {canEditEmployees(user?.role) && (
                  <Button sx={{ mr: 1 }} variant="outlined" onClick={() => navigate(`/employees/edit/${id}`)}>
                    Edit
                  </Button>
                )}
                {canDeleteEmployees(user?.role) && (
                  <Button color="error" variant="contained" onClick={handleDelete}>
                    Delete
                  </Button>
                )}
              </Box>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
                <Typography>{employee.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Department
                </Typography>
                <Typography>{employee.department || '-'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Job Title
                </Typography>
                <Typography>{employee.title || '-'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Role
                </Typography>
                <Typography>{employee.role}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <SnackbarAlert
          open={snackbar.open}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          message={snackbar.message}
          severity={snackbar.severity}
        />
        <ConfirmDialog
          open={confirmOpen}
          title="Delete Employee"
          description="Are you sure you want to delete this employee? This action cannot be undone."
          onConfirm={confirmDelete}
          onClose={() => setConfirmOpen(false)}
        />
      </Container>
  )
}

export default EmployeeDetailsPage
