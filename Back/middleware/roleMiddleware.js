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