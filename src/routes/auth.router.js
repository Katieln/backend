// routes/auth.routes.js
const express = require('express');
const passport = require('passport');
const {Router} = express
const router = new Router()
const { profile, logout } = require('../controllers/auth.controller');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const User = require ('../models/user.model')
const Cart = require('../models/cart.model')



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

      res.redirect('/api/view/cart');
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
      res.redirect('/api/view/cart');
    } else {
      console.log('Error en la autenticación');
      res.redirect('/login');
    }
  }
);




  router.get('/check-auth', (req, res) => {
    res.json({ isAuthenticated: req.isAuthenticated() });
  });


  // Ruta para obtener el perfil y el carrito del usuario
// router.get('/user/data', isAuthenticated, async (req, res) => {
//   try {
//       const userId = req.user._id;
//       const user = await User.findById(userId);
//       const cart = await Cart.findOne({ userId: userId }).populate('items.product');

//       if (!user) {
//           return res.status(404).json({ msg: 'Usuario no encontrado' });
//       }

//       if (!cart) {
//           return res.status(404).json({ msg: 'Carrito no encontrado' });
//       }

//       res.json({
//           profile: {
//               id: user._id,
//               method: user.method,
//               username: user.username,
//               email: user.email,
//               // otros campos del perfil...
//           },
//           cart: {
//               items: cart.items,
//               total: cart.total,
//               // otros campos del carrito...
//           }
//       });
//   } catch (err) {
//       console.error(err);
//       res.status(500).json({ msg: 'Error al obtener datos del usuario' });
//   }
// });


module.exports = router;
