import { Box } from '@mui/material'
import Sidebar from '../components/layout/Sidebar.jsx'
import Topbar from '../components/layout/Topbar.jsx'

function MainLayout({ children }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Topbar />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, bgcolor: '#f4f6f8' }}>
        {children}
      </Box>
    </Box>
  )
}

export default MainLayout
