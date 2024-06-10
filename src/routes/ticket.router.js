const express = require('express');
const passport = require('passport');
const router = express.Router(); // Aquí se crea el router correctamente
const Cart = require('../models/cart.model');
const Ticket = require('../models/ticket.model');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const User = require('../models/user.model')
const Product = require('../models/product.model')

router.post('/save-address', (req, res) => {
    const { address } = req.body;
    if (!address) {
        return res.status(400).json({ success: false, message: 'Dirección es requerida' });
    }

    // Aquí puedes guardar la dirección en la sesión, base de datos, etc.
    req.session.address = address;

    res.json({ success: true, message: 'Dirección guardada correctamente' });
});

router.get('/confirm-address', (req, res) => {
    // Renderizar la vista de confirmación
    res.sendFile(path.join(__dirname, 'path/to/confirm-address.html'));
});

router.get('/api/get-address', (req, res) => {
    const address = req.session.address;
    if (!address) {
        return res.status(404).json({ success: false, message: 'Dirección no encontrada' });
    }
    res.json({ success: true, address });
});



// Ruta para disminuir la cantidad de un producto en el stock del producto
router.post('/remove-from-product', async (req, res) => {
    try {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }

        const { productId } = req.body;
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        let cart = await Cart.findOne({ userId: userId });
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const item = cart.items.find(item => item.product.equals(productId));
        if (!item) {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }

        item.quantity -= 1;
        item.totalPrice -= item.price;
        if (item.quantity <= 0) {
            cart.items = cart.items.filter(item => !item.product.equals(productId));
        }

        cart.total = cart.items.reduce((total, item) => total + item.totalPrice, 0);

        await cart.save();
        res.json({ message: 'Producto eliminado correctamente del carrito' });
    } catch (error) {
        console.error('Error al eliminar el producto del carrito:', error);
        res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
    }
});



// Confirmar compra y reducir stock
router.post('/confirm-purchase', async (req, res) => {
    try {
        const { cartId } = req.body;

        const cart = await Cart.findById(cartId).populate('items.product');
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

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

        res.json({ message: 'Compra confirmada y stock reducido correctamente' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al confirmar la compra' });
    }
});



module.exports = router;
