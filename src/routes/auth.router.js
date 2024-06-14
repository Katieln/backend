// routes/auth.routes.js
const express = require('express');
const passport = require('passport');
const {Router} = express
const router = new Router()
const { profile, logout } = require('../controllers/auth.controller');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const User = require ('../models/user.model')
const Cart = require('../models/cart.model')



// ************ Configurar rutas Local ************** //

// Registro de usuarios local
router.post('/register', passport.authenticate('register', {
  successRedirect: '/api/view/products',
  failureRedirect: '/api/auth/register',
  failureFlash: true
}), (req, res) => {
  res.send('Usuario registrado');
});



// Inicio de sesión local
router.post('/login', passport.authenticate('login', {
  successRedirect: '/api/view/products',
  failureRedirect: '/api/auth/login',
  failureFlash: true
}), (req, res) => {
  req.session.user = req.user;
  res.json({ user: req.user });
});


// vista de login
router.get('/login', (req, res) => {
  const userEmail = req.isAuthenticated() ? req.user.email : 'No conectado';
  res.render('login', { userEmail });
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

      res.sendStatus(200);
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
        email: req.user.email,
        address: 'futureAddress',
        
      };
      res.redirect('/api/view/products');
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
