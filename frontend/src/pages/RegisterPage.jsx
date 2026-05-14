import { useEffect, useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { roles } from '../utils/roleHelpers.js'

function RegisterPage() {
  const { register, user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: roles.EMPLOYEE })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, navigate])

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await register(form)
      navigate('/login')
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'primary.main', mb: 2 }}>
              <PersonAddAltOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ mb: 1 }}>
              Register
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Create an account to manage employees.
            </Typography>
          </Box>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              required
              label="Full Name"
              margin="normal"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              required
              label="Email Address"
              margin="normal"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              required
              label="Password"
              type="password"
              margin="normal"
              name="password"
              value={form.password}
              onChange={handleChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                name="role"
                label="Role"
                value={form.role}
                onChange={handleChange}
              >
                <MenuItem value={roles.EMPLOYEE}>Employee</MenuItem>
                <MenuItem value={roles.MANAGER}>Manager</MenuItem>
                <MenuItem value={roles.HR}>HR</MenuItem>
                <MenuItem value={roles.ADMIN}>Admin</MenuItem>
              </Select>
            </FormControl>
            {error && (
              <Typography color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }} disabled={submitting}>
              {submitting ? 'Creating account...' : 'Register'}
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Link component={RouterLink} to="/login" variant="body2">
                Already have an account?
              </Link>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}

export default RegisterPage
