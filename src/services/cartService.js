// services/cartService.js
const User = require('../models/user.model');
const Product = require('../models/product.model');
const Cart = require('../models/cart.model');

class CartService {
    async addToCart(userId, productId) {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        const product = await Product.findById(productId);
        if (!product) {
            throw new Error('Producto no encontrado');
        }

        // Verificar si hay suficiente stock
        if (product.stock < 1) {
            throw new Error(`Stock insuficiente para el producto: ${product.title}`);
        }

        let cart = await Cart.findOne({ userId: userId });
        if (!cart) {
            cart = new Cart({
                method: user.method,
                userId: userId,
                userEmail: user.email,
                items: [{ 
                    product: productId, 
                    title: product.title,
                    price: product.price,
                    quantity: 1,
                    image: product.image,
                    totalPrice: product.price }]
            });
        } else {
            const existingItem = cart.items.find(item => item.product.equals(productId));
            if (existingItem) {
                existingItem.quantity += 1;
                existingItem.totalPrice += product.price;
            } else {
                cart.items.push({
                    product: productId,
                    title: product.title,
                    quantity: 1,
                    image: product.image,
                    price: product.price,
                    totalPrice: product.price });
            }
        }

        // Actualizar el precio total del carrito
        cart.total = cart.items.reduce((total, item) => total + item.totalPrice, 0);

        await cart.save();
        return cart;
    }
}

module.exports = new CartService();
