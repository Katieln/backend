const express = require('express');
const router = express.Router();
const User = require('../models/user.model')
const Cart = require('../models/cart.model');
const Ticket = require('../models/ticket.model')
// const authorize = require('../middlewares/authMiddleware');
const initializeAuth = require('../middlewares/authMiddleware');
const userController = require ('../controllers/user.controller')



const { isAuthenticated, authorize } = initializeAuth();



// Ruta para obtener el perfil y el carrito del usuario

router.get('/profile', isAuthenticated, authorize(['user', 'admin', 'premium']), userController.getUserProfile);


// Ruta para actualizar el perfil del usuario

router.put('/profile', isAuthenticated, userController.updateUserProfile);



// Ruta para obtener todos los usuarios
router.get('/allU', isAuthenticated, authorize(['admin']), userController.getAllUsers);


module.exports = router;
