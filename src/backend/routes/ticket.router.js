const express = require('express');
const passport = require('passport');
const router = express.Router(); // Aquí se crea el router correctamente
const Cart = require('../models/cart.model');
const Ticket = require('../models/ticket.model');
const User = require('../models/user.model')
const Product = require('../models/product.model')
const initializeAuth = require('../middlewares/authMiddleware');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const ticketController = require('../controllers/ticket.controller');

const { isAuthenticated, authorize } = initializeAuth();




// Router para completar la compra

router.post('/complete-purchase', ticketController.completePurchase);



// ********** Ruta obtener Tickets  ********** //
router.get('/show', ticketController.showTickets);






module.exports = router;
