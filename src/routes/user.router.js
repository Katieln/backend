const express = require('express');
const router = express.Router();
const User = require('../models/user.model')
const Cart = require('../models/cart.model');
const Ticket = require('../models/ticket.model')
// const authorize = require('../middlewares/authMiddleware');
const initializeAuth = require('../middlewares/authMiddleware');

const { isAuthenticated, authorize } = initializeAuth();



// Ruta para obtener el perfil y el carrito del usuario
router.get('/profile', isAuthenticated, authorize(['user', 'admin', 'premium']), async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        const cart = await Cart.findOne({ userId: userId }).populate('items.product');

        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        const profileData = {
            id: user._id,
            username: user.username,
            email: user.email,
            method: user.method,
            address: user.address,
            role: user.role
          };

          let cartData = {
            id: null,
            items: [],
            total: 0,
        };

             if (cart) {
            cartData = {
                id: cart.id,
                items: cart.items,
                total: cart.total,
            };
        }

        res.json({
            profile: profileData,
            cart: cartData
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error al obtener datos del usuario' });
    }
});





router.post('/update-address', async (req, res) => {
    try {
        const { userId, newAddress } = req.body;

        // Buscar el usuario por su ID y actualizar la dirección
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { address: newAddress },
            { new: true } // Devuelve el documento actualizado
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json({
            msg: 'Dirección actualizada correctamente',
            data: updatedUser
        });
    } catch (err) {
        console.error('Error al actualizar la dirección del usuario:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


// Ruta para obtener todos los usuarios
router.get('/allU', isAuthenticated, authorize(['admin']), async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.error('Error al obtener usuarios:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


module.exports = router;
