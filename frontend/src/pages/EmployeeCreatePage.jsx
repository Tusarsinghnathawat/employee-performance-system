import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, Container, Typography } from '@mui/material'
import { useAuth } from '../context/AuthContext.jsx'
import { canEditEmployees } from '../utils/roleHelpers.js'
import { createEmployee } from '../services/employeeService.js'
import EmployeeForm from '../components/EmployeeForm.jsx'
import SnackbarAlert from '../components/ui/SnackbarAlert.jsx'

function EmployeeCreatePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', title: '', department: '', role: 'employee' })
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
              Only administrators and HR users can add new employees.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    )
  }

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await createEmployee(form)
      setSnackbar({ open: true, message: 'Employee created successfully.', severity: 'success' })
      navigate('/employees')
    } catch (submitError) {
      setError(submitError.message)
      setSnackbar({ open: true, message: 'Unable to create employee.', severity: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Create New Employee
          </Typography>
          <EmployeeForm
            values={form}
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitting={submitting}
            error={error}
            submitLabel="Create Employee"
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

export default EmployeeCreatePage
