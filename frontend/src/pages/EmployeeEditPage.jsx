import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent, Container, Typography } from '@mui/material'
import { useAuth } from '../context/AuthContext.jsx'
import { canEditEmployees } from '../utils/roleHelpers.js'
import { getEmployeeById, updateEmployee } from '../services/employeeService.js'
import EmployeeForm from '../components/EmployeeForm.jsx'
import SnackbarAlert from '../components/ui/SnackbarAlert.jsx'
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx'

function EmployeeEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', title: '', department: '', role: 'employee' })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  if (!canEditEmployees(user?.role)) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Access Denied
            </Typography>
            <Typography color="text.secondary">
              Only administrators and HR users can edit employee profiles.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    )
  }

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        const data = await getEmployeeById(id)
        const found = data.employee || data
        setForm({
          name: found.name || '',
          email: found.email || '',
          title: found.title || '',
          department: found.department || '',
          role: found.role || 'employee',
        })
      } catch {
        setError('Unable to load employee data.')
      } finally {
        setLoading(false)
      }
    }

    loadEmployee()
  }, [id])

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await updateEmployee(id, form)
      setSnackbar({ open: true, message: 'Employee updated successfully.', severity: 'success' })
      navigate(`/employees/${id}`)
    } catch (submitError) {
      setError(submitError.message)
      setSnackbar({ open: true, message: 'Unable to update employee.', severity: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <LoadingSpinner />
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Edit Employee
          </Typography>
          <EmployeeForm
            values={form}
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitting={submitting}
            error={error}
            submitLabel="Save Changes"
          />
          <SnackbarAlert
            open={snackbar.open}
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            message={snackbar.message}
            severity={snackbar.severity}
          />
        </CardContent>
      </Card>
    </Container>
  )
}

export default EmployeeEditPage
