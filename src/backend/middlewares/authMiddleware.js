// middleware autenticacion /authMiddleware.js

const initializeAuth = () => {
  const isAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ msg: 'Usuario no autenticado' });
    }
    next();
  };

  const authorize = (role = []) => {
    if (typeof role === 'string') {
      role = [role];
    }

    return (req, res, next) => {
      if (!req.isAuthenticated() || !req.user || !role.some(role => req.user.role.includes(role))) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      next();
    };
  };

  return { isAuthenticated, authorize };
};

module.exports = initializeAuth;
