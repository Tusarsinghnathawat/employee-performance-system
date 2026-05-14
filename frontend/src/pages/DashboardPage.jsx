import { useEffect, useState } from 'react'
import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { canViewEmployeeList } from '../utils/roleHelpers.js'
import { getEmployees } from '../services/employeeService.js'

function DashboardPage() {
  const { user } = useAuth()
  const [employeeCount, setEmployeeCount] = useState(0)

  useEffect(() => {
    if (canViewEmployeeList(user?.role)) {
      getEmployees()
        .then((data) => {
          const list = data.employees || data || []
          setEmployeeCount(Array.isArray(list) ? list.length : 0)
        })
        .catch(() => setEmployeeCount(0))
    }
  }, [user])

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.name || 'Team'}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Use the dashboard to monitor employee data, review access, and manage profiles based on your role.
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Employee Directory
              </Typography>
              <Typography variant="h3" sx={{ mt: 1 }}>
                {canViewEmployeeList(user?.role) ? employeeCount : 'Restricted'}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Total employees visible to your role.
              </Typography>
              {canViewEmployeeList(user?.role) ? (
                <Button component={RouterLink} to="/employees" sx={{ mt: 2 }} variant="contained">
                  View employees
                </Button>
              ) : (
                <Button component={RouterLink} to={`/employees/${user?.id || user?._id}`} sx={{ mt: 2 }} variant="contained">
                  View My Profile
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Role Overview
              </Typography>
              <Typography variant="h3" sx={{ mt: 1 }}>
                {user?.role?.toUpperCase()}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Your current access level determines the pages and actions you can see.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default DashboardPage
