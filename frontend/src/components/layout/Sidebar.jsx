import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { navigationItems } from '../../utils/roleHelpers.js'

const drawerWidth = 240

function Sidebar() {
  const { user } = useAuth()
  const items = navigationItems(user)

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap>
          Menu
        </Typography>
      </Toolbar>
      <Divider />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {items.map((item) => (
            <ListItemButton
              component={NavLink}
              key={item.path}
              to={item.path}
              sx={{ '&.active': { backgroundColor: 'rgba(25, 118, 210, 0.12)' } }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  )
}

export default Sidebar
