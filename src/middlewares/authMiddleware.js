// middlewares/authMiddleware.js

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Usuario no autenticado' });
}

module.exports = isAuthenticated;
