import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import VisibilityIcon from '@mui/icons-material/Visibility'
import AddIcon from '@mui/icons-material/Add'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { canDeleteEmployees, canEditEmployees, canViewEmployeeList, isEmployeeOnly } from '../utils/roleHelpers.js'
import { deleteEmployee, getEmployees } from '../services/employeeService.js'
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx'
import SnackbarAlert from '../components/ui/SnackbarAlert.jsx'
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx'

function EmployeeListPage() {
  const { user } = useAuth()
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const authorized = useMemo(() => canViewEmployeeList(user?.role), [user])

  useEffect(() => {
    if (!authorized) {
      setLoading(false)
      return
    }

    setLoading(true)
    getEmployees()
      .then((data) => {
        const list = data.employees || data || []
        setEmployees(Array.isArray(list) ? list : [])
      })
      .catch(() => setError('Unable to load employees.'))
      .finally(() => setLoading(false))
  }, [authorized])

  const handleDelete = (employee) => {
    setSelectedEmployee(employee)
    setConfirmOpen(true)
  }

  const confirmDelete = async () => {
    try {
      const employeeId = selectedEmployee.id || selectedEmployee._id
      await deleteEmployee(employeeId)
      setEmployees((current) => current.filter((item) => (item.id || item._id) !== employeeId))
      setSnackbar({ open: true, message: 'Employee removed successfully.', severity: 'success' })
    } catch {
      setSnackbar({ open: true, message: 'Failed to delete employee.', severity: 'error' })
    } finally {
      setConfirmOpen(false)
    }
  }

  if (!authorized) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Access restricted
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Employees are managed by admin, HR, and managers. Use your profile link instead.
            </Typography>
            <Button component={RouterLink} to={`/employees/${user?.id || user?._id}`} variant="contained">
              View My Profile
            </Button>
          </CardContent>
        </Card>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5">Employee Directory</Typography>
        {canEditEmployees(user?.role) && (
          <Button component={RouterLink} to="/employees/create" variant="contained" startIcon={<AddIcon />}>
            Add Employee
          </Button>
        )}
      </Stack>
      <Card>
        <CardContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <LoadingSpinner />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employees.map((employee) => {
                    const employeeId = employee.id || employee._id
                    return (
                      <TableRow key={employeeId}>
                        <TableCell>{employee.name}</TableCell>
                        <TableCell>{employee.email}</TableCell>
                        <TableCell>{employee.role}</TableCell>
                        <TableCell>{employee.designation || '-'}</TableCell>
                        <TableCell>{employee.department || '-'}</TableCell>
                        <TableCell align="right">
                          <IconButton component={RouterLink} to={`/employees/${employeeId}`}>
                            <VisibilityIcon />
                          </IconButton>
                          {canEditEmployees(user?.role) && (
                            <IconButton component={RouterLink} to={`/employees/edit/${employeeId}`}>
                              <EditIcon />
                            </IconButton>
                          )}
                          {canDeleteEmployees(user?.role) && (
                            <IconButton color="error" onClick={() => handleDelete(employee)}>
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Employee"
        description="Are you sure you want to remove this employee? This action cannot be undone."
        onConfirm={confirmDelete}
        onClose={() => setConfirmOpen(false)}
      />
      <SnackbarAlert
        open={snackbar.open}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Container>
  )
}

export default EmployeeListPage
