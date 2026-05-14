import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Stack,
  CircularProgress,
  Alert,
  IconButton,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Chip,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { useAuth } from '../context/AuthContext.jsx'
import { canEditEmployees, canDeleteEmployees } from '../utils/roleHelpers.js'
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../services/employeeService.js'
import EmployeeForm from '../components/EmployeeForm.jsx'
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx'
import SnackbarAlert from '../components/ui/SnackbarAlert.jsx'
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx'

function EmployeesPage() {
  const { user } = useAuth()
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [designationFilter, setDesignationFilter] = useState('')
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    title: '',
    department: '',
    role: 'employee',
  })

  // Fetch employees on mount
  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getEmployees()
      setEmployees(Array.isArray(data.employees) ? data.employees : data || [])
    } catch (err) {
      setError(err.message || 'Failed to fetch employees')
      setEmployees([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateClick = () => {
    setFormValues({
      name: '',
      email: '',
      title: '',
      department: '',
      role: 'employee',
    })
    setFormError('')
    setCreateDialogOpen(true)
  }

  const handleEditClick = (employee) => {
    setSelectedEmployee(employee)
    setFormValues({
      name: employee.name || '',
      email: employee.email || '',
      title: employee.title || employee.designation || '',
      department: employee.department || '',
      role: employee.role || 'employee',
    })
    setFormError('')
    setEditDialogOpen(true)
  }

  const handleDeleteClick = (employee) => {
    setSelectedEmployee(employee)
    setDeleteConfirmOpen(true)
  }

  const handleFormChange = (event) => {
    const { name, value } = event.target
    setFormValues({ ...formValues, [name]: value })
  }

  const handleCreateSubmit = async (event) => {
    event.preventDefault()
    setFormError('')
    setSubmitting(true)

    try {
      await createEmployee(formValues)
      setSnackbar({
        open: true,
        message: 'Employee created successfully',
        severity: 'success',
      })
      setCreateDialogOpen(false)
      fetchEmployees()
    } catch (err) {
      setFormError(err.message || 'Failed to create employee')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditSubmit = async (event) => {
    event.preventDefault()
    setFormError('')
    setSubmitting(true)

    try {
      await updateEmployee(selectedEmployee.id, formValues)
      setSnackbar({
        open: true,
        message: 'Employee updated successfully',
        severity: 'success',
      })
      setEditDialogOpen(false)
      fetchEmployees()
    } catch (err) {
      setFormError(err.message || 'Failed to update employee')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    setSubmitting(true)
    try {
      await deleteEmployee(selectedEmployee.id)
      setSnackbar({
        open: true,
        message: 'Employee deleted successfully',
        severity: 'success',
      })
      setDeleteConfirmOpen(false)
      fetchEmployees()
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Failed to delete employee',
        severity: 'error',
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Filter employees based on search and filters
  const filteredEmployees = employees.filter((emp) => {
    const searchMatch =
      emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const deptMatch = !departmentFilter || emp.department === departmentFilter
    const desigMatch =
      !designationFilter || (emp.title || emp.designation) === designationFilter
    return searchMatch && deptMatch && desigMatch
  })

  // Get unique departments and designations for filters
  const departments = [...new Set(employees.map((emp) => emp.department).filter(Boolean))]
  const designations = [
    ...new Set(employees.map((emp) => emp.title || emp.designation).filter(Boolean)),
  ]

  if (loading && employees.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <LoadingSpinner />
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Employees</Typography>
        {canEditEmployees(user?.role) && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateClick}
          >
            Add Employee
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Search and Filter Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
          <TextField
            label="Search by name or email"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1, minWidth: 200 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Department</InputLabel>
            <Select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              label="Department"
            >
              <MenuItem value="">All Departments</MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Designation</InputLabel>
            <Select
              value={designationFilter}
              onChange={(e) => setDesignationFilter(e.target.value)}
              label="Designation"
            >
              <MenuItem value="">All Designations</MenuItem>
              {designations.map((desig) => (
                <MenuItem key={desig} value={desig}>
                  {desig}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* Employees Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Designation</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Role</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography color="text.secondary">
                    {employees.length === 0 ? 'No employees found' : 'No employees match your filters'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployees.map((employee) => (
                <TableRow key={employee.id} hover>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.title || employee.designation || '-'}</TableCell>
                  <TableCell>{employee.department || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={employee.role}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    {canEditEmployees(user?.role) && (
                      <>
                        <IconButton
                          size="small"
                          onClick={() => handleEditClick(employee)}
                          title="Edit"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(employee)}
                          title="Delete"
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Employee</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <EmployeeForm
            values={formValues}
            onChange={handleFormChange}
            onSubmit={handleCreateSubmit}
            submitting={submitting}
            error={formError}
            submitLabel="Create Employee"
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Employee</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <EmployeeForm
            values={formValues}
            onChange={handleFormChange}
            onSubmit={handleEditSubmit}
            submitting={submitting}
            error={formError}
            submitLabel="Update Employee"
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Delete Employee"
        description={`Are you sure you want to delete ${selectedEmployee?.name}? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteConfirmOpen(false)}
      />

      {/* Snackbar Alert */}
      <SnackbarAlert
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Box>
  )
}

export default EmployeesPage