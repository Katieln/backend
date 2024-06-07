function attachUserEmail(req, res, next) {
    res.locals.userEmail = req.isAuthenticated() ? req.user.email : null;
    next();
  }
  
  module.exports = attachUserEmail;
  