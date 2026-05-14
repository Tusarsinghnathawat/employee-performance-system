import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { roles } from '../utils/roleHelpers.js'

function EmployeeForm({ values, onChange, onSubmit, submitting, error, submitLabel }) {
  return (
    <Box component="form" onSubmit={onSubmit} noValidate sx={{ maxWidth: 640, mx: 'auto' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {submitLabel}
      </Typography>
      <TextField
        fullWidth
        required
        margin="normal"
        label="Full Name"
        name="name"
        value={values.name}
        onChange={onChange}
      />
      <TextField
        fullWidth
        required
        margin="normal"
        label="Email"
        name="email"
        type="email"
        value={values.email}
        onChange={onChange}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Job Title"
        name="title"
        value={values.title}
        onChange={onChange}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Department"
        name="department"
        value={values.department}
        onChange={onChange}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel id="role-label">Role</InputLabel>
        <Select
          labelId="role-label"
          label="Role"
          name="role"
          value={values.role}
          onChange={onChange}
        >
          <MenuItem value={roles.ADMIN}>Admin</MenuItem>
          <MenuItem value={roles.HR}>HR</MenuItem>
          <MenuItem value={roles.MANAGER}>Manager</MenuItem>
          <MenuItem value={roles.EMPLOYEE}>Employee</MenuItem>
        </Select>
      </FormControl>
      {error && (
        <Typography color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }} disabled={submitting}>
        {submitting ? 'Saving...' : submitLabel}
      </Button>
    </Box>
  )
}

export default EmployeeForm
