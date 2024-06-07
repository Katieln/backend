// const express = require('express');
// const passport = require('passport');
// const router = express.Router(); // Aquí se crea el router correctamente
// const Cart = require('../models/cart.model');
// const Ticket = require('../models/ticket.model');
// const { isAuthenticated } = require('../middlewares/authMiddleware');

// router.post('/checkout', isAuthenticated, async (req, res) => {
//     try {
//         const userId = req.user._id;

//         // Obtener el carrito del usuario
//         const cart = await Cart.findOne({ userId });

//         if (!cart) {
//             return res.status(404).json({ msg: 'Carrito no encontrado' });
//         }

//         // Crear un nuevo ticket con los productos del carrito
//         const ticketData = {
//             userId: cart.userId,
//             products: cart.items.map(item => ({
//                 productId: item.product,
//                 quantity: item.quantity
//             })),
//             total: calcularTotal(cart.items) // Asegúrate de tener la función calcularTotal definida
//         };

//         const newTicket = await Ticket.create(ticketData);

//         // Eliminar el carrito una vez que se haya creado el ticket
//         await Cart.findOneAndDelete({ userId });

//         res.json({ msg: 'Ticket creado exitosamente', ticket: newTicket });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ msg: 'Error al crear el ticket' });
//     }
// });

// module.exports = router;
