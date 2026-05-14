import { Box } from '@mui/material'
import { AuthProvider } from './context/AuthContext.jsx'
import AppRoutes from './routes/AppRoutes.jsx'

function App() {
  return (
    <AuthProvider>
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f4f6f8' }}>
        <AppRoutes />
      </Box>
    </AuthProvider>
  )
}

export default App
