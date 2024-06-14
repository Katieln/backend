const express = require('express');
const passport = require('passport');
const router = express.Router(); // Aquí se crea el router correctamente
const Cart = require('../models/cart.model');
const Ticket = require('../models/ticket.model');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const User = require('../models/user.model')
const Product = require('../models/product.model')




router.post('/complete-purchase', async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        const cart = await Cart.findOne({ userId: userId }).populate('items.product');

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        // Verificar si ya existe un ticket para este carrito
        const existingTicket = await Ticket.findOne({ userId: userId, cartId: cart._id });
        if (existingTicket) {
            return res.status(400).json({ error: 'Ya existe un ticket para este carrito' });
        }

        // Crear el objeto de productos para el ticket
        const products = cart.items.map(item => ({
            productId: item.product._id,
            title: item.product.title,
            quantity: item.quantity,
            price: item.product.price,
            total: item.quantity * item.product.price
        }));

        // Calcular el precio total del ticket
        const totalPrice = cart.items.reduce((sum, item) => sum + (item.quantity * item.product.price), 0);

        // Crear un nuevo documento de Ticket
        const newTicket = new Ticket({
            userId: user._id,
            email: user.email,
            cartId: cart._id,
            products: products,
            totalPrice: totalPrice
        });

        // Guardar el ticket en la base de datos
        await newTicket.save();

        // Reducir el stock de cada producto en el carrito
        for (const item of cart.items) {
            const product = await Product.findById(item.product._id);
            if (product.stock < item.quantity) {
                return res.status(400).json({ error: 'Stock insuficiente para el producto: ' + product.title });
            }
            product.stock -= item.quantity;
            await product.save();
        }

        // Vaciar el carrito después de confirmar la compra
        cart.items = [];
        cart.total = 0;
        await cart.save();

        res.status(200).json({ success: true, message: 'Compra completada y stock reducido correctamente' });
    } catch (err) {
        console.error('Error al completar la compra:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});






// **********  Ruta obtener Tickets Backend ********** //

router.get('/show', async (req, res) => {
    try {
        const userId = req.user._id; // Asegúrate de que req.user está poblado correctamente con el usuario autenticado

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        const tickets = await Ticket.find({ userId: userId }).populate('products.productId');
        if (tickets.length === 0) {
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
            tickets: tickets
        });
    } catch (err) {
        console.error('Error al obtener los tickets:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});





// **********  Ruta direccion ********** //

router.post('/save-address', (req, res) => {
    const { address } = req.body;
    if (!address) {
        return res.status(400).json({ success: false, message: 'Dirección es requerida' });
    }

   
    req.session.address = address;

    res.json({ success: true, message: 'Dirección guardada correctamente' });
});

router.get('/confirm-address', (req, res) => {
   
    res.sendFile(path.join(__dirname, 'path/to/confirm-address.html'));
});

router.get('/api/get-address', (req, res) => {
    const address = req.session.address;
    if (!address) {
        return res.status(404).json({ success: false, message: 'Dirección no encontrada' });
    }
    res.json({ success: true, address });
});






module.exports = router;
