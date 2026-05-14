export const roles = {
  ADMIN: 'admin',
  HR: 'hr',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
}

export const canEditEmployees = (role) => ['admin', 'hr'].includes(role)
export const canDeleteEmployees = (role) => ['admin', 'hr'].includes(role)
export const canViewEmployeeList = (role) => ['admin', 'hr', 'manager'].includes(role)
export const canViewOwnProfile = (role) => ['admin', 'hr', 'manager', 'employee'].includes(role)
export const isEmployeeOnly = (role) => role === 'employee'

export const navigationItems = (user) => {
  const items = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Employees', path: '/employees' },
    { label: 'Reviews', path: '/reviews' },
    { label: 'Development Plans', path: '/development-plans' },
    { label: 'Skills', path: '/skills' },
    { label: 'Training', path: '/training' },
  ]

  // For now, show all items. Later, filter based on roles.
  // if (canViewEmployeeList(user?.role)) {
  //   items.push({ label: 'Employees', path: '/employees' })
  // }

  // if (user?.role === 'employee') {
  //   const userId = user?.id || user?._id
  //   items.push({ label: 'My Profile', path: `/employees/${userId}` })
  // }

  return items
}
