// routes/auth.routes.js
const express = require('express');
const passport = require('passport');
const router = express.Router();
const { profile, logout } = require('../controllers/auth.controller');
const { isAuthenticated } = require('../middlewares/authMiddleware');

// ************ Configurar rutas LocalStrtegy ************** //

// Registro de usuarios local
router.post('/register', passport.authenticate('register', {
  successRedirect: '/api/prods/viewPr',
  failureRedirect: '/api/auth/register',
  failureFlash: true
}), (req, res) => {
  res.send('Usuario registrado');
});

// Ruta para renderizar la vista de registro
router.get('/register', (req, res) => {
  res.render('register');
});

// Inicio de sesión local
router.post('/login', passport.authenticate('login', {
  successRedirect: '/api/prods/viewPr',
  failureRedirect: '/api/auth/login',
  failureFlash: true
}), (req, res) => {
  req.session.user = req.user;
  res.json({ user: req.user });
});


// vista de login
router.get('/login', (req, res) => {
  res.render('login', { user: req.session.user });
});



//************* Logout *************/

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { 
      return next(err); 
    }

    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }

      res.clearCookie('connect.sid', { path: '/' }); 

      res.redirect('/api/prods/viewPr');
    });
  });
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




  router.get('/check-auth', (req, res) => {
    res.json({ isAuthenticated: req.isAuthenticated() });
  });

module.exports = router;
