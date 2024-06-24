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


    async removeFromCart(userId, productId) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        let cart = await Cart.findOne({ userId: userId });
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        const item = cart.items.find(item => item.product.equals(productId));
        if (!item) {
            throw new Error('Producto no encontrado en el carrito');
        }

        item.quantity -= 1;
        item.totalPrice -= item.price;
        if (item.quantity <= 0) {
            cart.items = cart.items.filter(item => !item.product.equals(productId));
        }

        cart.total = cart.items.reduce((total, item) => total + item.totalPrice, 0);

        await cart.save();
        return cart;
    }

     async getCartByUserId (userId) {
        const cart = await Cart.findOne({ userId }).populate('items.product');
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
    
        const productsInCart = cart.items.map(item => ({
            product: item.product ? item.product.title : "Producto no encontrado",
            quantity: item.quantity,
            image: item.image,
            price: item.price,
            totalPrice: item.price * item.quantity
        }));
    
        return { products: productsInCart, total: cart.total };
    };

}



module.exports = new CartService();
