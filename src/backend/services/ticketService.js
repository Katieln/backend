// services/cartService.js
const mongoose = require('mongoose');
const User = require('../models/user.model');
const Product = require('../models/product.model');
const Cart = require('../models/cart.model');
const Ticket = require('../models/ticket.model')

class TicketService{
    async completePurchase  (userId) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const user = await User.findById(userId).session(session);
            const cart = await Cart.findOne({ userId: userId }).populate('items.product').session(session);
    
            if (!user) {
                await session.abortTransaction();
                session.endSession();
                return { status: 404, error: 'Usuario no encontrado' };
            }
    
            if (!cart) {
                await session.abortTransaction();
                session.endSession();
                return { status: 404, error: 'Carrito no encontrado' };
            }
    
            const existingTicket = await Ticket.findOne({ userId: userId, cartId: cart._id }).session(session);
            if (existingTicket) {
                await session.abortTransaction();
                session.endSession();
                return { status: 400, error: 'Ya existe un ticket para este carrito' };
            }
    
            const products = cart.items.map(item => ({
                productId: item.product._id,
                title: item.product.title,
                quantity: item.quantity,
                price: item.product.price,
                total: item.quantity * item.product.price
            }));
    
            const totalPrice = cart.items.reduce((sum, item) => sum + (item.quantity * item.product.price), 0);
    
            const newTicket = new Ticket({
                userId: user._id,
                cartId: cart._id,
                email: user.email,
                method: user.method,
                address: user.address,
                products: products,
                totalPrice: totalPrice
            });
    
            await newTicket.save({ session });
    
            for (const item of cart.items) {
                const product = await Product.findById(item.product._id).session(session);
                if (product.stock < item.quantity) {
                    await session.abortTransaction();
                    session.endSession();
                    return { status: 400, error: 'Stock insuficiente para el producto: ' + product.title };
                }
                product.stock -= item.quantity;
                await product.save({ session });
            }
    
            cart.items = [];
            cart.total = 0;
            await cart.save({ session });
    
            await session.commitTransaction();
            session.endSession();
            return { status: 200, message: 'Compra completada y stock reducido correctamente' };
        } catch (err) {
            await session.abortTransaction();
            session.endSession();
            console.error('Error al completar la compra:', err);
            return { status: 500, error: 'Error interno del servidor' };
        }
    };
    

    }

    module.exports = new TicketService();