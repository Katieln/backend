const profile = (req, res) => {
    if (!req.isAuthenticated()) {
      return res.redirect('/');
    }
    res.send(`Hola ${req.user.username}, tu correo es ${req.user.email}`);
  };
  
  const logout = (req, res) => {
    req.logout(err => {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  };
  
  module.exports = { profile, logout };
  