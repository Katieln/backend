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







// Router para completar la compra
// Router para completar la compra
router.post('/complete-purchase', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).session(session);
        const cart = await Cart.findOne({ userId: userId }).populate('items.product').session(session);

        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        if (!cart) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        // Verificar si ya existe un ticket para este carrito
        const existingTicket = await Ticket.findOne({ userId: userId, cartId: cart._id }).session(session);
        if (existingTicket) {
            await session.abortTransaction();
            session.endSession();
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
            cartId: cart._id,
            email: user.email,
            method: user.method,
            address: user.address,
            products: products,
            totalPrice: totalPrice
        });

        // Guardar el ticket en la base de datos
        await newTicket.save({ session });

        // Reducir el stock de cada producto en el carrito
        for (const item of cart.items) {
            const product = await Product.findById(item.product._id).session(session);
            if (product.stock < item.quantity) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ error: 'Stock insuficiente para el producto: ' + product.title });
            }
            product.stock -= item.quantity;
            await product.save({ session });
        }

        // Vaciar el carrito después de confirmar la compra
        cart.items = [];
        cart.total = 0;
        await cart.save({ session });

        await session.commitTransaction();
        session.endSession();
        res.status(200).json({ success: true, message: 'Compra completada y stock reducido correctamente' });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error al completar la compra:', err);

    }
});







// **********  Ruta obtener Tickets Backend ********** //

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
