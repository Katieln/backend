const express = require('express');
const passport = require('passport');
const router = express.Router(); // Aquí se crea el router correctamente
const Cart = require('../models/cart.model');
const Ticket = require('../models/ticket.model');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const User = require('../models/user.model')

// router.get('/ticket/:userId', isAuthenticated, async (req, res) => {
//     try {
//         const userId = req.params.userId;

//         const cart = await Cart.findOne({ userId }).populate('items.product').populate('userId');

//         if (!cart) {
//             return res.status(404).json({ msg: 'Carrito no encontrado' });
//         }

//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ msg: 'Usuario no encontrado' });
//         }

//         const productsInCart = cart.items.map(item => ({
//             product: item.product ? item.product.title : "Producto no encontrado",
//             quantity: item.quantity,
//             price: item.price,
//             totalPrice: item.totalPrice,
//             image: item.product ? item.product.image : "No image"
//         }));

//         const cartTotal = cart.total;

//         res.json({
//             user: {
//                 name: user.name,
//                 email: user.email
//             },
//             products: productsInCart,
//             total: cartTotal
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ msg: 'Error al obtener productos del carrito' });
//     }
// });


module.exports = router;
