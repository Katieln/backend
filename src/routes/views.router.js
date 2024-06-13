// routes/auth.routes.js
const express = require('express');
const passport = require('passport');
const { Router } = express;
const router = new Router();
const { profile, logout } = require('../controllers/auth.controller');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const User = require('../models/user.model');
const Cart = require('../models/cart.model');

// Vista profile
router.get('/profile', (req, res) => {
    res.render('profile')
});

// Vista de registro
router.get('/register', (req, res) => {
    res.render('register');
  });

// Vista de cart
router.get('/cart', (req, res) => {
    res.render('cart')
});

// vista de productos
router.get('/products', (req, res) => {
    res.render('products');
});

// vista de ticket
router.get('/ticket', (req, res) => {
    res.render('ticket');
});

//  vista de mail
router.get('/mail', (req, res) => {
    res.render('mail');
  });




module.exports = router;
