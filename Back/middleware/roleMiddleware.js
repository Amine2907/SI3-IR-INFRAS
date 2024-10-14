module.exports = function(allowedRoles) {
    return (req, res, next) => {
      const userAccess = req.user.user_access;
      if (allowedRoles.includes(userAccess)) {
        return next(); // User has access
      }
      
      return res.status(403).json({ message: 'Access denied' });
    };
  };
  