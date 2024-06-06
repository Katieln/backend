// routes/auth.routes.js
const express = require('express');
const passport = require('passport');
const router = express.Router();
const { profile, logout } = require('../controllers/auth.controller');

router.post('/register', passport.authenticate('register', { 
  failureRedirect: '/auth/failedregister' 
}), (req, res) => {
  res.send('Usuario registrado');
});

router.get('/failedregister', (req, res) => {
  res.send('Registro fallido');
});

router.post('/login', passport.authenticate('login', { 
  failureRedirect: '/auth/failedlogin' 
}), (req, res) => {
  req.session.user = req.user.email;
  res.send('Usuario conectado');
});

router.get('/failedlogin', (req, res) => {
  res.send('Inicio de sesión fallido');
});

// ************ Configurar rutas GITHUB ************** //

router.get('/', (req, res) => {
  res.send('¡Hola Mundo!');
});

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async(req,res) => {});

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  async(req, res) => {
    if (req.user) {
      console.log('Autenticación exitosa:', req.user);
      req.session.user = {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email
      };
      res.redirect('/api/prods/viewPr');
    } else {
      console.log('Error en la autenticación');
      res.redirect('/login');
    }
  }
);

 router.post('/register', passport.authenticate('register', { failureRedirect: '/register-failure' }),
  (req, res) => {
    res.redirect('/');
  });


  router.get('/check-auth', (req, res) => {
    res.json({ isAuthenticated: req.isAuthenticated() });
  });

module.exports = router;
