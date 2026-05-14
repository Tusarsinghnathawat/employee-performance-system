import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Rating,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useAuth } from '../context/AuthContext.jsx'
import {
  getReviews,
  getReviewsByEmployee,
  createReview,
  updateReview,
  deleteReview,
} from '../services/reviewService.js'
import { getEmployees } from '../services/employeeService.js'
import ReviewForm from '../components/ReviewForm.jsx'
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx'
import SnackbarAlert from '../components/ui/SnackbarAlert.jsx'
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx'

function ReviewsPage() {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [selectedReview, setSelectedReview] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [ratingFilter, setRatingFilter] = useState('')
  const [periodFilter, setPeriodFilter] = useState('')
  const [employeeFilter, setEmployeeFilter] = useState('')
  const [formValues, setFormValues] = useState({
    employee_id: '',
    rating: 3,
    feedback: '',
    review_period: '',
  })

  const isEmployee = user?.role === 'employee'
  const canManage = ['admin', 'hr', 'manager'].includes(user?.role)

  // Fetch reviews and employees on mount
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    setError('')
    try {
      // Fetch employees for dropdown
      const empData = await getEmployees()
      setEmployees(Array.isArray(empData.employees) ? empData.employees : empData || [])

      // Fetch reviews based on role
      let reviewsData
      if (isEmployee) {
        reviewsData = await getReviewsByEmployee(user.id || user._id)
      } else {
        reviewsData = await getReviews()
      }

      setReviews(Array.isArray(reviewsData.reviews) ? reviewsData.reviews : reviewsData || [])
    } catch (err) {
      setError(err.message || 'Failed to fetch data')
      setReviews([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateClick = () => {
    setFormValues({
      employee_id: isEmployee ? user.id || user._id : '',
      rating: 3,
      feedback: '',
      review_period: '',
    })
    setFormError('')
    setCreateDialogOpen(true)
  }

  const handleEditClick = (review) => {
    setSelectedReview(review)
    setFormValues({
      employee_id: review.employee_id,
      rating: review.rating || 3,
      feedback: review.feedback || '',
      review_period: review.review_period || '',
    })
    setFormError('')
    setEditDialogOpen(true)
  }

  const handleDeleteClick = (review) => {
    setSelectedReview(review)
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
      await createReview(formValues)
      setSnackbar({
        open: true,
        message: 'Review created successfully',
        severity: 'success',
      })
      setCreateDialogOpen(false)
      fetchData()
    } catch (err) {
      setFormError(err.message || 'Failed to create review')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditSubmit = async (event) => {
    event.preventDefault()
    setFormError('')
    setSubmitting(true)

    try {
      await updateReview(selectedReview.id, formValues)
      setSnackbar({
        open: true,
        message: 'Review updated successfully',
        severity: 'success',
      })
      setEditDialogOpen(false)
      fetchData()
    } catch (err) {
      setFormError(err.message || 'Failed to update review')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    setSubmitting(true)
    try {
      await deleteReview(selectedReview.id)
      setSnackbar({
        open: true,
        message: 'Review deleted successfully',
        severity: 'success',
      })
      setDeleteConfirmOpen(false)
      fetchData()
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Failed to delete review',
        severity: 'error',
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Get employee name by ID
  const getEmployeeName = (employeeId) => {
    const emp = employees.find((e) => e.id === employeeId)
    return emp?.name || `Employee ${employeeId}`
  }

  // Filter reviews based on search and filters
  const filteredReviews = reviews.filter((review) => {
    const employeeName = getEmployeeName(review.employee_id)
    const searchMatch =
      employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.feedback?.toLowerCase().includes(searchTerm.toLowerCase())
    const ratingMatch = !ratingFilter || review.rating === parseInt(ratingFilter)
    const periodMatch =
      !periodFilter || review.review_period?.toLowerCase().includes(periodFilter.toLowerCase())
    const employeeMatch = !employeeFilter || review.employee_id === parseInt(employeeFilter)

    return searchMatch && ratingMatch && periodMatch && employeeMatch
  })

  // Get unique periods for filter
  const periods = [...new Set(reviews.map((r) => r.review_period).filter(Boolean))]

  if (loading && reviews.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <LoadingSpinner />
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Performance Reviews</Typography>
        {canManage && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateClick}>
            Add Review
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
            label="Search by employee name or feedback"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1, minWidth: 200 }}
          />
          {!isEmployee && (
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Employee</InputLabel>
              <Select
                value={employeeFilter}
                onChange={(e) => setEmployeeFilter(e.target.value)}
                label="Employee"
              >
                <MenuItem value="">All Employees</MenuItem>
                {employees.map((emp) => (
                  <MenuItem key={emp.id} value={emp.id}>
                    {emp.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Rating</InputLabel>
            <Select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              label="Rating"
            >
              <MenuItem value="">All Ratings</MenuItem>
              {[1, 2, 3, 4, 5].map((r) => (
                <MenuItem key={r} value={r}>
                  {r} Star
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Period</InputLabel>
            <Select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              label="Period"
            >
              <MenuItem value="">All Periods</MenuItem>
              {periods.map((period) => (
                <MenuItem key={period} value={period}>
                  {period}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* Reviews Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              {!isEmployee && <TableCell>Employee</TableCell>}
              <TableCell>Rating</TableCell>
              <TableCell>Review Period</TableCell>
              <TableCell>Feedback</TableCell>
              {canManage && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isEmployee ? 4 : 5} align="center" sx={{ py: 3 }}>
                  <Typography color="text.secondary">
                    {reviews.length === 0 ? 'No reviews found' : 'No reviews match your filters'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredReviews.map((review) => (
                <TableRow key={review.id} hover>
                  {!isEmployee && <TableCell>{getEmployeeName(review.employee_id)}</TableCell>}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating value={review.rating} readOnly size="small" />
                      <Typography variant="body2" color="text.secondary">
                        {review.rating}/5
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={review.review_period} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 300 }}>
                    <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {review.feedback}
                    </Typography>
                  </TableCell>
                  {canManage && (
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleEditClick(review)}
                        title="Edit"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(review)}
                        title="Delete"
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Review</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <ReviewForm
            values={formValues}
            onChange={handleFormChange}
            onSubmit={handleCreateSubmit}
            submitting={submitting}
            error={formError}
            submitLabel="Create Review"
            editMode={false}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Review</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <ReviewForm
            values={formValues}
            onChange={handleFormChange}
            onSubmit={handleEditSubmit}
            submitting={submitting}
            error={formError}
            submitLabel="Update Review"
            editMode={true}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Delete Review"
        description="Are you sure you want to delete this review? This action cannot be undone."
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

export default ReviewsPage