import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  TextField,
  Typography,
} from '@mui/material'
import { getEmployees } from '../services/employeeService.js'

function ReviewForm({ values, onChange, onSubmit, submitting, error, submitLabel, editMode = false }) {
  const [employees, setEmployees] = useState([])
  const [employeesLoading, setEmployeesLoading] = useState(true)

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees()
        setEmployees(Array.isArray(data.employees) ? data.employees : data || [])
      } catch (err) {
        console.error('Failed to fetch employees:', err)
        setEmployees([])
      } finally {
        setEmployeesLoading(false)
      }
    }

    fetchEmployees()
  }, [])

  const handleRatingChange = (event, newValue) => {
    onChange({
      target: {
        name: 'rating',
        value: newValue,
      },
    })
  }

  return (
    <Box component="form" onSubmit={onSubmit} noValidate sx={{ maxWidth: 640, mx: 'auto' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {submitLabel}
      </Typography>

      {!editMode && (
        <FormControl fullWidth margin="normal" disabled={employeesLoading}>
          <InputLabel id="employee-label">Employee</InputLabel>
          <Select
            labelId="employee-label"
            id="employee-select"
            name="employee_id"
            label="Employee"
            value={values.employee_id || ''}
            onChange={onChange}
            required
          >
            <MenuItem value="">
              <em>Select an employee</em>
            </MenuItem>
            {employees.map((emp) => (
              <MenuItem key={emp.id} value={emp.id}>
                {emp.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <Box sx={{ mt: 3, mb: 2 }}>
        <Typography variant="body2" gutterBottom>
          Rating: {values.rating || 0} / 5
        </Typography>
        <Slider
          name="rating"
          min={1}
          max={5}
          step={1}
          value={values.rating || 3}
          onChange={handleRatingChange}
          marks
          valueLabelDisplay="auto"
        />
      </Box>

      <TextField
        fullWidth
        margin="normal"
        label="Review Period"
        name="review_period"
        placeholder="e.g., Q1 2026"
        value={values.review_period || ''}
        onChange={onChange}
        required
      />

      <TextField
        fullWidth
        margin="normal"
        label="Feedback"
        name="feedback"
        multiline
        rows={4}
        value={values.feedback || ''}
        onChange={onChange}
        required
        placeholder="Enter your review feedback..."
      />

      {error && (
        <Typography color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3 }}
        disabled={submitting || employeesLoading}
      >
        {submitting ? 'Saving...' : submitLabel}
      </Button>
    </Box>
  )
}

export default ReviewForm
