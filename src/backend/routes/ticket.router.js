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



// ********** Ruta obtener Tickets Backend ********** //
router.get('/show', async (req, res) => {
    try {
        const userId = req.user._id; // Asegúrate de que req.user está poblado correctamente con el usuario autenticado

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        // Ordenar los tickets por fecha de creación en orden descendente
        const ticket = await Ticket.find({ userId: userId }).sort({ createdAt: -1 }).populate('products.productId');
        if (ticket.length === 0) {
            return res.status(404).json({ msg: 'No se encontraron tickets para este usuario' });
        }

        res.status(200).json({
            profile: {
                id: user._id,
                username: user.username,
                email: user.email,
                method: user.method,
                address: user.address,
            },
            ticket: ticket
        });
    } catch (err) {
        console.error('Error al obtener los tickets:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});





module.exports = router;
