const express = require('express');
const router = express.Router();
const User = require('../models/user.model')
const Cart = require('../models/cart.model');
const isAuthenticated = require('../middlewares/authMiddleware');

// Ruta para obtener el perfil y el carrito del usuario
router.get('/profile',  async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        const cart = await Cart.findOne({ userId: userId }).populate('items.product');

        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        if (!cart) {
            return res.status(404).json({ msg: 'Carrito no encontrado' });
        }

        res.json({
            profile: {
                id: user._id,
                username: user.username,
                email: user.email,
                method: user.method,
            },
            cart: {
                items: cart.items,
                // total: cart.total,
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error al obtener datos del usuario' });
    }
});

module.exports = router;
