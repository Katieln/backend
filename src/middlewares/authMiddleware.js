// middleware autenticacion /authMiddleware.js

function isAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ msg: 'Usuario no autenticado' });
  }

  const userId = req.params.userId;

  if (req.user._id.toString() !== userId) {
    return res.status(403).json({ msg: 'No tienes permiso para acceder a este recurso' });
  }

  next();
}



module.exports = isAuthenticated