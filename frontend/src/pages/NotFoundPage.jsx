import { Box, Button, Container, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

function NotFoundPage() {
  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', py: 10 }}>
      <Typography variant="h3" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        The page you are looking for does not exist or you may not have permissions to view it.
      </Typography>
      <Button component={RouterLink} to="/dashboard" variant="contained">
        Return to Dashboard
      </Button>
    </Container>
  )
}

export default NotFoundPage
