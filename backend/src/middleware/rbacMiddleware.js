/**
 * Role-Based Access Control Middleware
 * Provides helpers to authorize by role or role list
 */

const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  const userRole = req.user?.role;

  if (!userRole) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!allowedRoles.includes(userRole)) {
    return res.status(403).json({
      error: 'Forbidden: insufficient permissions',
    });
  }

  next();
};

module.exports = {
  authorizeRoles,
};
