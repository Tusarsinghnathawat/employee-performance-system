import { Box, Button, Container, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

function UnauthorizedPage() {
  const navigate = useNavigate()

  return (
    <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Unauthorized Access
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        You do not have permission to access this page.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button variant="contained" onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </Button>
        <Button variant="outlined" onClick={() => navigate('/login')}>
          Login
        </Button>
      </Box>
    </Container>
  )
}

export default UnauthorizedPage