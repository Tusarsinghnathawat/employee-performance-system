import { useState } from 'react'
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { navigationItems } from '../utils/roleHelpers.js'

const drawerWidth = 240

function DashboardLayout({ children }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [drawerOpen, setDrawerOpen] = useState(!isMobile)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const items = navigationItems(user)

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap>
          Performance Management
        </Typography>
      </Toolbar>
      <List>
        {items.map((item) => (
          <ListItemButton
            component={NavLink}
            key={item.path}
            to={item.path}
            onClick={isMobile ? handleDrawerToggle : undefined}
            sx={{ '&.active': { backgroundColor: 'rgba(25, 118, 210, 0.12)' } }}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box>
              <Typography variant="body1">{user?.name || 'User'}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {user?.role ? user.role.toUpperCase() : 'Guest'}
              </Typography>
            </Box>
            <IconButton color="inherit" onClick={handleLogout}>
              Logout
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={drawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: '64px', // AppBar height
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

export default DashboardLayout