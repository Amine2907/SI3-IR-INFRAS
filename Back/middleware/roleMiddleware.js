/**
 * Role-based access control middleware.
 *
 * This middleware is used to restrict access to certain routes based on the user's role.
 * It checks if the user has the required role, and if not, it returns a 403 Forbidden response.
 *
 * @param {string[]} allowedRoles - An array of roles that are allowed to access the route.
 * @returns {function} The middleware function.
 */
export default function(allowedRoles) {
    return (req, res, next) => {
      const userAccess = req.user?.user_access;
      if (!userAccess) {
        return res.status(401).json({ message: 'User access information is missing' });
      }
      if (allowedRoles.includes(userAccess)) {
        return next();
      }
      return res.status(403).json({ message: 'Access denied' });
    };
  };
